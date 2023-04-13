import React, { useRef } from "react"
import CopyOutline from "@components/Common/Icons/CopyOutline"
import Tooltip from "@components/UIElements/Tooltip"
import useAppStore from "@lib/store"
import clsx from "clsx"
import toast from "react-hot-toast"
import formatBytes from "utils/functions/formatBytes"
import imageCdn from "utils/functions/imageCdn"
import sanitizeIpfsUrl from "utils/functions/sanitizeIpfsUrl"
import useCopyToClipboard from "utils/hooks/useCopyToClipboard"
import UploadMethod from "./UploadMethod"

const PreviewVideo = () => {
    const uploadedVideo = useAppStore((state) => state.uploadedVideo)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [copy] = useCopyToClipboard()
    const onCopyVideoSource = async (value: string) => {
        await copy(value)
        toast.success('Video source copied')
    }

    return <div className="w-full">
        <video
            ref={videoRef}
            className="aspect-[9/16] object-contain border h-full"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate"
            poster={imageCdn(
                sanitizeIpfsUrl(uploadedVideo.thumbnail),
                'thumbnail'
            )}
            controls
            src={uploadedVideo.preview}
        >
            <source
                src={uploadedVideo.preview}
                type={uploadedVideo.videoType || 'video/mp4'}
            />
        </video>
        {uploadedVideo.file?.size && (
            <span className="whitespace-nowrap font-semibold">
                {formatBytes(uploadedVideo.file?.size)}
            </span>
        )}
        {uploadedVideo.videoSource && (
            <Tooltip placement="left" content="Copy permanent video URL">
                <button
                    type="button"
                    onClick={() => onCopyVideoSource(uploadedVideo.videoSource)}
                    className="absolute top-2 right-2 rounded-lg bg-orange-200 p-1 px-1.5 text-xs text-black outline-none"
                >
                    <CopyOutline className="h-3.5 w-3.5" />
                </button>
            </Tooltip>
        )}
        <Tooltip content={`Uploaded (${uploadedVideo.percent}%)`}>
            <div className="w-full overflow-hidden rounded-b-full bg-gray-200">
                <div
                    className={clsx(
                        'h-[6px]',
                        uploadedVideo.percent !== 0
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-800'
                    )}
                    style={{
                        width: `${uploadedVideo.percent}%`
                    }}
                />
            </div>
        </Tooltip>
        <UploadMethod />
    </div>
}

export default PreviewVideo
