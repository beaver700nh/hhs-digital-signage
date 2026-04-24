import { createContext, useEffect, useRef, useCallback, useState } from 'react'
import moment from 'moment'

import Dots from './widgets/Dots'
import WidgetWrapper from './widgets/WidgetWrapper'
import Widgets, { nextWidget } from './widgets/widgets'

import './Carousel.css'

const REFRESH_INTERVAL = moment.duration(10, 'seconds').asMilliseconds()

export const ActiveWidgetContext = createContext(-1)

export default function Carousel() {
	const [activeWidget, setActiveWidget] = useState(0)
	const interval = useRef<number | null>(null)

	const cleanupInterval = useCallback(() => {
		interval.current && clearInterval(interval.current)
		interval.current = null
	}, [])

	const startInterval = useCallback((trigger: boolean) => {
		cleanupInterval()

		function action(trigger: boolean) {
			trigger && setActiveWidget(nextWidget)
			return () => action(true)
		}

		interval.current = setInterval(action(trigger), REFRESH_INTERVAL)
	}, [cleanupInterval])

	useEffect(() => (startInterval(false), cleanupInterval), [startInterval, cleanupInterval])

	return (
		<article
			id="carousel"
			onContextMenu={e => {
				if (e.ctrlKey)
					cleanupInterval()
				else
					startInterval(true)

				e.preventDefault()
			}}
		>
			<ActiveWidgetContext.Provider value={activeWidget}>
				{Widgets.map((Widget, index) => <WidgetWrapper
					key={index}
					index={index}
					RendererComponent={Widget}
				/>)}
				<Dots count={Widgets.length} />
			</ActiveWidgetContext.Provider>
		</article>
	)
}
