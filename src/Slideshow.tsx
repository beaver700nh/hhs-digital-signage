import { useEffect, useState } from 'react'

import { lookupConfiguration } from './data/config'

import './Slideshow.css'

const SLIDESHOW_URL = "https://docs.google.com/presentation/d/e/2PACX-1vROO4Y7tVDDnf0iDH0U3CzeecQxCOctDw_MgXkCrpyKHVRqVSCz0lzpKlyL1LiA_LGWUEX7u585lF1A/embed";

export default function Slideshow() {
  const [refreshKey, setRefreshKey] = useState(0)

  const advanceInterval = lookupConfiguration('slideshowAdvanceInterval')
  const refreshInterval = lookupConfiguration('slideshowRefreshInterval')

  useEffect(() => {
    const interval = setInterval(() => setRefreshKey(_ => Math.random()), refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])

  return (
		<article id="slideshow">
			<div className="wrapper">
				<iframe
					key={refreshKey}
					allowFullScreen={true}
					src={`${SLIDESHOW_URL}?start=true&loop=true&delayms=${advanceInterval}&rm=minimal`}
				/>
			</div>
		</article>
  )
}
