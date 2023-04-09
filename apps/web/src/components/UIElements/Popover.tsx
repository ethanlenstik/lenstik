
import { Popover } from "@headlessui/react"
import type { FC } from "react"
import React, { useRef, useEffect, useState } from "react"
import SubscribeActions from "@components/Common/SubscribeActions"
import MutualSubscribers from "@components/Channel/Mutual/MutualSubscribers"
import IsVerified from "@components/Common/IsVerified"
import SubscribersList from "@components/Common/SubscribersList"
import getProfilePicture from "utils/functions/getProfilePicture"
import Modal from "./Modal"
import Tooltip from "./Tooltip"
import useAppStore from "@lib/store"
type Props = {
    hover: String
    channel: any
}
const PopoverTik: FC<Props> = ({ hover, channel }) => {

    const [showSubscribersModal, setShowSubscribersModal] = useState(false)
    const ref = useRef<HTMLButtonElement>(null)
    const [timeLeft, setTimeLeft] = useState(1);
    const [open, setOpen] = useState(false);
    const [mouseInHover, setMouseInHover] = useState(false)

    useEffect(() => {

        if (hover === "onMouseLeave") {
            setTimeLeft(1)
            return
        }
        if (!timeLeft) {
            ref.current?.click()
            setOpen(true)
            return
        }

        if (hover === "onMouseEnter") {
            const intervalId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }

    }, [timeLeft, hover]);
    const selectedChannel = useAppStore((state) => state.selectedChannel)
    const isOwnChannel = channel?.id === selectedChannel?.id
    const subscribeType = channel?.followModule?.__typename

    useEffect(() => {
        if (open && hover === "onMouseLeave" && !mouseInHover) {
            ref.current?.click()
            setOpen(false)
        }
    }, [open, hover, mouseInHover])


    return (
        <Popover className="relative">
            {
                ({ open }) => (
                    <div >
                        <Popover.Button ref={ref} className="hidden"></Popover.Button>
                        <Popover.Panel className="absolute top-0 z-10 bg-white  dark:bg-gray-900 p-5 mb-5 shadow-md" onMouseLeave={() => setMouseInHover(false)} onMouseEnter={() => setMouseInHover(true)}>
                            <div className="container mx-auto flex max-w-[500px] justify-between">
                                <div >
                                    <img
                                        className="ultrawide:h-16 ultrawide:w-16 h-12 w-12 rounded-full bg-white object-cover dark:bg-gray-900"
                                        src={getProfilePicture(channel, 'avatar_lg')}
                                        draggable={false}
                                        alt={channel?.handle}
                                    />
                                </div>
                                <div className="flex items-end ml-5 gap-2 ">
                                    {channel?.id && !isOwnChannel ? (
                                        <MutualSubscribers viewingChannelId={channel.id} />
                                    ) : null}
                                    <SubscribeActions channel={channel} subscribeType={subscribeType} />
                                </div>

                            </div>
                            <div className="flex">
                                <div className="mr-3 flex flex-col items-start">
                                    <div>
                                        {(
                                            <h1 className="flex items-center text-md font-bold lowercase">
                                                {channel?.handle}
                                            </h1>
                                        )}
                                        <h2
                                            className="flex items-center text-md font-bold lowercase text-gray-400 text-xs"
                                            data-testid="channel-name"
                                        >
                                            <span>{channel.name}</span>
                                            <Tooltip content="Verified" placement="right">
                                                <span>
                                                    <IsVerified id={channel?.id} size="md" />
                                                </span>
                                            </Tooltip>
                                        </h2>
                                    </div>
                                    <Modal
                                        title="Subscribers"
                                        onClose={() => setShowSubscribersModal(false)}
                                        show={showSubscribersModal}
                                        panelClassName="max-w-md"
                                    >
                                        <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
                                            <SubscribersList channel={channel} />
                                        </div>
                                    </Modal>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowSubscribersModal(true)}
                                            className="outline-none"
                                        >
                                            <span className="inline-flex items-center space-x-1 whitespace-nowrap">
                                                {channel?.stats.totalFollowers} subscribers
                                            </span>
                                        </button>
                                        {channel.isFollowing && (
                                            <span className="rounded-full border border-gray-400 px-2 text-xs dark:border-gray-600">
                                                Subscriber
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Popover.Panel>
                    </div>
                )
            }
        </Popover>
    );
}

export default PopoverTik