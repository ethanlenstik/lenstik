import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import MetaTags from '@components/Common/MetaTags'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import type { Publication } from 'lens'
import {
  PublicationSortCriteria,
  PublicationTypes,
  useExploreLazyQuery,
  usePublicationDetailsLazyQuery,
  PublicationMainFocus
} from 'lens'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_BYTES_APP_ID,
  SCROLL_ROOT_MARGIN,
  TRACK
} from 'utils'

import ByteVideo from './ByteVideo'
import FullScreen from './FullScreen'


const Bytes = () => {
  const router = useRouter()
  const bytesContainer = useRef<HTMLDivElement>(null)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [currentViewingId, setCurrentViewingId] = useState('')

  const activeTagFilter = useAppStore((state) => state.activeTagFilter)

const request = {
  sortCriteria: PublicationSortCriteria.CuratedProfiles,
  limit: 50, 
   noRandomize: false,
  sources: [LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  customFilters: LENS_CUSTOM_FILTERS,
  metadata: {
    tags:
      activeTagFilter !== 'all' ? { oneOf: [activeTagFilter] } : undefined,
    mainContentFocus: [PublicationMainFocus.Video]
  }
}

  const [show, setShow] = useState(false)

  const [fetchPublication, { data: singleByte, loading: singleByteLoading }] =
    usePublicationDetailsLazyQuery()

  const [fetchAllBytes, { data, loading, error, fetchMore }] =
    useExploreLazyQuery({
      variables: {
        request,
        reactionRequest: selectedChannel
          ? { profileId: selectedChannel?.id }
          : null,
        channelId: selectedChannel?.id ?? null
      },
      onCompleted: ({ explorePublications }) => {
        const items = explorePublications?.items as Publication[]
        const publicationId = router.query.id
        if (!publicationId) {
          const nextUrl = `${location.origin}/${items[0]?.id}`
          history.pushState({ path: nextUrl }, '', nextUrl)
        }
      }
    })

  const bytes = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo
  const singleBytePublication = singleByte?.publication as Publication
  const currentVideo = useMemo(() => {
    const video = bytes?.find(video => video.id === currentViewingId)
    if(video == null && bytes?.length > 0){
      setCurrentViewingId(bytes[0].id)
      return bytes[0]
    }
    return video
  }, [currentViewingId, activeTagFilter])

  const fetchSingleByte = async () => {
    const publicationId = router.query.id
    if (!publicationId) {
      return fetchAllBytes()
    }
    await fetchPublication({
      variables: {
        request: { publicationId },
        reactionRequest: selectedChannel
          ? { profileId: selectedChannel?.id }
          : null,
        channelId: selectedChannel?.id ?? null
      },
      onCompleted: () => fetchAllBytes()
    })
  }

  const scroll = (val: 30 | -30) => {
    bytesContainer.current?.scrollBy({ top: val })
  }

  const openDetail = () => {
    setShow(!show)
  }

  useEffect(() => {
    if (router.isReady) {
      fetchSingleByte()
      Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.BYTES })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  const { observe } = useInView({
    rootMargin: SCROLL_ROOT_MARGIN,
    onEnter: async () => {
      await fetchMore({
        variables: {
          request: {
            ...request,
            cursor: pageInfo?.next
          }
        }
      })
    }
  })

  if (loading || singleByteLoading) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid h-[80vh] place-items-center">
        <NoDataFound isCenter withImage text="No bytes found" />
      </div>
    )
  }

  return (
    <div className="overflow-y-hidden">
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <MetaTags title="Bytes" />
      {currentVideo ? <FullScreen
        video={currentVideo}
        currentViewingId={currentViewingId}
        intersectionCallback={(id) => setCurrentViewingId(id)}
        callShow={setShow}
        isShow={show}
        scroll={scroll}
      />: null}
      <div
        ref={bytesContainer}
        className="no-scrollbar h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth md:h-[calc(100vh-70px)]"
      >
        {singleByte && (
          <ByteVideo
            video={singleBytePublication}
            currentViewingId={currentViewingId}
            intersectionCallback={(id) => setCurrentViewingId(id)}
            onDetail={openDetail}
            isShow={show}
          />
        )}
        {bytes?.map((video: Publication) => (
            <ByteVideo
              video={video}
              currentViewingId={currentViewingId}
              intersectionCallback={(id) => setCurrentViewingId(id)}
              key={`${video?.id}_${video.createdAt}`}
              onDetail={openDetail}
              isShow={show}
            />
        ))}
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Loader />
          </span>
        )}
        <div className="bottom-7 right-4 hidden flex-col space-y-3 lg:absolute lg:flex">
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
      </div>
    </div>
  )
}

export default Bytes
