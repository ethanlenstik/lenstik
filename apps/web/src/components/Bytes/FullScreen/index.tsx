import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import FlagOutline from '@components/Common/Icons/FlagOutline'
import FullScreenModal from '@components/UIElements/FullScreenModal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { BsFlag } from 'react-icons/bs'
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
import ByteActions from '../ByteActions'

type Props = {
    videos: Publication[]
    close: () => void
    isShow: boolean
    nextVideo: (val: 1 | -1) => void
    index?: number
}
const FullScreen: FC<Props> = ({ videos,
    close,
    isShow,
    nextVideo,
    index = 0

}) => {

    const setCurrentViewingId = useAppStore((state) => state.setCurrentviewingId)
    const currentViewingId = useAppStore((state) => state.currentviewingId)
    const video: any = videos?.find(item => item.id === currentViewingId)
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
            setCurrentViewingId(data[0].target.id)
            // const nextUrl = `${location.origin}/${video?.id}`
            // history.replaceState({ path: nextUrl }, '', nextUrl)
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
    const mute = useAppStore((state) => state.isMute)

    const player = <VideoPlayer
        refCallback={refCallback}
        permanentUrl={getPublicationMediaUrl(video)}
        posterUrl={thumbnailUrl}
        ratio="9to16"
        publicationId={video.id}
        showControls={true}
        isFull={true}
        options={{
            autoPlay: false,
            loop: true,
            loadingSpinner: true,
            muted: mute
        }}
    />

    const displayControl = (videoFull: boolean) => {
        const vidEl = document.querySelector(`#videoFull`)
        const elVol = vidEl && vidEl.querySelectorAll<HTMLButtonElement>(`#videoFull .c-hmIsCl`)[0]
        if (!elVol) {
            return
        }
        elVol.style.visibility = videoFull ? "visible" : "hidden"
    }

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
                id="videoFull"
            >
                <div className='grow relative'>
                    <div className='relative w-full h-full bg-cover bg-center flex' style={{ backgroundImage: `url(${thumbnailUrl})` }} >
                        <div className='z-10 absolute'>
                            <button
                                type="button"
                                className="p-2 focus:outline-none m-5 rounded-full  bg-slate-600"
                                onClick={() => close()}
                            >
                                <MdOutlineClose className='text-white w-6 h-6' />
                            </button>
                        </div>
                        <div className={clsx("relative max-md:w-full grow flex  backdrop-blur-md backdrop-brightness-[0.2] ")}
                            onMouseEnter={() => displayControl(true)}
                            onMouseLeave={() => displayControl(false)}>
                            <div
                                className="flex  items-center bg-black min-w-[56.25vh] md:rounded-sm m-auto"
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
                            <div className="absolute z-10 right-0 bottom-10 md:hidden">
                                <ByteActions video={video} inDetail={true} />
                            </div>

                            {/* <TopOverlay onClickVideo={onClickVideo} full={true} id={video.id} /> */}

                        </div>
                        <button
                            type="button"
                            onClick={() => onClickReport()}
                            className=" max-md:hidden inline-flex  bg-gray-300/2 items-center space-x-2 rounded-full px-2 py-1.5 dark:bg-gray-700  hover:bg-gray-800 dark:hover:bg-gray-800 absolute right-5 top-6"
                        >
                            <BsFlag className="h-3.5 w-3.5" fill='white' />
                            <span className="whitespace-nowrap text-white">Report</span>
                        </button>
                        <div className='flex flex-col gap-2 justify-center absolute right-0 top-[calc(50vh-5rem)] z-10 mr-5'>

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
                <div className='flex flex-col w-[30vw] max-md:hidden max-w-[544px] p-5 flex-shrink-0 h-screen items-stretch'>
                    <Comments video={video} />
                </div>
            </div>

            {/* <div className="bg-[url('/compare.png')] bg-cover bg-center absolute z-100 top-0 bottom-0 right-0 left-0"></div> */}
        </FullScreenModal>
    </>
    )
}

export default FullScreen
