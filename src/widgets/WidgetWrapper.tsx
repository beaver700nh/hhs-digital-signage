import { useEffect, useState, useContext, Suspense, type ComponentType } from 'react'
import moment from 'moment'

import { fetchCalendarEvents, type EventsTypeSchema, type CalendarFetchParameters } from '@/data/api'
import { nextWidget, prevWidget } from './widgets';
import { ActiveWidgetContext } from '@/Carousel'
import WidgetLoading from './placeholder/WidgetLoading'

import './WidgetWrapper.css'

export type WidgetRenderer = ComponentType<{ promise: Promise<EventsTypeSchema> }> & CalendarFetchParameters

const REFRESH_INTERVAL = moment.duration(5, 'minute').asMilliseconds()

export default function WidgetWrapper({ index, RendererComponent }: {
	index: number,
	RendererComponent: WidgetRenderer,
}) {
	const [promise, setPromise] = useState<Promise<EventsTypeSchema> | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		const interval = setInterval((function iife() {
			if (RendererComponent.calendarId != null) {
				setPromise(fetchCalendarEvents(RendererComponent))
			}
			return iife
		})(), REFRESH_INTERVAL)

		return () => clearInterval(interval)
	}, [RendererComponent, refreshKey])

	const activeWidget = useContext(ActiveWidgetContext)
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
				<RendererComponent promise={promise ?? new Promise(() => {})} />
			</Suspense>
		</section>
	)
}
