import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { SlHome, SlUserFollowing } from 'react-icons/sl';
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
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

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const { connector, isConnected } = useAccount()
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  const isActivePath = (path: string) => router.pathname === path


  return (
    <>
      {!getShowFullScreen(router.pathname) && <MobileBottomNav />}
      <CreateChannel />
      <div
        className={clsx(
          'transition-width hidden items-start justify-between md:flex md:flex-col basis-1/3',
        )}
      >
        <div
          className={clsx(
            'flex flex-col space-y-2',
            sidebarCollapsed ? 'self-center' : 'w-full px-[18px]'
          )}
          data-testid="sidebar-items"
        >
          <div className={clsx('py-3  border-b border-b-gray-700 mb-3')}>
            <Link
              href="/"
              className="flex items-center pt-1 focus:outline-none my-2 p-2 hover:bg-gray-700"
            >
              <SlHome className='text-2xl' />
              <span className='text-xl font-bold ml-5'>For You</span>
            </Link>
            <Link
              href="/feed"
              className='flex items-center pt-1 focus:outline-none my-2 p-2  hover:bg-gray-700'
            >
              <SlUserFollowing className='text-2xl' />
              <span className='text-xl font-bold ml-5' >Subscriptions</span>
            </Link>
          </div>
          <div className="flex flex-col justify-center space-y-2">

            {!isConnected &&
              <div className='border-b border-b-gray-700 pb-5 mb-3 grid'>
                <p className='mb-2'>Log in to follow creators, like videos, and comments.</p>
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
                        ? 'bg-indigo-50 dark:bg-gray-800'
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
            <CategoryFilters />
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
