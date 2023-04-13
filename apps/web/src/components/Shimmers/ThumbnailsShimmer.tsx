import { THUMBNAIL_GENERATE_COUNT } from '@components/Upload/ChooseThumbnail'
import React, { useMemo } from 'react'

const ThumbnailsShimmer = () => {
  const thumbnails = useMemo(() => Array(THUMBNAIL_GENERATE_COUNT).fill(1), [])

  return (
    <>
      {thumbnails.map((e, i) => (
        <div key={`${e}_${i}`} className="w-full animate-pulse  h-32 w-18">
          <div className="h-32 w-[100px] bg-gray-300 dark:bg-gray-700" />
        </div>
      ))}
    </>
  )
}

export default ThumbnailsShimmer
