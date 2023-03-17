import Alert from '@components/Common/Alert'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import CopyOutline from '@components/Common/Icons/CopyOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import type { Publication } from 'lens'
import { PublicationMainFocus, useProfileCommentsQuery } from 'lens'
import dynamic from 'next/dynamic'
import type { FC  } from 'react'
import React, {useState} from 'react'
import { useInView } from 'react-cool-inview'
import { RiShareForwardLine } from 'react-icons/ri'
import { Analytics, LENSTUBE_WEBSITE_URL, LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN, TRACK } from 'utils'

import NewComment from './NewComment'
import PublicationReaction from './PublicationReaction'
import QueuedComment from './QueuedComment'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import CollectVideo from './CollectVideo'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: Publication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showShare, setShowShare] = useState(false)

  const isFollowerOnlyReferenceModule =
    video?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings'

  const request = {
    limit: 30,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: video.id,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Video,
        PublicationMainFocus.Article,
        PublicationMainFocus.Embed,
        PublicationMainFocus.Link,
        PublicationMainFocus.TextOnly
      ]
    }
  }
  const variables = {
    request,
    reactionRequest: selectedChannel
      ? { profileId: selectedChannel?.id }
      : null,
    channelId: selectedChannel?.id ?? null
  }

  const { data, loading, error, fetchMore } = useProfileCommentsQuery({
    variables,
    skip: !video.id
  })

  const comments = data?.publications?.items as Publication[]
  const pageInfo = data?.publications?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          ...variables,
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading) {
    return <CommentsShimmer />
  }

  // const [copy] = useCopyToClipboard()

  const onCopyVideoUrl = async () => {
    // await copy(`${LENSTUBE_WEBSITE_URL}/${video.id}`)
    // toast.success('Link copied to clipboard')
    // Analytics.track(TRACK.COPY.VIDEO_URL)
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="text-white md:text-inherit flex gap-3">
          <PublicationReaction
            publication={video}
            iconSize="lg"
            isVertical={false}
            showLabel
          />
          <MirrorVideo video={video} >
            <div className="flex items-center justify-center gap-1 ">
              <div className='rounded-full bg-gray-200 dark:bg-gray-600 p-2'>
                <MirrorOutline className="h-6 w-6 " />
              </div>
              <div className="pt-1 text-xs">
                {video.stats?.totalAmountOfMirrors || 'Mirror'}
              </div>
            </div>
          </MirrorVideo>
        </div>

        <div className='flex'>
          <button
            type="button"
            onClick={() => setShowShare(true)}
          >
            <div className=' rounded-full  bg-gray-200 dark:bg-gray-600 p-2'>
              <RiShareForwardLine className="h-6 w-6" />
            </div>
          </button>
          {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
            <div className="text-center flex center">
              <CollectVideo video={video} />
              <div className="text-center text-xs leading-3">
                {video.stats?.totalAmountOfCollects}
              </div>
            </div>
          )}
        </div>

      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800 my-3">
        <div className="select-all truncate text-sm">
          {LENSTUBE_WEBSITE_URL}/{video.id}
        </div>
        <button
          className="ml-2 hover:opacity-60 focus:outline-none"
          onClick={() => onCopyVideoUrl()}
          type="button"
        >
          <CopyOutline className="h-4 w-4" />
        </button>
      </div>
      {data?.publications?.items.length === 0 && (
        <NoDataFound text="Be the first to comment." withImage isCenter />
      )}
      {!error && (queuedComments.length || comments.length) ? (
        <>
          <div className="space-y-4 pt-5  overflow-y-auto overflow-x-hidden top-[300px] bottom-[80px] absolute w-full ">
            {queuedComments?.map(
              (queuedComment) =>
                queuedComment?.pubId === video?.id && (
                  <QueuedComment
                    key={queuedComment?.pubId}
                    queuedComment={queuedComment}
                  />
                )
            )}
            {comments?.map((comment: Publication) => (
              <Comment
                key={`${comment?.id}_${comment.createdAt}`}
                comment={comment}
              />
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      ) : null}

      <div className='absolute bottom-5 w-[100%]'>

        {!selectedChannelId && (
          <span className="text-xs">(Sign in required to comment)</span>
        )}
        {video?.canComment.result ? (
          <NewComment video={video} />
        ) : selectedChannelId ? (
          <Alert variant="warning">
            <span className="text-sm">
              {isFollowerOnlyReferenceModule
                ? 'Only subscribers can comment on this publication'
                : `Only subscribers within ${video.profile.handle}'s preferred network can comment`}
            </span>
          </Alert>
        ) : null}
      </div>
    </>
  )
}

export default VideoComments
