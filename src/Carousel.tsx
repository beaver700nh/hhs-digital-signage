import { useEffect, useRef, useCallback, useState } from 'react'

import { lookupConfiguration } from '@/data/config'

import ActiveWidgetContext from './widgets/ActiveWidgetContext'
import Dots from './widgets/dots/Dots'
import WidgetWrapper from './widgets/WidgetWrapper'
import Widgets, { nextWidget } from './widgets/widgets'

import './Carousel.css'

export default function Carousel() {
	const [activeWidget, setActiveWidget] = useState(0)
	const interval = useRef<number | null>(null)

	const advanceInterval = lookupConfiguration('carouselAdvanceInterval')

	const cleanUpInterval = useCallback(() => {
		if (interval.current) clearInterval(interval.current)
		interval.current = null
	}, [])

	const startInterval = useCallback((trigger: boolean) => {
		cleanUpInterval()

		function action(trigger: boolean) {
			if (trigger) setActiveWidget(activeWidget => nextWidget(activeWidget))
			return () => action(true)
		}

		interval.current = setInterval(action(trigger), advanceInterval)
	}, [cleanUpInterval, advanceInterval])

	useEffect(() => (startInterval(false), cleanUpInterval), [startInterval, cleanUpInterval])

	return (
		<article
			id="carousel"
			onContextMenu={e => {
				if (e.ctrlKey)
					cleanUpInterval()
				else
					startInterval(true)

				e.preventDefault()
			}}
		>
			<ActiveWidgetContext value={activeWidget}>
				{Widgets.map((Widget, index) =>
					<WidgetWrapper
						key={index}
						index={index}
						RendererComponent={Widget}
					/>
				)}
				<Dots count={Widgets.length} />
			</ActiveWidgetContext>
		</article>
	)
}
