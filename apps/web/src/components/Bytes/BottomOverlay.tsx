import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: Publication
}

const BottomOverlay: FC<Props> = ({ video }) => {
  const subscribeType = video.profile?.followModule?.__typename
  const channel = video.profile
  return (
    <div className="z-[1] px-3 pt-5 pb-3 md:rounded-b-xl">
      <div className="flex items-center justify-between">
        <h1 className="line-clamp-2 text-white">{video.metadata.name}</h1>
        <div className="flex items-center space-x-2">
          <SubscribeActions
            channel={video.profile}
            subscribeType={subscribeType}
          />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
