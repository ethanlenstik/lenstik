import usePersistStore from '@lib/store/persist'
import Link from 'next/link'
import React from 'react'
import {
  Analytics,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_ROADMAP_URL,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_TWITTER_HANDLE,
  TRACK
} from 'utils'

const Footer = () => {
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  return (
    <div className="text-sm pt-12">
      <a className="text-gray-400 text-sm mt-5" href="https://lens-do-it.vercel.app/" target="_blank" rel="noreferrer">→ Click here for a testnet Lens handle</a>
      <p className="text-gray-400 text-sm mt-5">© 2023 LensTik</p>
    </div>
  )
}

export default Footer
