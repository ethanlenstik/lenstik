import type { FC } from "react"
import React, { useState } from "react"
import Tooltip from "@components/UIElements/Tooltip"
import useAppStore from "@lib/store"
import Link from "next/link"
import getProfilePicture from "utils/functions/getProfilePicture"
import IsVerified from "./IsVerified"
import clsx from "clsx"
import PopoverTik from "@components/UIElements/Popover"

type Props = {
    channel: any
    isSuggested?: boolean
}

const AccountItem: FC<Props> = ({ channel, isSuggested }) => {
    const [hover, setHover] = useState<String>('onMouseLeave')


    return <div className={clsx("relative px-1 py-[6.5px]", "hover:bg-gray-200 dark:hover:bg-gray-800")}>
        {isSuggested && <div className="flex-none">
            <PopoverTik hover={hover} channel={channel} />
        </div>}
        <div className={clsx("flex flex-1 flex-wrap justify-between space-y-3",)}
            onMouseEnter={() => setHover("onMouseEnter")}
            onMouseLeave={() => setHover("onMouseLeave")}
        >
            <Link
                href={`/channel/${channel?.handle}`}
            >

                <div className="flex gap-3 items-start">
                    <img
                        className="h-8 w-8 rounded-full bg-white object-cover dark:bg-gray-900"
                        src={getProfilePicture(channel, 'avatar_lg')}
                        draggable={false}
                        alt={channel?.handle}
                    />
                    <div>
                        { (
                            <h1 className="flex items-center text-md font-bold lowercase">
                                {channel?.handle}
                            </h1>
                        )}
                        <h2
                            className="flex items-center font-bold lowercase text-gray-400 text-xs"
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

                </div>
            </Link>
        </div>
    </div>
}

export default AccountItem
