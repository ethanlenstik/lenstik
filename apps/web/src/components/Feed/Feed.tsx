import ByteVideo from '@components/Bytes/ByteVideo'
import FullScreen from '@components/Bytes/FullScreen'
import VideoCard from '@components/Common/VideoCard'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import type { FeedItem, Publication } from 'lens'
import { FeedEventItemType, PublicationMainFocus, useFeedQuery } from 'lens'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import Custom500 from 'src/pages/500'
import { SCROLL_ROOT_MARGIN } from 'utils'

const HomeFeed = () => {
  const router = useRouter()
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const currentViewingId = useAppStore((state) => state.currentviewingId)
  const [show, setShow] = useState(false)
  const bytesContainer = useRef<HTMLDivElement>(null)
  const [byte, setByte] = useState<Publication>()

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

  const openDetail = (byte: Publication) => {
    const nextUrl = `/${byte.id}`
    history.pushState({ path: nextUrl }, '', nextUrl)
    setByte(byte)
    setShow(!show)
  }

  const closeDialog = () => {
    const nextUrl = `/`
    history.pushState({ path: nextUrl }, '', nextUrl)
    setShow(false)
  }


  const full = useCallback(() => currentViewingId && byte && router.pathname ?
    <FullScreen
      byte={byte}
      close={closeDialog}
      isShow={show}
      bytes={bytes}
      index={bytes?.findIndex((video) => video.id === currentViewingId)}
    /> : null, [byte, show])



  if (bytes?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="You got no videos in your feed, explore!"
      />
    )
  }

  if (!loading && error) {
    return <Custom500 />
  }
  return (
    <div className='mt-12'>
      {full()}
      {!error && !loading && (
        <>
          <div
            ref={bytesContainer}
            className="h-screen md:h-[calc(100vh-70px)]">
            {bytes?.map((video: Publication, index) => (
              <ByteVideo
                video={video}
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
