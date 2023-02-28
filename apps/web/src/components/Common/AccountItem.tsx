import type { FC } from "react"
import React from "react"
import Tooltip from "@components/UIElements/Tooltip"
import useAppStore from "@lib/store"
import Link from "next/link"
import getProfilePicture from "utils/functions/getProfilePicture"
import IsVerified from "./IsVerified"

type Props = {
    channel: any
}

const AccountItem: FC<Props> = ({ channel }) => {

    const selectedChannel = useAppStore((state) => state.selectedChannel)

    return <div className="container mx-auto flex max-w-[85rem] space-x-3 md:items-center md:space-x-5 ">
        <div className="flex-none">
            <Link
                href={`/channel/${channel?.handle}`}
            >
                <img
                    className="ultrawide:h-32 ultrawide:w-16 h-8 w-8 rounded-full bg-white object-cover dark:bg-gray-900"
                    src={getProfilePicture(channel, 'avatar_lg')}
                    draggable={false}
                    alt={channel?.handle}
                />
            </Link>
        </div>
        <div className="flex flex-1 flex-wrap justify-between space-y-3 py-2">
            <Link
                href={`/channel/${channel?.handle}`}
            >
                <div className="mr-3 flex flex-col items-start">
                    {channel.name && (
                        <h1 className="flex items-center space-x-1.5 font-medium md:text-lg">
                            {channel.name}
                        </h1>
                    )}
                    <h2
                        className="flex items-center space-x-1.5 md:text-sm"
                        data-testid="channel-name"
                    >
                        <span>@{channel?.handle}</span>
                        <Tooltip content="Verified" placement="right">
                            <span>
                                <IsVerified id={channel?.id} size="md" />
                            </span>
                        </Tooltip>
                    </h2>

                </div>
            </Link>
        </div>
    </div>
}

export default AccountItem