import { useEffect, useState, Suspense, type ComponentType } from 'react'
import moment from 'moment';

import { fetchCalendarEvents, type EventsType } from '@/google/api'

export type WidgetRenderer = ComponentType<{ promise: Promise<EventsType> }> & { CAL_ID: string }

const REFRESH_INTERVAL = moment.duration(10, 'seconds').asMilliseconds()

export default function DataFetcher({ RendererComponent }: {
	RendererComponent: WidgetRenderer,
}) {
	console.log('DataFetcher render')
	const [promise, setPromise] = useState<Promise<EventsType> | null>(null)

  useEffect(() => {
    const interval = setInterval((function iife() {
			setPromise(fetchCalendarEvents(RendererComponent.CAL_ID))
			return iife
    })(), REFRESH_INTERVAL)

    return () => clearInterval(interval)
  }, [RendererComponent.CAL_ID])

	return (
		promise == null ? null :
		<Suspense fallback={<p>Loading data...</p>}>
			<RendererComponent promise={promise} />
		</Suspense>
	)
}
