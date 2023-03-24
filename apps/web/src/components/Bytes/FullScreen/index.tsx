import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import FlagOutline from '@components/Common/Icons/FlagOutline'
import FullScreenModal from '@components/UIElements/FullScreenModal'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
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
    close: () => void
    isShow: boolean
    nextVideo: (val: 1 | -1) => void
    index?: number
}
const FullScreen: FC<Props> = ({ video,
    currentViewingId,
    intersectionCallback,
    close,
    isShow,
    nextVideo,
    index = 0

}) => {
    const videoRef = useRef<HTMLMediaElement>()
    const intersectionRef = useRef<HTMLDivElement>(null)
    const [playing, setPlaying] = useState(false)

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
        setPlaying(true)
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
        videoRef.current.volume = 0
        videoRef.current?.pause()
        videoRef.current.autoplay = false
        setPlaying(false)
    }

    const onClickVideo = () => {
        console.log("paused", videoRef.current)
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
        showControls={true}
        options={{
            autoPlay: false,
            muted: false,
            loop: true,
            loadingSpinner: true
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
                className="flex snap-center justify-between"
                data-testid="byte-video"
            >
                <div className='grow relative'>
                    <div className='absolute z-0 bottom-0 left-0 top-0 right-0 bg-cover bg-center' style={{ backgroundImage: `url(${thumbnailUrl})` }}></div>
                    <div className='flex backdrop-blur-md backdrop-brightness-[0.2]' >
                        <div className='max-md:hidden z-10 '>
                            <button
                                type="button"
                                className="p-2 focus:outline-none m-5 rounded-full  bg-slate-600"
                                onClick={() => close()}
                            >
                                <MdOutlineClose className='text-white w-6 h-6' />
                            </button>
                        </div>
                        <div className={clsx("relative max-md:w-full grow flex")} >
                            <div
                                className="flex h-screen  items-center bg-black md:h-[calc(100vh)] md:w-[56.3vh] md:rounded-sm m-auto"
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
                            <TopOverlay onClickVideo={onClickVideo} isPlaying={playing} />

                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => onClickReport()}
                                className="hover:opacity-100 inline-flex items-center space-x-2 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 absolute right-5 top-5"
                            >
                                <FlagOutline className="h-3.5 w-3.5" />
                                <span className="whitespace-nowrap">Report</span>
                            </button>
                            <div className='flex flex-col gap-2 justify-center h-full mr-5'>

                                <div className="h-[44px]" >
                                    {index > 0 && (<button
                                        className="rounded-full bg-gray-300/20 p-3 focus:outline-none dark:bg-gray-700  hover:bg-gray-800 dark:hover:bg-gray-800"
                                        onClick={() => nextVideo(-1)}
                                    >
                                        <ChevronUpOutline className="h-5 w-5" />
                                    </button>)}
                                </div>
                                <div className="h-25 w-25" >
                                    <button
                                        className="rounded-full bg-gray-300/20 p-3 focus:outline-none dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-800"
                                        onClick={() => nextVideo(1)}
                                    >
                                        <ChevronDownOutline className="h-5 w-5" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex w-[30vw] max-md:hidden'>

                    <Comments video={video} />
                </div>
            </div>
        </FullScreenModal>
    </>
    )
}

export default FullScreen
