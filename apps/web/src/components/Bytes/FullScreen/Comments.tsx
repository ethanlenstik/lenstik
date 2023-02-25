import CommentOutline from '@components/Common/Icons/CommentOutline'
import Modal from '@components/UIElements/Modal'
import VideoComments from '@components/Watch/VideoComments'
import { Link } from 'interweave-autolink'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import getProfilePicture from 'utils/functions/getProfilePicture'
import BottomOverlay from '../BottomOverlay'

type Props = {
    video: Publication
}

const Comments: FC<Props> = ({ video }) => {

    const channel = video.profile
    return (
        <div className="pt-10 w-full relative">
            <div className='flex justify-between'>
                <div className='flex items-center'>
                    <Link
                        href={`/channel/${channel?.handle}`}
                    >
                        <img
                            src={getProfilePicture(channel, 'avatar')}
                            className="h-9 w-9 rounded-full"
                            draggable={false}
                            alt={channel?.handle}
                        />
                    </Link>
                </div>
                <div className='grow'>

                    <BottomOverlay video={video} />
                </div>
            </div>
            <VideoComments video={video} hideTitle />
        </div>
    )
}

export default Comments
