import MutualSubscribers from "@components/Channel/Mutual/MutualSubscribers"
import Modal from "@components/UIElements/Modal"
import Tooltip from "@components/UIElements/Tooltip"
import useAppStore from "@lib/store"
import { data } from "@tensorflow/tfjs"
import clsx from "clsx"
import { Link } from "interweave-autolink"
import { Profile, ProfileQuery, RecommendedProfilesQuery, useSubscribersQuery } from "lens"
import { FC, useState } from "react"
import getProfilePicture from 'utils/functions/getProfilePicture'
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
  
    console.log("xxxxx", displayProFiles)

    return <div className="border-b border-b-gray-300">
        <h3 className='mb-5'>Following Accounts</h3>
        <div>
            {
                displayProFiles?.map(channel => <AccountItem channel={channel.wallet.defaultProfile}/>)
            }
        </div>
        <div>
            {isAllSuggest?<button onClick={()=> setAllSuggest(false)} className="text-pink-600">See Less</button>: <button className="text-pink-600" onClick={()=> setAllSuggest(true)}>See More</button>}
        </div>
    </div>
}

export default FollowingAccounts