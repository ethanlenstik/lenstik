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
      label: "Twitter",
      url: "https://twitter.com/lenstik_xyz"
    },
    {
      label: "Discord",
      url: "https://discord.gg/4XQjtJekJx"
    },
    {
      label: "Document",
      url: "https://lenstik.gitbook.io/lenstik/"
    },
  ]

  return (
    <div className="text-sm pt-12">
      <p className="text-gray-400 text-sm mt-5">Join Our community</p>

      <div className='mt-1'>
        {listLink.map(link => <a key={link.label} className='mr-5 text-gray-400 text-sm' href={link.url}>{link.label}</a>)}
      </div>
      <p className="text-gray-400 text-sm mt-1">© 2023 Lenstik</p>
    </div>
  )
}

export default Footer
