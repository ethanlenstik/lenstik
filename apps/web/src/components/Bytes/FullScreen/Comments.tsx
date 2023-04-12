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

    return (<VideoComments video={video} hideTitle />)
}

export default Comments

