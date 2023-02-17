import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import FullScreenModal from '@components/UIElements/FullScreenModal'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useMemo, useRef } from 'react'
import { MdOutlineClose } from 'react-icons/md'
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
                className="flex snap-center justify-between gap-10 px-5"
                data-testid="byte-video"
            >
                <div>
                    <button
                        type="button"
                        className="rounded-md bg-gray-100 p-1 focus:outline-none dark:bg-gray-900 "
                        onClick={() => callShow(false)}
                    >
                        <MdOutlineClose />
                    </button>
                </div>
                <div className="relative">
                    <div
                        className="flex h-screen  items-center bg-black md:h-[calc(100vh)] md:w-[450px] md:rounded-xl"
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
                <div className='flex'>
                    <div className="flex-col space-y-3 pr-5 lg:flex m-auto">
                        <button
                            className="rounded-full bg-gray-300 p-3 focus:outline-none dark:bg-gray-700"
                            onClick={() => scroll(-30)}
                        >
                            <ChevronUpOutline className="h-5 w-5" />
                        </button>
                        <button
                            className="rounded-full bg-gray-300 p-3 focus:outline-none dark:bg-gray-700"
                            onClick={() => scroll(30)}
                        >
                            <ChevronDownOutline className="h-5 w-5" />
                        </button>
                    </div>
                    <Comments video={video} />
                </div>
            </div>
        </FullScreenModal>
    </>
    )
}

export default FullScreen
