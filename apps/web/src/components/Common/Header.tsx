import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import clsx from 'clsx'
import { useLatestNotificationIdQuery } from 'lens'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React, { useState } from 'react'
import { BsPlusLg, BsInbox, } from 'react-icons/bs'
import { FiSend } from 'react-icons/fi'
import {
  Analytics,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  LENSTUBE_ROADMAP_URL,
  STATIC_ASSETS,
  TRACK
} from 'utils'

import Login from './Auth/Login'
import CategoryFilters from './CategoryFilters'
import BellOutline from './Icons/BellOutline'
import SearchOutline from './Icons/SearchOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const { pathname } = useRouter()
  const [showShowModal, setSearchModal] = useState(false)
  const showFilter =
    pathname === '/' || pathname === '/explore' || pathname === '/feed'

  const hasNewNotification = useAppStore((state) => state.hasNewNotification)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const latestNotificationId = usePersistStore(
    (state) => state.latestNotificationId
  )
  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )
  const setHasNewNotification = useAppStore(
    (state) => state.setHasNewNotification
  )

  useLatestNotificationIdQuery({
    variables: {
      request: {
        profileId: selectedChannel?.id,
        sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
        customFilters: LENS_CUSTOM_FILTERS,
        limit: 1
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedChannel?.id,
    onCompleted: (notificationsData) => {
      if (selectedChannel && notificationsData) {
        const id = notificationsData?.notifications?.items[0].notificationId
        setHasNewNotification(latestNotificationId !== id)
        setLatestNotificationId(id)
      }
    }
  })

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-10 flex w-full items-center  py-2 border-b dark:border-b-slate-800 bg-white dark:bg-theme',
        className
      )}
    >
      <div className="w-full max-w-6xl m-auto px-4">
        <div className="flex w-full items-center justify-between">
          <div className="md:w-[410px]">
            <Link href="/" className="block">
              <img
                src={`/images/logo.png`}
                draggable={false}
                className="h-10 w-10"
                alt="lenstik"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <GlobalSearchBar />
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:w-96 md:space-x-3">
            <button
              onClick={() => setSearchModal(true)}
              className="btn-hover p-2.5 md:hidden"
            >
              <SearchOutline className="h-4 w-4" aria-hidden="true" />
            </button>

            {(selectedChannelId && selectedChannel )? (
              <>
                <a>
                  <Link
                    href="/upload"
                  >
                    <Button
                      className="hidden md:block"
                      icon={<BsPlusLg className='' />}
                    >
                      <span>Upload</span>
                    </Button>
                  </Link>
                </a>
                <a>
                  <Link

                    href="/message"
                    className="relative"
                  >
                    <button className="p-2.5">
                      <FiSend className="h-6 w-6" />
                      {hasNewNotification && (
                        <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </button>
                  </Link>
                </a>
                <a>
                  <Link

                    href="/notifications"
                    className="relative"
                  >
                    <button className="p-2.5">
                      <BsInbox className="h-6 w-6" />
                      {hasNewNotification && (
                        <span className="absolute top-0.5 right-0.5 flex h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </button>
                  </Link>
                </a>
              </>
            ) : null}
            <Login />
          </div>
        </div>

        {/* {showFilter && <CategoryFilters />} */}
      </div>

      <Modal
        title="Search"
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default Header
