import CollectVideo from '@components/Watch/CollectVideo'
import Link from 'next/link'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useAverageColor from 'utils/hooks/useAverageColor'
import VideoPlayer from 'web-ui/VideoPlayer'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'
import clsx from 'clsx'
import useAppStore from '@lib/store'

type Props = {
  video: Publication
  currentViewingId: string
  intersectionCallback: (id: string) => void
  onDetail: (videoId: string) => void
  isShow: boolean
  index?: number
}

const ByteVideo: FC<Props> = ({
  video,
  currentViewingId,
  intersectionCallback,
  onDetail,
  isShow,
  index
}) => {
  const videoRef = useRef<HTMLMediaElement>()
  const intersectionRef = useRef<HTMLDivElement>(null)
  const mute = useAppStore((state) => state.isMute)
  const setMute = useAppStore((state)=> state.setMute)
  const thumbnailUrl = imageCdn(
    sanitizeIpfsUrl(getThumbnailUrl(video)),
    'thumbnail_v'
  )

  const playVideo = () => {
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
      // if (isShow) {
      //   const nextUrl = `${location.origin}/${video?.id}`
      //   history.replaceState({ path: nextUrl }, '', nextUrl)
      // }
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

  const onClickVideo = (event: any) => {
    event.preventDefault();
    onDetail(video.id)
    pauseVideo()
  }

  const refCallback = (ref: HTMLMediaElement) => {
    if (!ref) {
      return
    }
    videoRef.current = ref
    playVideo()
  }

  const channel = video.profile
  return (
    <div className={clsx(index != 0 && ' border-t dark:border-slate-600 ', 'flex mt-8')}>
      <Link
        href={`/channel/${channel?.handle}`}
        className="flex flex-none cursor-pointer items-top space-x-2 mt-4  max-md:hidden"
      >
        <img
          src={getProfilePicture(channel, 'avatar')}
          className="h-14 w-14 rounded-full mr-3"
          draggable={false}
          alt={channel?.handle}
        />
      </Link>
      <div className='h-full w-full relative'>
        <BottomOverlay video={video} />
        <div
          className="flex snap-center"
          data-testid="byte-video"
        >
          <div className="relative bottom-0">
            <div
              className={clsx("ultrawide:w-[407px] flex h-screen w-screen min-w-[260px] max-w-[336px] items-center overflow-hidden bg-black md:w-[22vw] md:rounded-xl", isShow ? "md:h-[95vh]" : "md:h-[55vh] max-h-[700px] min-h-[500px]")}
              style={{
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="absolute top-[50%]"
                ref={intersectionRef}
                id={video.id}
              />
              {currentViewingId === video.id ? (
                <VideoPlayer
                  borderRadd={10}
                  refCallback={refCallback}
                  permanentUrl={getPublicationMediaUrl(video)}
                  posterUrl={thumbnailUrl}
                  ratio="9to16"
                  publicationId={video.id}
                  showControls={false}
                  options={{
                    autoPlay: false,
                    muted: mute,
                    loop: true,
                    loadingSpinner: true
                  }}
                />
              ) : (
                <img
                  className="w-full object-contain rounded-[10px]"
                  src={thumbnailUrl}
                  alt="thumbnail"
                  draggable={false}
                />
              )}
            </div>
            <TopOverlay onClickVideo={onClickVideo} onClickVolume={()=> setMute(!mute)} isPlaying={true} mute={mute} />
            <div className="absolute right-2 bottom-[15%] z-[1] md:hidden">
              <ByteActions video={video} showDetail={()=> onDetail(video.id)} />
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
            <ByteActions video={video} showDetail={()=> onDetail(video.id)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(ByteVideo)
