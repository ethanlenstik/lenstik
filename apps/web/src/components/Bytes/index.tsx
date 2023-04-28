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
  TRACK,
  LENSTOK_APP_ID
} from 'utils'

import ByteVideo from './ByteVideo'
import FullScreen from './FullScreen'


const Bytes = () => {
  const router = useRouter()
  const bytesContainer = useRef<HTMLDivElement>(null)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const currentViewingId = useAppStore((state) => state.currentviewingId)
  const setCurrentViewingId = useAppStore((state) => state.setCurrentviewingId)
  const [byte, setByte] = useState<Publication>()


  const activeTagFilter = useAppStore((state) => state.activeTagFilter)
  const request =
  {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 30,
    noRandomize: false,
    sources: [ LENSTOK_APP_ID],
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
      }
    })
console.log(data)

  const bytes = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo
  const singleBytePublication = singleByte?.publication as Publication

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

  const openDetail = (byte: Publication) => {
    const nextUrl = `/${byte.id}`
    setByte(byte)
    history.pushState({ path: nextUrl }, '', nextUrl)
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
    /> : null, [byte, show, currentViewingId])

  useEffect(() => {
    if (router.query.id && singleBytePublication) {
      openDetail(singleBytePublication)
    }
  }, [singleByte])


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

  return (
    <div>
      <Head>
        <meta name="theme-color" content="#000000" />
      </Head>
      <MetaTags title="Lenstik" />
      {full()}
      <div
        ref={bytesContainer}
        className="h-screen md:h-[calc(100vh-70px)]"
      >
        {singleByte && (
          <ByteVideo
            video={singleBytePublication}
            key={`${singleBytePublication?.id}_${singleBytePublication.createdAt}0`}
            onDetail={openDetail}
            isShow={show}
            index={-1}
          />
        )}
        {bytes?.map((video: Publication, index) => (
          <ByteVideo
            video={video}
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
      </div>
    </div>
  )
}

export default Bytes
