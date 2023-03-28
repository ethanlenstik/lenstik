import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Subscribe from '@components/Channel/BasicInfo/Subscribe'
import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe'
import type { Profile } from 'lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  channel: Profile
  subscribeType: string | undefined
  size?: "sm" |"md" | "lg" | "xl" 
}

const SubscribeActions: FC<Props> = ({ channel, subscribeType, size = "sm" }) => {
  const isSubscriber = channel?.isFollowedByMe
  const [subscriber, setSubscriber] = useState(isSubscriber)

  useEffect(() => {
    setSubscriber(isSubscriber)
  }, [isSubscriber])

  return subscriber ? (
    <UnSubscribe channel={channel} onUnSubscribe={() => setSubscriber(false)} size={size} />
  ) : subscribeType === 'FeeFollowModuleSettings' ? (
    <JoinChannel channel={channel} onJoin={() => setSubscriber(true)}  size={size} />
  ) : (
    <Subscribe channel={channel} onSubscribe={() => setSubscriber(true)}  size={size} />
  )
}

export default SubscribeActions
