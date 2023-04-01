import { div } from '@tensorflow/tfjs'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, {useState} from 'react'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import useAppStore from '@lib/store'

type Props = {
  onClickVideo: (event: any) => void
  onPlay?: ()=> void
  isPlaying?: boolean
  full?: boolean
}

const TopOverlay: FC<Props> = ({ onClickVideo, onPlay, isPlaying, full }) => {

  const [ mouseEnter, setMouseEnter] = useState(false)
  const setMute = useAppStore((state)=> state.setMute)
  const mute = useAppStore((state) => state.isMute)

  const handleClickMute = (e: any) => {
    e.stopPropagation();
    setMute && setMute(!mute);
  }
  const handleClickPlay = (e: any) => {
    e.stopPropagation();
    onPlay && onPlay();
  }


  return (
    <div
      role="button"
      onClick={onClickVideo}
      className="absolute top-0 bottom-[40px] md:max-xl:bottom-[80px] left-0 right-0 z-[1] w-full cursor-default outline-none"
      onMouseEnter={()=> setMouseEnter(true)}
      onMouseLeave={()=> setMouseEnter(false)}
    >
      <div className="flex items-center justify-between h-full">
        {!isPlaying && <div className='m-auto p-3 bg-[#b4b4b47d] rounded-md hover:cursor-pointer'>
          <GiPlayButton className="text-2xl text-white" />
        </div>}
        {!full && <div className='absolute bottom-0 z-[2] flex justify-between w-full'>
        {mouseEnter ? <button className='ml-5' onClick={handleClickPlay}>
            {isPlaying ? <GiPauseButton className='w-6 h-6' fill='white' />
              : <GiPlayButton className='w-6 h-6' fill='white' />}
          </button>: <div></div>}
          <button className='mr-5' onClick={handleClickMute}>
            {mute ? <MdVolumeOff className='w-6 h-6' fill='white' />
              : <MdVolumeUp className='w-6 h-6' fill='white' />}
          </button>
        </div>}
      </div>
    </div>
  )
}

export default TopOverlay
