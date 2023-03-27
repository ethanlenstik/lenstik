import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { SlHome, SlUserFollowing } from 'react-icons/sl';
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'utils'
import { FEATURE_FLAGS } from 'utils/data/feature-flags'
import getIsFeatureEnabled from 'utils/functions/getIsFeatureEnabled'
import { getShowFullScreen } from 'utils/functions/getShowFullScreen'

import Footer from './Footer'
import BytesOutline from './Icons/BytesOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import ChevronRightOutline from './Icons/ChevronRightOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import MusicOutline from './Icons/MusicOutline'
import MobileBottomNav from './MobileBottomNav'
import { AiOutlineHome } from 'react-icons/ai';
import CategoryFilters from './CategoryFilters'
import Login from './Auth/Login'
import { useAccount } from 'wagmi';
import { useProfileQuery, useRecommendedProfilesQuery, useSubscribersQuery } from 'lens';
import SuggestedAccount from './SuggestedAccounts';
import FollowingAccounts from './FollowingAccouts';
import { request } from '@playwright/test';
import { channel } from 'diagnostics_channel';
import { FaUserFriends } from 'react-icons/fa';
import { RiLiveLine } from 'react-icons/ri';

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const { connector, isConnected } = useAccount()
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  const { data: profiles } = useRecommendedProfilesQuery({ variables: {} })


  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: selectedChannel?.handle },
      who: selectedChannel?.id ?? null
    },
    skip: !selectedChannel?.handle
  })


  const isActivePath = (path: string) => router.pathname === path


  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <CreateChannel />
      <div
        className={clsx(
          'transition-width hidden items-start justify-between md:flex md:flex-col w-[30vw]',
        )}
      >
        <div
          className={clsx(
            'flex flex-col overflow-y-auto overflow-x-hidden fixed top-[50px] bottom-0 pl-[20px] py-[20px] max-w-[350px]',
            'self-center', !showScrollbar && 'no-scrollbar'
          )}
          style={{ scrollbarWidth: 'thin' }}
          data-testid="sidebar-items"
          onMouseEnter={()=> setShowScrollbar(true)}
          onMouseLeave={()=> setShowScrollbar(false)}
        >
          <div className={clsx('py-1  border-b dark:border-b-slate-800 mb-3')}>
            <Link
              href="/"
              className={clsx("flex items-center pt-2 focus:outline-none my-2 p-2 dark:hover:bg-gray-600 hover:bg-gray-200", isActivePath('/')&& 'text-red-500')}
            >
              <SlHome className='text-xl' />
              <span className='text-lg font-bold ml-4'>For You</span>
            </Link>
            <Link
              href="/feed"
              className={clsx('flex items-center pt-1 focus:outline-none my-2 p-2 dark:hover:bg-gray-600  hover:bg-gray-200', isActivePath('/feed')&& 'text-red-500')}
            >
              <FaUserFriends className='text-2xl' />
              <span className='text-lg font-bold ml-3' >Following</span>
            </Link>
            <Link
              href="/live"
              className={clsx('flex items-center pt-1 focus:outline-none my-2 p-2 dark:hover:bg-gray-600  hover:bg-gray-200', isActivePath('/feed')&& 'text-red-500')}
            >
              <RiLiveLine className='text-2xl' />
              <span className='text-lg font-bold ml-3' >Live</span>
            </Link>
          </div>
          <div className="flex flex-col justify-center">

            {!isConnected &&
              <div className='border-b dark:border-b-slate-800 pb-6 mb-3 grid'>
                <p className='mb-2 text-gray-500'>Log in to follow creators, like videos, and comments.</p>
                <Login />
              </div>}
            {getIsFeatureEnabled(
              FEATURE_FLAGS.LENSTUBE_ECHOS,
              selectedChannel?.id
            ) && (
                <Tooltip
                  content="Echos"
                  placement="right"
                  visible={sidebarCollapsed}
                >
                  <Link
                    href="/echos"
                    className={clsx(
                      'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                      isActivePath('/echo')
                        ? 'bg-green-50 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                      sidebarCollapsed
                        ? 'w-12 justify-center'
                        : 'w-full space-x-3 px-4'
                    )}
                  >
                    <MusicOutline className="h-5 w-5" />
                    {!sidebarCollapsed && <span className="text-sm">Echo</span>}
                  </Link>
                </Tooltip>
              )}
            <SuggestedAccount channels={profiles} />
            { isConnected && <FollowingAccounts profile={data} />}
            <CategoryFilters />
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar