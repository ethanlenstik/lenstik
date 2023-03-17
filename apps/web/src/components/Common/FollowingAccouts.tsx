import type { ProfileQuery } from "lens"
import type { FC } from "react"
import React, {  useState } from "react"
import { useSubscribersQuery } from "lens"
import AccountItem from "./AccountItem"

type PropsAccs = {
    profile?: ProfileQuery
}

const FollowingAccounts: FC<PropsAccs> = ({profile}) => {
    const [ isAllSuggest , setAllSuggest ] = useState(false);
    const channel = profile?.profile
    const request = { profileId: channel?.id, limit: 30 }
    const { data: followers, loading: loadingFollows, fetchMore } = useSubscribersQuery({
      variables: { request },
      skip: !channel?.id
    })

    const displayProFiles = isAllSuggest?  followers?.followers.items: followers?.followers.items.slice(0,2)

    return <div className="border-b dark:border-b-slate-800">
        <h3 className='mb-5 text-gray-500 font-bold'>Following Accounts</h3>
        <div className="py-[10px]">
            {
                displayProFiles?displayProFiles?.map(channel => <AccountItem key={channel.wallet.address} channel={channel.wallet.defaultProfile}/>): <span className="text-sm text-gray-500">Log in to follow creators, like videos, and view comments.</span>
            }
        </div>
        <div>
            {isAllSuggest?<button onClick={()=> setAllSuggest(false)} className="text-pink-600">See Less</button>: <button className="text-pink-600" onClick={()=> setAllSuggest(true)}>See More</button>}
        </div>
    </div>
}

export default FollowingAccounts