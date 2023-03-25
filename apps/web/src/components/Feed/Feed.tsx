import ByteVideo from '@components/Bytes/ByteVideo'
import FullScreen from '@components/Bytes/FullScreen'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import type { FeedItem, Publication } from 'lens'
import { FeedEventItemType, PublicationMainFocus, useFeedQuery } from 'lens'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'
import { SCROLL_ROOT_MARGIN } from 'utils'

const HomeFeed = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const [currentViewingId, setCurrentViewingId] = useState('')
  const [show, setShow] = useState(false)
  const bytesContainer = useRef<HTMLDivElement>(null)

  const request = {
    limit: 20,
    feedEventItemTypes: [FeedEventItemType.Post, FeedEventItemType.Comment],
    profileId: selectedChannel?.id,
    metadata: {
      tags:
        activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }

  const { data, loading, error, fetchMore } = useFeedQuery({
    variables: {
      request
    },
    skip: !selectedChannel?.id
  })

  const bytes = data?.feed?.items.map(item => item.root) as Publication[]
  const pageInfo = data?.feed?.pageInfo

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            cursor: pageInfo?.next,
            ...request
          }
        }
      })
    }
  })

  const currentViewCb = useCallback((id: string) => setCurrentViewingId(id)
    , [bytes])

  const currentVideo = useMemo(() => {
    const video = bytes?.find(video => video.id === currentViewingId)
    if (video == null && bytes?.length > 0) {
      setCurrentViewingId(bytes[0].id)
      return bytes[0]
    }
    return video
  }, [currentViewingId, activeTagFilter])

  if (bytes?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="You got no videos in your feed, explore!"
      />
    )
  }

  const openDetail = () => {
    setShow(!show)
  }

  if (!loading && error) {
    return <Custom500 />
  }

  const closeDialog = () => {
    setShow(false)
  }
  const detailNext = (val: 1 | -1) => {
    const index = bytes.findIndex(byte => byte.id === currentViewingId) + val
    index >= 0 && index < bytes.length ? setCurrentViewingId(bytes[index].id) : currentViewingId
  }

  return (
    <div className='mt-12'>
      {currentVideo ? <FullScreen
        video={currentVideo}
        currentViewingId={currentViewingId}
        intersectionCallback={currentViewCb}
        close={closeDialog}
        isShow={show}
        nextVideo={detailNext}
        index={bytes.findIndex((video) => video.id === currentViewingId)}
      /> : null}
      {!error && !loading && (
        <>
          <div
            ref={bytesContainer}
            className="h-screen md:h-[calc(100vh-70px)]">
            {bytes?.map((video: Publication, index) => (
              <ByteVideo
                video={video}
                currentViewingId={currentViewingId}
                intersectionCallback={currentViewCb}
                key={`${video?.id}_${video.createdAt}1`}
                onDetail={openDetail}
                isShow={show}
                index={index}
              />
            ))}
          </div>
          {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default HomeFeed
