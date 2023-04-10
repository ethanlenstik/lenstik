import usePersistStore from '@lib/store/persist'
import { link } from 'fs'
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

  const listLink = [

    {
      label: "About",
      url: ""
    },
    {
      label: "Docs",
      url: ""
    },
    {
      label: "Contact",
      url: ""
    },
  ]

  return (
    <div className="text-sm pt-12">
      <a className="text-gray-400 text-sm mt-5" href="https://lens-do-it.vercel.app/" target="_blank" rel="noreferrer">Click here for a testnet Lens handle</a>

      <div className='mt-1'>
        {listLink.map(link => <a className='mr-5 text-gray-400 text-sm' href={link.url}>{link.label}</a>)}
      </div>
      <p className="text-gray-400 text-sm mt-1">© 2023 Lenstik</p>
    </div>
  )
}

export default Footer
