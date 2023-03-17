
import type { RecommendedProfilesQuery } from 'lens'
import type { FC } from 'react'
import React, {  useState } from "react"
import AccountItem from "./AccountItem"

type PropsAccs = {
    channels?: RecommendedProfilesQuery
}

const SuggestedAccount: FC<PropsAccs> = ({channels}) => {
    const [ isAllSuggest , setAllSuggest ] = useState(false);
    const displayProFiles = isAllSuggest?  channels?.recommendedProfiles: channels?.recommendedProfiles.slice(0,4)
    return <div className="border-b dark:border-b-slate-800">
        <h3 className='mb-5 text-gray-500 font-bold'>Suggested accounts</h3>
        <div>
            {
                displayProFiles?.map((channel) => <AccountItem key={channel.id} channel={channel} isSuggested={true} />)
            }
        </div>
        <div>
            {isAllSuggest?<button onClick={()=> setAllSuggest(false)} className="text-pink-600">See Less</button>: <button className="text-pink-600" onClick={()=> setAllSuggest(true)}>See All</button>}
        </div>
    </div>
}


export default SuggestedAccount