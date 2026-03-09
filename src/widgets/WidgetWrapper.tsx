import { useEffect, useState, useContext, Suspense, type ComponentType } from 'react'
import moment from 'moment';

import { fetchCalendarEvents, type EventsType } from '@/google/api'
import { nextWidget, prevWidget } from './widgets';
import { ActiveWidgetContext } from '@/Carousel'
import WidgetLoading from './placeholder/WidgetLoading'

import './WidgetWrapper.css'

export type WidgetRenderer = ComponentType<{ promise: Promise<EventsType> }> & { CAL_ID?: string }

const REFRESH_INTERVAL = moment.duration(1, 'minute').asMilliseconds()

export default function WidgetWrapper({ index, RendererComponent }: {
	index: number,
	RendererComponent: WidgetRenderer,
}) {
	const [promise, setPromise] = useState<Promise<EventsType> | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		const interval = setInterval((function iife() {
			if (RendererComponent.CAL_ID != null) {
				setPromise(fetchCalendarEvents(RendererComponent.CAL_ID))
			}
			return iife
		})(), REFRESH_INTERVAL)

		return () => clearInterval(interval)
	}, [RendererComponent.CAL_ID, refreshKey])

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
