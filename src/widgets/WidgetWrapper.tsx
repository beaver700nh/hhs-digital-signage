import { useEffect, useState, use, Suspense, type ComponentType } from 'react'

import { fetchCalendarEvents, type EventsTypeSchema, type CalendarFetchParameters } from '@/data/api'
import { lookupConfiguration } from '@/data/config'

import ActiveWidgetContext from '@/widgets/ActiveWidgetContext'
import { nextWidget, prevWidget } from './widgets'
import WidgetLoading from './placeholder/WidgetLoading'

import './WidgetWrapper.css'

export type WidgetRenderer = ComponentType<{
	index: number,
	promise: Promise<EventsTypeSchema>,
}> & CalendarFetchParameters

export default function WidgetWrapper({ index, RendererComponent }: {
	index: number,
	RendererComponent: WidgetRenderer,
}) {
	const [promise, setPromise] = useState<Promise<EventsTypeSchema> | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	const refreshInterval = lookupConfiguration('carouselRefreshInterval')

	useEffect(() => {
		const interval = setInterval((function iife() {
			if (RendererComponent.calendarId != null)
				setPromise(fetchCalendarEvents(RendererComponent))
			return iife
		})(), refreshInterval)

		return () => clearInterval(interval)
	}, [RendererComponent, refreshKey, refreshInterval])

	const activeWidget = use(ActiveWidgetContext)
	const animationState =
		activeWidget === index ? 'focused' :
		activeWidget === prevWidget(index) ? 'inbound' :
		activeWidget === nextWidget(index) ? 'outbound' :
		'unloaded'

	return (
		<section
			className={`carousel-widget ${animationState}`}
			onClick={() => setRefreshKey(Math.random())}
		>
			<Suspense fallback={<WidgetLoading />}>
				<RendererComponent
					index={index}
					promise={promise ?? new Promise(() => { })}
				/>
			</Suspense>
		</section>
	)
}
