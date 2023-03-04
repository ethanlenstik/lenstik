import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { BsArrowLeft } from 'react-icons/bs'

type Props = {
  onClickVideo: () => void
}

const TopOverlay: FC<Props> = ({ onClickVideo }) => {
  return (
    <div
      role="button"
      onClick={() => onClickVideo()}
      className="absolute top-0 bottom-[50px] left-0 right-0 z-[1] w-full cursor-default outline-none"
    >
      <div className="flex items-center justify-between">
        <div className="p-3 md:hidden">
          <Link href="/">
            <BsArrowLeft className="text-2xl text-white" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopOverlay
