import IsVerified from '@components/Common/IsVerified'
import Tooltip from '@components/UIElements/Tooltip'
import clsx from 'clsx'
import type { Attribute, Comment, Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { FaRegCommentAlt } from 'react-icons/fa'
import { Analytics, LENSTOK_APP_ID, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils'
import { getRelativeTime, getTimeFromSeconds } from 'utils/functions/formatTime'
import { getValueFromTraitType } from 'utils/functions/getFromAttributes'
import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent'
import getLensHandle from 'utils/functions/getLensHandle'
import getProfilePicture from 'utils/functions/getProfilePicture'
import getThumbnailUrl from 'utils/functions/getThumbnailUrl'
import imageCdn from 'utils/functions/imageCdn'
import useAverageColor from 'utils/hooks/useAverageColor'

type Props = {
  video: Comment
}

const CommentedVideoCard: FC<Props> = ({ video }) => {
  const commentedOn = video.commentOn as Publication
  const isSensitiveContent = getIsSensitiveContent(
    commentedOn?.metadata,
    video.id
  )
  const videoDuration = getValueFromTraitType(
    commentedOn?.metadata?.attributes as Attribute[],
    'durationInSeconds'
  )
  const isBytesVideo = commentedOn.appId === LENSTUBE_BYTES_APP_ID || commentedOn.appId === LENSTOK_APP_ID
  const thumbnailUrl = imageCdn(
    isSensitiveContent
      ? `${STATIC_ASSETS}/images/sensor-blur.png`
      : getThumbnailUrl(commentedOn),
    isBytesVideo ? 'thumbnail_v' : 'thumbnail'
  )
  const { color: backgroundColor } = useAverageColor(thumbnailUrl, isBytesVideo)

  return (
    <div
      onClick={() => Analytics.track(TRACK.CLICK_VIDEO)}
      className="group overflow-hidden rounded-sm"
    >
      <Link href={`/${commentedOn?.id}`}>
        <div className="aspect-w-16 aspect-h-8 relative rounded-sm">
          <img
            src={thumbnailUrl}
            className={clsx(
              'h-full w-full bg-gray-100 object-center dark:bg-gray-900 md:rounded-sm lg:h-full lg:w-full',
              isBytesVideo ? 'object-contain' : 'object-cover'
            )}
            style={{
              backgroundColor: backgroundColor && `${backgroundColor}95`
            }}
            alt="thumbnail"
            draggable={false}
          />
          {isSensitiveContent && (
            <div className="absolute top-2 left-3">
              <span className="rounded-full bg-white py-0.5 px-2 text-[10px] text-black">
                Sensitive Content
              </span>
            </div>
          )}
          {!isSensitiveContent && videoDuration ? (
            <div>
              <span className="absolute bottom-2 right-2 rounded bg-black py-0.5 px-1 text-xs text-white">
                {getTimeFromSeconds(videoDuration)}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <Link
            href={`/channel/${getLensHandle(commentedOn.profile?.handle)}`}
            className="mt-0.5 flex-none"
          >
            <img
              className="h-8 w-8"
              src={getProfilePicture(commentedOn?.profile, 'avatar')}
              alt={getLensHandle(commentedOn?.profile?.handle)}
              draggable={false}
            />
          </Link>
          <div className="grid-col grid flex-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5">
              <Link
                className="line-clamp-1 break-words text-[15px] font-medium opacity-80"
                href={`/${commentedOn.id}`}
                title={commentedOn.metadata?.name ?? ''}
              >
                {commentedOn.metadata?.name}
              </Link>
            </div>
            <Link
              href={`/channel/${getLensHandle(commentedOn.profile?.handle)}`}
              className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70 hover:opacity-100"
            >
              <span>{commentedOn.profile?.handle}</span>
              <IsVerified id={commentedOn.profile?.id} size="xs" />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden pb-1.5 pt-2 text-sm opacity-90">
          <div className="absolute inset-0 left-3 bottom-5 flex w-1.5 justify-center pb-2">
            <div className="pointer-events-none w-0.5 bg-gray-300 dark:bg-gray-700" />
          </div>
          <Tooltip content="Commented">
            <span className="absolute bottom-1 m-2 opacity-70">
              <FaRegCommentAlt className="h-3.5 w-3.5" />
            </span>
          </Tooltip>
          <div className="pl-8">
            <div className="line-clamp-1 text-xs">
              {video.metadata?.content}
            </div>
            <div className="flex items-center text-xs leading-3 opacity-70">
              <span title={video.createdAt}>
                {getRelativeTime(video.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CommentedVideoCard)
