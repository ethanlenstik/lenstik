import useAppStore from '@lib/store'
import usePersistStore, { hydrateAuthTokens, signOut } from '@lib/store/persist'
import clsx from 'clsx'
import type { Profile } from 'lens'
import { useUserProfilesQuery } from 'lens'
import mixpanel from 'mixpanel-browser'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import type { FC, ReactNode } from 'react'
import React, { useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import { MIXPANEL_API_HOST, MIXPANEL_TOKEN, POLYGON_CHAIN_ID } from 'utils'
import { AUTH_ROUTES } from 'utils/data/auth-routes'
import { getShowFullScreen } from 'utils/functions/getShowFullScreen'
import { getToastOptions } from 'utils/functions/getToastOptions'
import useIsMounted from 'utils/hooks/useIsMounted'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
import Header from './Header'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
}

const NO_HEADER_PATHS = ['/auth']
const NO_SIBAR_PATHS=['/upload']

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_API_HOST
  })
}

const Layout: FC<Props> = ({ children }) => {
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce)
  const setChannels = useAppStore((state) => state.setChannels)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)
  const setSelectedChannelId = usePersistStore(
    (state) => state.setSelectedChannelId
  )

  const { chain } = useNetwork()
  const { resolvedTheme } = useTheme()
  const { mounted } = useIsMounted()
  const { address } = useAccount()
  const { pathname, replace, asPath } = useRouter()

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const showFullScreen = getShowFullScreen(pathname)

  const setUserChannels = (channels: Profile[]) => {
    setChannels(channels)
    const channel = channels.find((ch) => ch.id === selectedChannelId)
    setSelectedChannel(channel ?? channels[0])
    setSelectedChannelId(channel?.id)
  }

  const resetAuthState = () => {
    setSelectedChannel(null)
    setSelectedChannelId(null)
  }

  const { loading } = useUserProfilesQuery({
    variables: {
      request: { ownedBy: [address] }
    },
    skip: !selectedChannelId,
    onCompleted: (data) => {
      const channels = data?.profiles?.items as Profile[]
      if (!channels.length) {
        return resetAuthState()
      }
      setUserChannels(channels)
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
    },
    onError: () => {
      setSelectedChannelId(null)
    }
  })

  const validateAuthentication = () => {
    if (
      !selectedChannel &&
      !selectedChannelId &&
      AUTH_ROUTES.includes(pathname)
    ) {
      // Redirect to signin page
      replace(`/auth?next=${asPath}`)
    }
    const logout = () => {
      resetAuthState()
      signOut()
      disconnect?.()
    }
    const ownerAddress = selectedChannel?.ownedBy
    const isWrongNetworkChain = chain?.id !== POLYGON_CHAIN_ID
    const isSwitchedAccount =
      ownerAddress !== undefined && ownerAddress !== address
    const { accessToken } = hydrateAuthTokens()
    const shouldLogout =
      !accessToken || isWrongNetworkChain || isSwitchedAccount

    if (shouldLogout && selectedChannelId) {
      logout()
    }
  }

  useEffect(() => {
    validateAuthentication()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, disconnect, selectedChannelId])

  if (loading || !mounted) {
    return <FullPageLoader />
  }


  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#000000' : '#ffffff'}
        />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      {!NO_HEADER_PATHS.includes(pathname) && (
        <Header className={clsx(showFullScreen && 'hidden md:flex')} />
      )}
      <div className={clsx('flex justify-center md:pb-0 max-w-6xl m-auto gap-[100px]', showFullScreen && '!pb-0')} >
        {!NO_SIBAR_PATHS.includes(pathname) && (<Sidebar />)}
        <div
          className={clsx(
            'w-[70vw]',
            showFullScreen && 'px-0',
            sidebarCollapsed || pathname === '/[id]'
          )}
        >
          <div
            className={clsx(
              'ultrawide:px-0',
              showFullScreen && '!p-0',
              pathname !== '/channel/[channel]' &&
              'ultrawide:max-w-[50rem] mx-auto pt-12 md:px-3 2xl:py-6'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Layout
