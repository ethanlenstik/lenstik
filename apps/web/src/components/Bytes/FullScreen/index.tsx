import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import FlagOutline from '@components/Common/Icons/FlagOutline'
import FullScreenModal from '@components/UIElements/FullScreenModal'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import { MdOutlineClose } from 'react-icons/md'
import { SIGN_IN_REQUIRED_MESSAGE } from 'utils'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'
import TopOverlay from '../TopOverlay'
import Comments from './Comments'

type Props = {
    video: Publication
    currentViewingId: string
    intersectionCallback: (id: string) => void
    callShow: (isShow: boolean) => void
    isShow: boolean
    scroll: (val: 30 | -30) => void
}
const FullScreen: FC<Props> = ({ video,
    currentViewingId,
    intersectionCallback,
    callShow,
    isShow,
    scroll

}) => {
    const videoRef = useRef<HTMLMediaElement>()
    const intersectionRef = useRef<HTMLDivElement>(null)

    const thumbnailUrl = imageCdn(
        sanitizeIpfsUrl(getThumbnailUrl(video)),
        'thumbnail_v'
    )
    const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)

    const playVideo = () => {
        if (!videoRef.current) {
            return
        }
        videoRef.current.currentTime = 0
        videoRef.current.volume = 1
        videoRef.current.autoplay = true
        videoRef.current?.play().catch(() => { })
    }

    const observer = new IntersectionObserver((data) => {
        if (data[0].target.id && data[0].isIntersecting) {
            intersectionCallback(data[0].target.id)
            const nextUrl = `${location.origin}/${video?.id}`
            history.replaceState({ path: nextUrl }, '', nextUrl)
            playVideo()
        }
    })

    useEffect(() => {
        if (intersectionRef.current) {
            observer.observe(intersectionRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const pauseVideo = () => {
        if (!videoRef.current) {
            return
        }
        videoRef.current?.pause()
        videoRef.current.autoplay = false
    }

    const onClickVideo = () => {
        if (videoRef.current?.paused) {
            playVideo()
        } else {
            pauseVideo()
        }
    }

    const refCallback = (ref: HTMLMediaElement) => {
        if (!ref) {
            return
        }
        videoRef.current = ref
        playVideo()
    }


    const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
    const onClickReport = () => {
        if (!selectedChannelId) {
            return toast.error(SIGN_IN_REQUIRED_MESSAGE)
        }
    }

    const player = useMemo(() => (<VideoPlayer
        refCallback={refCallback}
        permanentUrl={getPublicationMediaUrl(video)}
        posterUrl={thumbnailUrl}
        ratio="9to16"
        publicationId={video.id}
        showControls={false}
        options={{
            autoPlay: false,
            muted: false,
            loop: true,
            loadingSpinner: false
        }}
    />), [video])

    return (<>

        {/* <TopOverlay  onClickVideo={() => setShow(true)} /> */}
        <FullScreenModal

            panelClassName="max-w-full"
            show={isShow}
            autoClose
        >
            <div
                className="flex snap-center justify-between px-5"
                data-testid="byte-video"
            >
                <div className='max-md:hidden'>
                    <button
                        type="button"
                        className="rounded-md  p-1 focus:outline-none mt-5 "
                        onClick={() => callShow(false)}
                    >
                        <MdOutlineClose />
                    </button>
                </div>
                <div className="relative max-md:w-full">
                    <div
                        className="flex h-screen  items-center bg-black md:h-[calc(100vh)] md:w-[56.3vh] md:rounded-xl"
                        style={{
                            backgroundColor: backgroundColor ? backgroundColor : undefined
                        }}
                    >
                        <div
                            className="absolute"
                            ref={intersectionRef}
                            id={video.id}
                        />
                        {currentViewingId === video.id ? player : (
                            <img
                                className="w-full object-contain"
                                src={thumbnailUrl}
                                alt="thumbnail"
                                draggable={false}
                            />
                        )}
                    </div>
                    <TopOverlay onClickVideo={onClickVideo} />

                </div>
                <div className='flex w-[35vw] max-md:hidden'>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => onClickReport()}
                            className="hover:opacity-100 inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 absolute right-5 top-5"
                        >
                            <FlagOutline className="h-3.5 w-3.5" />
                            <span className="whitespace-nowrap">Report</span>
                        </button>
                        <div className='flex flex-col justify-center h-full mr-5'>
                            <div>
                                <button
                                    className="rounded-full bg-gray-300 p-3 focus:outline-none dark:bg-gray-700"
                                    onClick={() => scroll(-30)}
                                >
                                    <ChevronUpOutline className="h-5 w-5" />
                                </button>
                            </div>
                            <div>
                                <button
                                    className="rounded-full bg-gray-300 p-3 focus:outline-none dark:bg-gray-700"
                                    onClick={() => scroll(30)}
                                >
                                    <ChevronDownOutline className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Comments video={video} />
                </div>
            </div>
        </FullScreenModal>
    </>
    )
}

export default FullScreen
