import { createContext, useEffect, useState } from 'react'
import moment from 'moment'

import WidgetWrapper from './widgets/WidgetWrapper'
import Widgets, { nextWidget } from './widgets/widgets'

import './Carousel.css'

const REFRESH_INTERVAL = moment.duration(10, 'seconds').asMilliseconds()

export const ActiveWidgetContext = createContext(0)

export default function Carousel() {
	const [activeWidget, setActiveWidget] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => setActiveWidget(nextWidget), REFRESH_INTERVAL)
		return () => clearInterval(interval)
	}, [])

	return (
		<article id="carousel">
			<ActiveWidgetContext.Provider value={activeWidget}>
				{Widgets.map((Widget, index) => <WidgetWrapper
					index={index}
					RendererComponent={Widget}
				/>)}
			</ActiveWidgetContext.Provider>
		</article>
	)
}
