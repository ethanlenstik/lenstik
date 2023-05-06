
import ThumbnailsShimmer from '@components/Shimmers/ThumbnailsShimmer'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { ChangeEvent, FC } from 'react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { AiOutlineFileAdd } from 'react-icons/ai'
import type { IPFSUploadResult } from 'utils'
import { generateVideoThumbnails } from 'utils/functions/generateVideoThumbnails'
import { getFileFromDataURL } from 'utils/functions/getFileFromDataURL'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'
import uploadToIPFS from 'utils/functions/uploadToIPFS'
import logger from 'utils/logger'

interface Props {
  label: string
  file: File | null
}

const DEFAULT_THUMBNAIL_INDEX = 0
export const THUMBNAIL_GENERATE_COUNT = 8

type Thumbnail = {
  blobUrl: string
  ipfsUrl: string
  mimeType: string
}

const ChooseThumbnail: FC<Props> = ({ label, file }) => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([])
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(-1)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  const uploadThumbnailToIpfs = async (fileToUpload: File) => {
    setUploadedVideo({ uploadingThumbnail: true })
    const result: IPFSUploadResult = await uploadToIPFS(fileToUpload)
    if (!result.url) {
      toast.error('Failed to upload thumbnail')
    }
    setUploadedVideo({
      thumbnail: result.url,
      thumbnailType: fileToUpload.type || 'image/jpeg',
      uploadingThumbnail: false
    })
    return result
  }

  const onSelectThumbnail = async (index: number) => {
    setSelectedThumbnailIndex(index)
    if (thumbnails[index]?.ipfsUrl === '') {
      setUploadedVideo({ uploadingThumbnail: true })
      getFileFromDataURL(
        thumbnails[index].blobUrl,
        'thumbnail.jpeg',
        async (file) => {
          if (!file) {
            return toast.error('Please upload a custom thumbnail')
          }
          const ipfsResult = await uploadThumbnailToIpfs(file)
          setThumbnails(
            thumbnails.map((thumbnail, i) => {
              if (i === index) {
                thumbnail.ipfsUrl = ipfsResult?.url
              }
              return thumbnail
            })
          )
        }
      )
    } else {
      setUploadedVideo({
        thumbnail: thumbnails[index]?.ipfsUrl,
        thumbnailType: thumbnails[index]?.mimeType || 'image/jpeg',
        uploadingThumbnail: false
      })
    }
  }

  const generateThumbnails = async (fileToGenerate: File) => {
    try {
      const thumbnailArray = await generateVideoThumbnails(
        fileToGenerate,
        THUMBNAIL_GENERATE_COUNT
      )
      const thumbnailList: Thumbnail[] = []
      thumbnailArray.forEach((thumbnailBlob) => {
        thumbnailList.push({
          blobUrl: thumbnailBlob,
          ipfsUrl: '',
          mimeType: 'image/jpeg'
        })
      })
      setThumbnails(thumbnailList)
      setSelectedThumbnailIndex(DEFAULT_THUMBNAIL_INDEX)
    } catch { }
  }

  useEffect(() => {
    onSelectThumbnail(selectedThumbnailIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThumbnailIndex])

  useEffect(() => {
    if (file) {
      generateThumbnails(file).catch((error) =>
        logger.error('[Error Generate Thumbnails from File]', error)
      )
    }
    return () => {
      setSelectedThumbnailIndex(-1)
      setThumbnails([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedThumbnailIndex(-1)
      toast.loading('Uploading thumbnail')
      const file = e.target.files[0]
      const result = await uploadThumbnailToIpfs(file)
      const preview = window.URL?.createObjectURL(file)
      setThumbnails([
        {
          blobUrl: preview,
          ipfsUrl: result.url,
          mimeType: file.type || 'image/jpeg'
        },
        ...thumbnails
      ])
      setSelectedThumbnailIndex(0)
    }
  }

  return (
    <div className="w-full">
      {label && (
        <div className="my-5 flex items-center space-x-1.5">
          <div className="text-[13px] font-semibold uppercase opacity-70">
            {label}
          </div>
        </div>
      )}
      <div className="flex p-0.5 gap-1 justify-between border rounded-lg">
        {!thumbnails.length && (
          <ThumbnailsShimmer />
        )}
        {thumbnails.map((thumbnail, idx) => {
          return (
            <button
              key={idx}
              type="button"
              disabled={
                uploadedVideo.uploadingThumbnail &&
                selectedThumbnailIndex === idx
              }
              onClick={() => onSelectThumbnail(idx)}
              className={clsx("h-32 max-w-[5rem]",
                selectedThumbnailIndex === idx ? 'rounded-lg  brightness-100' : 'brightness-50'

              )}
            >
              <img
                className={clsx(
                  'h-32 w-18 object-cover rounded-lg', selectedThumbnailIndex === idx && 'min-w-[4rem] scale-105 !ring !ring-[#30BFA8] ',
                )}
                src={sanitizeDStorageUrl(thumbnail.blobUrl)}
                alt="thumbnail"
                draggable={false}
              />
              {uploadedVideo.uploadingThumbnail &&
                selectedThumbnailIndex === idx && (
                  <div className="absolute top-1 right-1">
                    <span>
                      <Loader size="sm" className="!text-white" />
                    </span>
                  </div>
                )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ChooseThumbnail

