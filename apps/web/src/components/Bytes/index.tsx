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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const { detail } = router.query
  const bytesContainer = useRef<HTMLDivElement>(null)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [currentViewingId, setCurrentViewingId] = useState('')

  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const request =
  {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 20,
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
      // prevent the query from firing again after the first fetch
      nextFetchPolicy: 'standby',
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
        // if (!publicationId) {
        //   const nextUrl = `${location.origin}/${items[0]?.id}`
        //   history.pushState({ path: nextUrl }, '', nextUrl)
        // }
      }
    })


  const bytes = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo
  const singleBytePublication = singleByte?.publication as Publication
  const currentVideo = useMemo(() => {
    const video = bytes?.find(video => video.id === currentViewingId)
    if (video == null && bytes?.length > 0) {
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

  const currentViewCb = useCallback((id: string) => setCurrentViewingId(id)
    , [bytes])


  const openDetail = (id: string) => {
    setCurrentViewingId(id)
    setShow(!show)
  }

  useEffect(() => {
    if (router.isReady) {
      fetchSingleByte()
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

  const detailNext = (val: 1 | -1) => {
    const index = bytes.findIndex(byte => byte.id === currentViewingId) + val
    index >= 0 && index < bytes.length ? setCurrentViewingId(bytes[index].id) : currentViewingId
  }

  const closeDialog = () => {
    setShow(false)
  }

  return (
    <div>
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <MetaTags title="Bytes" />
      {currentVideo ? <FullScreen
        video={currentVideo}
        currentViewingId={currentViewingId}
        intersectionCallback={currentViewCb}
        close={closeDialog}
        isShow={show}
        nextVideo={detailNext}
        index={bytes.findIndex((video) => video.id === currentViewingId)}
      /> : null}
      <div
        ref={bytesContainer}
        className="h-screen md:h-[calc(100vh-70px)]"
      >
        {/* {singleByte && (
          <ByteVideo
            video={singleBytePublication}
            currentViewingId={currentViewingId}
            intersectionCallback={currentViewCb}
            onDetail={openDetail}
            isShow={show}
            index={0}
          />
        )} */}
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
        {pageInfo?.next && (
          <span ref={observe} className="flex justify-center p-10">
            <Loader />
          </span>
        )}
        {/* <div className="bottom-7 right-4 hidden flex-col space-y-3 lg:absolute lg:flex">
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
        </div> */}
      </div>
    </div>
  )
}

export default Bytes
