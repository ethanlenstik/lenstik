
import type { RecommendedProfilesQuery } from 'lens'
import type { FC } from 'react'
import React, {  useState } from "react"
import AccountItem from "./AccountItem"

type PropsAccs = {
    channels?: RecommendedProfilesQuery
}

const SuggestedAccount: FC<PropsAccs> = ({channels}) => {
    const [ isAllSuggest , setAllSuggest ] = useState(false);
    const displayProFiles = isAllSuggest?  channels?.recommendedProfiles: channels?.recommendedProfiles.slice(0,5)
    return <div className="border-b dark:border-b-slate-800 border-b-slate-100">
        <h3 className='text-gray-500 font-bold text-md mb-3 ml-1'>Suggested accounts</h3>
        <div>
            {
                displayProFiles?.map((channel) => <AccountItem key={channel.id} channel={channel} isSuggested={true} />)
            }
        </div>
        <div className='ml-1 mb-4'>
            {isAllSuggest?<button onClick={()=> setAllSuggest(false)} className="text-pink-600 text-sm">See Less</button>: <button className="text-pink-600 text-sm" onClick={()=> setAllSuggest(true)}>See All</button>}
        </div>
    </div>
}


export default SuggestedAccount