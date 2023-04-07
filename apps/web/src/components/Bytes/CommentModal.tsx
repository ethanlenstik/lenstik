import FullScreenModal from '@components/UIElements/FullScreenModal'
import Modal from '@components/UIElements/Modal'
import VideoComments from '@components/Watch/VideoComments'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { FaRegCommentAlt } from 'react-icons/fa'
import { MdOutlineClose } from 'react-icons/md'

type Props = {
  trigger: React.ReactNode
  video: Publication
}

const CommentModal: FC<Props> = ({ trigger, video }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <button
        type="button"
        className="focus:outline-none"
        onClick={() => setShow(true)}
      >
        {trigger}
      </button>
      <FullScreenModal
        panelClassName="max-w-lg lg:ml-9"
        show={show}
        autoClose
      >
        <div className='z-10 max-md:absolute'>
          <button
            type="button"
            className="p-1 focus:outline-none m-4 rounded-full  bg-slate-600"
            onClick={() =>  setShow(false)}
          >
            <MdOutlineClose className='text-white w-4 h-4' />
          </button>
        </div>
        <div className="no-scrollbar max-h-[40vh] overflow-y-auto pt-3">
          <VideoComments video={video} hideTitle />
        </div>
      </FullScreenModal>
    </>
  )
}

export default CommentModal
