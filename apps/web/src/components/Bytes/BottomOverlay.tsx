import IsVerified from '@components/Common/IsVerified'
import SubscribeActions from '@components/Common/SubscribeActions'
import Tooltip from '@components/UIElements/Tooltip'
import type { Publication } from 'lens'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'
import { formatNumber } from 'utils/functions/formatNumber'
import getProfilePicture from 'utils/functions/getProfilePicture'

type Props = {
  video: Publication
  btnSize?: "sm" | "md" | "lg" | "xl"
}

const BottomOverlay: FC<Props> = ({ video, btnSize }) => {
  const subscribeType = video.profile?.followModule?.__typename
  const channel = video.profile
  return (
    <div className="z-[1] pt-5 pb-3 md:rounded-b-xl mr-1">
      <div className="flex justify-between">
        <div>
          <a href={`/channel/${channel?.handle}`}>
            <span className="font-bold text-base">{video.profile.name}</span>
            <span className='text-sm font-thin inline-flex'>@{video.profile.handle} &nbsp; <Tooltip content="Verified" placement="right">
              <span>
                <IsVerified id={channel?.id} size="md" />
              </span>
            </Tooltip>
            </span>
          </a>
          <h1 className="line-clamp-2 text-sm mt-2 font-normal">{video.metadata.name} <span>
            {
              video.metadata.tags?.map(tag => <span key={tag} className='font-bold'>#{tag}</span>)
            }
          </span></h1>
        </div>
        <div className="flex mt-1 mb-auto">
          <SubscribeActions
            channel={video.profile}
            subscribeType={subscribeType}
            size={btnSize}
          />
        </div>
      </div>
    </div>
  )
}

export default BottomOverlay
