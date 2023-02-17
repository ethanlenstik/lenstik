import CollectVideo from '@components/Watch/CollectVideo'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: Publication
  currentViewingId: string
  intersectionCallback: (id: string) => void
  onDetail: () => void
  isShow: boolean
}

const ByteVideo: FC<Props> = ({
  video,
  currentViewingId,
  intersectionCallback,
  onDetail,
  isShow
}) => {
  const videoRef = useRef<HTMLMediaElement>()
  const intersectionRef = useRef<HTMLDivElement>(null)
  const thumbnailUrl = imageCdn(
    sanitizeIpfsUrl(getThumbnailUrl(video)),
    'thumbnail_v'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, true)

  const playVideo = () => {
    console.log(!videoRef.current || !isShow)
    if (!videoRef.current || isShow) {
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
      console.log("observer call play video")
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
    onDetail()
    pauseVideo()
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return
    }
    videoRef.current = ref
    playVideo()
  }

  return (
    <div
      className="flex snap-center justify-center md:mt-6"
      data-testid="byte-video"
    >
      <div className="relative">
        <div
          className="ultrawide:w-[407px] flex h-screen w-screen min-w-[250px] items-center overflow-hidden bg-black md:h-[calc(100vh-120px)] md:w-[350px] md:rounded-xl"
          style={{
            backgroundColor: backgroundColor ? backgroundColor : undefined
          }}
        >
          <div
            className="absolute top-[50%]"
            ref={intersectionRef}
            id={video.id}
          />
          {currentViewingId === video.id ? (
            <VideoPlayer
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
            />
          ) : (
            <img
              className="w-full object-contain"
              src={thumbnailUrl}
              alt="thumbnail"
              draggable={false}
            />
          )}
        </div>
        <TopOverlay onClickVideo={() => onClickVideo()} />
        <BottomOverlay video={video} />
        <div className="absolute right-2 bottom-[15%] z-[1] md:hidden">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
              <div className="text-center text-white md:text-gray-500">
                <CollectVideo video={video} />
                <div className="text-xs">
                  {video.stats?.totalAmountOfCollects || 'Collect'}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={video} />
      </div>
    </div>
  )
}

export default React.memo(ByteVideo)
