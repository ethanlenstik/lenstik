import axios from 'axios'
import { useEffect, useState } from 'react'

import { LIVEPEER_VIEWS_URL } from '../constants'

const useVideoViews = (sourceUrl: string) => {
  const [loading, setLoading] = useState(false)
  const [views, setViews] = useState(0)

  const fetchVideoViews = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(LIVEPEER_VIEWS_URL, {
        sourceUrl
      })
      if (data && data.success) {
        setViews(data.views)
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideoViews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceUrl])

  return { views, loading }
}

export default useVideoViews
