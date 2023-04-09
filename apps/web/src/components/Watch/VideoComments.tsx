import Alert from '@components/Common/Alert'
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
import type { FC } from 'react'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import { RiShareForwardLine } from 'react-icons/ri'
import { Analytics, LENSTUBE_WEBSITE_URL, LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN, TRACK } from 'utils'

import NewComment from './NewComment'
import PublicationReaction from './PublicationReaction'
import QueuedComment from './QueuedComment'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import CollectVideo from './CollectVideo'
import BottomOverlay from '@components/Bytes/BottomOverlay'
import { Link } from 'interweave-autolink'
import getProfilePicture from 'utils/functions/getProfilePicture'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'
import toast from 'react-hot-toast'
import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import Tooltip from '@components/UIElements/Tooltip'

const Comment = dynamic(() => import('./Comment'))

type Props = {
  video: Publication
  hideTitle?: boolean
}

const VideoComments: FC<Props> = ({ video, hideTitle = false }) => {
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const queuedComments = usePersistStore((state) => state.queuedComments)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [copy] = useCopyToClipboard()
  const [showShare, setShowShare] = useState(false)
  const channel = video.profile

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
    await copy(document.URL)
    toast.success('Link copied to clipboard')
    // Analytics.track(TRACK.COPY.VIDEO_URL)
  }

  const subscribeType = video.profile?.followModule?.__typename
  return (
    <>
      <div className='mx-7 h-auto relative'>
        <div className='flex justify-between'>
          <div className="z-[1] pt-5 pb-3 md:rounded-b-xl mr-1">
            <div className="flex justify-between">
              <div>
                <div className='flex mb-5 justify-between flex-wrap'>
                  <a className='flex gap-4' href={`/channel/${channel?.handle}`}>
                    <img
                      src={getProfilePicture(channel, 'avatar')}
                      className="h-10 w-10 rounded-full mt-1"
                      draggable={false}
                      alt={channel?.handle}
                    />
                    <div>
                      <span className="font-bold text-base">{video.profile.name}</span> <br />
                      <span className='text-sm font-thin inline-flex'>@{video.profile.handle} &nbsp; <Tooltip content="Verified" placement="right">
                        <span>
                          <IsVerified id={channel?.id} size="md" />
                        </span>
                      </Tooltip>
                      </span>
                    </div>
                  </a>
                  <div className="mt-1 mb-auto">
                    <SubscribeActions
                      channel={video.profile}
                      subscribeType={subscribeType}
                      size={'md'}
                    />
                  </div>
                </div>
                <h1 className="line-clamp-2 text-base">{video.metadata.name} <span>
                  {
                    video.metadata.tags?.map(tag => <span key={tag} className='font-bold'>#{tag}</span>)
                  }
                </span></h1>
              </div>

            </div>
          </div>
        </div>
        <div className='mt-4 w-full ml-1'>
          <div className="flex items-center justify-between">
            <div className="text-white md:text-inherit flex gap-6">
              <PublicationReaction
                publication={video}
                iconSize="base"
                textSize='sm'
                isVertical={false}
                showLabel
              />
              <MirrorVideo video={video} >
                <div className="flex items-center justify-center gap-1 ">
                  <div className='rounded-full bg-gray-200 dark:bg-gray-600 p-2'>
                    <MirrorOutline className="h-4 w-4 " />
                  </div>
                  <div className="pt-1 text-sm">
                    {video.stats?.totalAmountOfMirrors || 'Mirror'}
                  </div>
                </div>
              </MirrorVideo>
            </div>

            <div className='flex gap-4'>
              <button
                type="button"
                onClick={() => setShowShare(true)}
              >
                <div className=' rounded-full  bg-gray-200 dark:bg-gray-600 p-1'>
                  <RiShareForwardLine className="h-6 w-6" />
                </div>
              </button>
              {/* {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
              <div className="text-center flex center">
                <CollectVideo video={video} />
                <div className="text-center text-xs leading-3">
                  {video.stats?.totalAmountOfCollects}
                </div>
              </div>
            )} */}
            </div>

          </div>
          <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-2 dark:border-gray-800 my-3 w-full">
            <div className="select-all truncate text-sm">
              {document.URL}
            </div>
            <button
              className="ml-2 hover:opacity-60 focus:outline-none"
              onClick={() => onCopyVideoUrl()}
              type="button"
            >
              <CopyOutline className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div>
        {data?.publications?.items.length === 0 && (
          <NoDataFound text="Be the first to comment." withImage isCenter />
        )}
        {!error && (queuedComments.length || comments.length) ? (
          <div className='flex flex-col h-full'>
            <div className="border-t-[1px] dark:border-slate-600 space-y-4 bottom-[80px] w-full">
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
          </div>
        ) : null}

        <div className='absolute bottom-5 w-[100%]'>

          {!selectedChannelId && (
            <span className="text-xs">(Sign in required to comment)</span>
          )}
          {video?.canComment.result ? (
            <NewComment video={video} />
          ) : selectedChannelId ? (
            <div className='mx-10'>
              <Alert variant="warning">
                <span className="text-sm">
                  {isFollowerOnlyReferenceModule
                    ? 'Only subscribers can comment on this publication'
                    : `Only subscribers within ${video.profile.handle}'s preferred network can comment`}
                </span>
              </Alert>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default VideoComments
