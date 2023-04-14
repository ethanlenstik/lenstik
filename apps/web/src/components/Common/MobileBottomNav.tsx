import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Profile } from 'lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { AiFillSetting } from 'react-icons/ai'
import { BsInbox } from 'react-icons/bs'
import { CgProfile } from 'react-icons/cg'
import { FaRegCompass } from 'react-icons/fa'
import getProfilePicture from 'utils/functions/getProfilePicture'

import BytesOutline from './Icons/BytesOutline'
import ExploreOutline from './Icons/ExploreOutline'
import FeedOutline from './Icons/FeedOutline'
import HomeOutline from './Icons/HomeOutline'
import PlusOutline from './Icons/PlusOutline'

const MobileBottomNav = () => {
  const router = useRouter()
  const selectedChannel = useAppStore(
    (state) => state.selectedChannel as Profile
  )

  const isActivePath = (path: string) => router.pathname === path

  return (
    <div className="pb-safe dark:bg-theme fixed inset-x-0 bottom-0 z-[4] border-t border-gray-300 bg-white dark:border-gray-700 md:hidden">
      <div className="grid grid-cols-5">
        <Link
          href="/"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <HomeOutline
            className={clsx('h-4 w-4 opacity-80', {
              'text-green-500 opacity-100': isActivePath('/')
            })}
          />
          <span className="text-[9px]">Home</span>
        </Link>
        <Link
          href="/notifications"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <BsInbox
            className={clsx('h-4 w-4 opacity-80', {
              'text-green-500 opacity-100': isActivePath('/notifications')
            })}
          />
          <span className="text-[9px]">Notification</span>
        </Link>
        <Link
          href="/upload"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <PlusOutline className="h-8 w-8 opacity-80" />
        </Link>
        <Link
          href="/settings"
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        >
          <AiFillSetting
            className={clsx('h-4 w-4 opacity-80', {
              'text-green-500 opacity-100': isActivePath('/settings')
            })}
          />
          <span className="text-[9px]">Setting</span>
        </Link>
        <Link
          href={`/channel/${selectedChannel?.handle}`}
          className="flex w-full flex-col items-center justify-center rounded-lg bg-transparent pt-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:hover:text-gray-100 md:grid"
        > {
            selectedChannel?.handle ? <img
              className={clsx("dark:bg-theme h-6 w-6 rounded-full bg-white object-cover md:h-8 md:w-8 mr-2", { 'text-green-500 opacity-100': isActivePath('/feed') })}
              src={getProfilePicture(selectedChannel)}
              alt={selectedChannel.handle}
              draggable={false}
            /> : <CgProfile
              className={clsx('h-4 w-4 opacity-80', {
                'text-green-500 opacity-100': isActivePath('/feed')
              })}
            />

          }

          <span className="text-[9px]">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileBottomNav
