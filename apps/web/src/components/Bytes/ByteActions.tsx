import CommentOutline from '@components/Common/Icons/CommentOutline'
import MirrorOutline from '@components/Common/Icons/MirrorOutline'
import MirrorVideo from '@components/Common/MirrorVideo'
import ReportModal from '@components/Common/VideoCard/ReportModal'
import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import Tooltip from '@components/UIElements/Tooltip'
import CollectVideo from '@components/Watch/CollectVideo'
import PublicationReaction from '@components/Watch/PublicationReaction'
import type { Publication } from 'lens'
import type { FC } from 'react'
import React, { useState } from 'react'
import { RiShareForwardLine } from 'react-icons/ri'

type Props = {
  video: Publication
  showDetail: () => void
}

const ByteActions: FC<Props> = ({ video, showDetail }) => {
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)

  return (
    <div className="w-14 flex-col items-center justify-between md:flex md:w-14 ml-4 mb-8 md:max-xl:mb-16">
      <div className="flex justify-center space-y-4 p-2 md:flex-col">
        {/* <VideoOptions
          video={video}
          setShowShare={setShowShare}
          setShowReport={setShowReport}
          showOnHover={false}
        /> */}
      </div>
      <div className="items-center space-y-1.5 pt-2.5 md:flex md:flex-col">
        <div className="text-white md:text-inherit">

          <PublicationReaction
            publication={video}
            iconSize="lg"
            isVertical
            showLabel
          />
        </div>
        <div className="w-full text-center text-white md:text-inherit">
          <button type='button' onClick={showDetail}>
          <div className=' rounded-full  bg-gray-200 dark:bg-gray-600 p-2'>
            <CommentOutline className="h-5 w-5" />
          </div>
          </button>
        </div>
        <div className="w-full text-center text-white md:text-inherit">
          <MirrorVideo video={video}>
            <div className="flex flex-col items-center pt-2">
              <div className=' rounded-full  bg-gray-200 dark:bg-gray-600 p-2'>
                <MirrorOutline className="h-5 w-5" />
              </div>
              <div className="pt-1 text-xs">
                {video.stats?.totalAmountOfMirrors || 'Mirror'}
              </div>
            </div>
          </MirrorVideo>
        </div>
        {/* {video?.collectModule?.__typename !== 'RevertCollectModuleSettings' && (
          <div className="hidden w-full pb-3 text-center md:block">
            <CollectVideo video={video} />
            <div className="text-center text-xs leading-3">
              {video.stats?.totalAmountOfCollects || 'Collect'}
            </div>
          </div>
        )} */}
        <div className='flex justify-center'>
          <button
            type="button"
            onClick={() => setShowShare(true)}
          >
            <div className=' rounded-full bg-gray-200 dark:bg-gray-600 p-2'>
              <RiShareForwardLine className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
      <ReportModal
        video={video}
        show={showReport}
        setShowReport={setShowReport}
      />
    </div>
  )
}

export default ByteActions
