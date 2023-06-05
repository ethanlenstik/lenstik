import InterweaveContent from '@components/Common/InterweaveContent'
import { CardShimmer } from '@components/Shimmers/VideoCardShimmer'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import dynamic from 'next/dynamic'
import type { FC } from 'react'
import React from 'react'
import { LENSTIK_APP_ID, LENSTUBE_BYTES_APP_ID } from 'utils'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import { getPublicationMediaUrl } from 'utils/functions/getPublicationMediaUrl'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'

import VideoActions from './VideoActions'
import VideoMeta from './VideoMeta'

const VideoPlayer = dynamic(() => import('web-ui/VideoPlayer'), {
  loading: () => <CardShimmer rounded={false} />,
  ssr: false
})

type Props = {
  video: Publication
}

const Video: FC<Props> = ({ video }) => {
  const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id)
  const videoWatchTime = useAppStore((state) => state.videoWatchTime)
  const isBytesVideo = video.appId === LENSTUBE_BYTES_APP_ID || video.appId === LENSTIK_APP_ID

  return (
    <div className="overflow-hidden">
      <VideoPlayer
        currentTime={videoWatchTime}
        permanentUrl={getPublicationMediaUrl(video)}
        posterUrl={imageCdn(
          sanitizeIpfsUrl(getThumbnailUrl(video)),
          isBytesVideo ? 'thumbnail_v' : 'thumbnail'
        )}
        options={{ loadingSpinner: true }}
        isSensitiveContent={isSensitiveContent}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="line-clamp-2 mt-4 text-lg font-medium"
            data-testid="watch-video-title"
          >
            <InterweaveContent content={video.metadata?.name as string} />
          </h1>
          <VideoMeta video={video} />
        </div>
      </div>
      <VideoActions video={video} />
    </div>
  )
}

export default Video
