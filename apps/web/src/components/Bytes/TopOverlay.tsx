import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { FaPlay } from 'react-icons/fa'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'

type Props = {
  onClickVideo: (event: any) => void
  isPlaying?: boolean
  onClickVolume?: () => void
  mute?: boolean
  full?: boolean
}

const TopOverlay: FC<Props> = ({ onClickVideo, isPlaying, onClickVolume, mute, full }) => {
  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log("clicked")
    onClickVolume && onClickVolume();
  }
  return (
    <div
      role="button"
      onClick={onClickVideo}
      className="absolute top-0 bottom-[50px] left-0 right-0 z-[1] w-full cursor-default outline-none"
    >
      <div className="flex items-center justify-between h-full">
        {!isPlaying && <div className='m-auto p-3 bg-[#b4b4b47d] rounded-md hover:cursor-pointer'>
          <FaPlay className="text-2xl text-white" />
        </div>}
        {!full && <button className='absolute bottom-0 right-5 z-[2]' onClick={handleClick}>
          {mute ? <MdVolumeOff className='w-6 h-6' fill='white' />
            : <MdVolumeUp className='w-6 h-6' fill='white' />}
        </button>}
      </div>
    </div>
  )
}

export default TopOverlay
