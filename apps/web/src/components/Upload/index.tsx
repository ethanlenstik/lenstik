import useAppStore from '@lib/store'
import React from 'react'

import UploadSteps from './UploadSteps'

const UploadPage = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)

  return <div >
    <UploadSteps />
  </div>
}

export default UploadPage
