import CopyOutline from '@components/Common/Icons/CopyOutline'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import * as tf from '@tensorflow/tfjs'
import clsx from 'clsx'
import * as nsfwjs from 'nsfwjs'
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { IS_MAINNET } from 'utils'
import formatBytes from 'utils/functions/formatBytes'
import { getIsNSFW } from 'utils/functions/getIsNSFW'
import imageCdn from 'utils/functions/imageCdn'
import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl'
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard'
import logger from 'utils/logger'

import ChooseThumbnail from './ChooseThumbnail'
import UploadMethod from './UploadMethod'

if (IS_MAINNET) {
  tf.enableProdMode()
}

const Video = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const [copy] = useCopyToClipboard()
  const videoRef = useRef<HTMLVideoElement>(null)

  const analyseVideo = async (currentVideo: HTMLVideoElement) => {
    if (currentVideo && !uploadedVideo.isNSFW) {
      try {
        const model = await nsfwjs.load()
        const predictions = await model?.classify(currentVideo, 3)
        setUploadedVideo({
          isNSFW: getIsNSFW(predictions)
        })
      } catch (error) {
        logger.error('[Error Analyse Video]', error)
      }
    }
  }

  const onDataLoaded = async (event: Event) => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setUploadedVideo({
        durationInSeconds: videoRef.current.duration.toFixed(2)
      })
    }
    if (event.target) {
      const currentVideo = document.getElementsByTagName('video')[0]
      await analyseVideo(currentVideo)
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef])

  const onCopyVideoSource = async (value: string) => {
    await copy(value)
    toast.success('Video source copied')
  }

  const onThumbnailUpload = (ipfsUrl: string, thumbnailType: string) => {
    setUploadedVideo({ thumbnail: ipfsUrl, thumbnailType })
  }

  return (
    <div className="flex w-full flex-col">
  
  
      <div className="mt-4">
       
      </div>
      <ul className="mt-4 list-inside list-disc text-xs">
        <li>
          Stay active in current tab while uploading for faster experience.
        </li>
        <li>Video will be stored permanently on-chain and can't be updated.</li>
      </ul>
      <div className="rounded-lg">
        <UploadMethod />
      </div>
    </div>
  )
}

export default Video
