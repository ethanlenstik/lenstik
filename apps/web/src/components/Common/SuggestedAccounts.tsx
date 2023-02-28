import MutualSubscribers from "@components/Channel/Mutual/MutualSubscribers"
import Modal from "@components/UIElements/Modal"
import Tooltip from "@components/UIElements/Tooltip"
import useAppStore from "@lib/store"
import clsx from "clsx"
import { Link } from "interweave-autolink"
import { Profile, RecommendedProfilesQuery } from "lens"
import { FC, useState } from "react"
import getProfilePicture from 'utils/functions/getProfilePicture'
import AccountItem from "./AccountItem"
import IsVerified from "./IsVerified"
import SubscribeActions from "./SubscribeActions"

type PropsAccs = {
    channels?: RecommendedProfilesQuery
}

const SuggestedAccount: FC<PropsAccs> = ({channels}) => {
    const [ isAllSuggest , setAllSuggest ] = useState(false);
    const displayProFiles = isAllSuggest?  channels?.recommendedProfiles: channels?.recommendedProfiles.slice(0,4)
    return <div className="border-b border-b-gray-300">
        <h3 className='mb-5'>Suggested accounts</h3>
        <div>
            {
                displayProFiles?.map(channel => <AccountItem channel={channel}/>)
            }
        </div>
        <div>
            {isAllSuggest?<button onClick={()=> setAllSuggest(false)} className="text-pink-600">See Less</button>: <button className="text-pink-600" onClick={()=> setAllSuggest(true)}>See All</button>}
        </div>
    </div>
}


type Props = {
    channel: any
}

export default SuggestedAccount