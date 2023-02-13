import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
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

const CreateChannel = dynamic(() => import('./CreateChannel'))

const Sidebar = () => {
  const router = useRouter()
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannel = useAppStore((state) => state.selectedChannel)

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
          'transition-width hidden items-start justify-between md:flex md:flex-col',
        )}
      >
        <div
          className={clsx(
            'flex flex-col space-y-2',
            sidebarCollapsed ? 'self-center' : 'w-full px-[18px]'
          )}
          data-testid="sidebar-items"
        >
          <div className={clsx('py-3', sidebarCollapsed ? 'px-3' : 'px-3.5')}>
            <Link
              href="/"
              className="flex items-center pt-1 focus:outline-none"
            >
              <img
                src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
                draggable={false}
                className="ml-0.5 h-6 w-6"
                alt="lenstube"
              />
            </Link>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            {/* <Tooltip
              content="Home"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <HomeOutline className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm">Home</span>}
              </Link>
            </Tooltip> */}
            <Tooltip
              content="Subscriptions"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/feed"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/feed')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <FeedOutline className="h-5 w-5 flex-none" />
                {!sidebarCollapsed && (
                  <span className="text-sm">Subscriptions</span>
                )}
              </Link>
            </Tooltip>
            {/* <Tooltip
              content="Bytes"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/bytes"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/bytes') || router.pathname === '/bytes/[id]'
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <BytesOutline className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm">Bytes</span>}
              </Link>
            </Tooltip> */}
            {/* <Tooltip
              content="Explore"
              visible={sidebarCollapsed}
              placement="right"
            >
              <Link
                href="/explore"
                className={clsx(
                  'group flex h-12 items-center rounded-full py-2 2xl:py-2.5',
                  isActivePath('/explore')
                    ? 'bg-indigo-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  sidebarCollapsed
                    ? 'w-12 justify-center'
                    : 'w-full space-x-3 px-4'
                )}
              >
                <ExploreOutline className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm">Explore</span>}
              </Link>
            </Tooltip> */}
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
