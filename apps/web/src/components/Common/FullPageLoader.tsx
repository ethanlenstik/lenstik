import React from 'react'
import { STATIC_ASSETS } from 'utils'
import imageCdn from 'utils/functions/imageCdn'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags title="Loading..." />
      <div className="animate-bounce">
        <img
          src={`/images/logo.png`}
          draggable={false}
          className="h-12 w-12"
          alt="lenstik"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
