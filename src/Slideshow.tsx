import { useEffect, useState } from 'react'
import moment from 'moment'

import './Slideshow.css'

const SLIDESHOW_URL = "https://docs.google.com/presentation/d/e/2PACX-1vROO4Y7tVDDnf0iDH0U3CzeecQxCOctDw_MgXkCrpyKHVRqVSCz0lzpKlyL1LiA_LGWUEX7u585lF1A/embed";

const REFRESH_INTERVAL = moment.duration(1, 'hour').asMilliseconds()

export default function Slideshow() {
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(_ => Math.random()), REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [REFRESH_INTERVAL])

  return (
		<article id="slideshow">
      <iframe
        key={refreshKey}
        allowFullScreen={true}
        src={`${SLIDESHOW_URL}?start=true&loop=true&delayms=8000&rm=minimal`}
      ></iframe>
		</article>
  )
}
