import CommentOutline from '@components/Common/Icons/CommentOutline'
import Modal from '@components/UIElements/Modal'
import VideoComments from '@components/Watch/VideoComments'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'

type Props = {
    video: Publication
}

const Comments: FC<Props> = ({ video }) => {

    return (
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto pt-3 max-w-lg ">
            <h2 className='py-5 text-lg font-medium leading-6'>
                Comments
            </h2>
            <VideoComments video={video} hideTitle />
        </div>
    )
}

export default Comments
