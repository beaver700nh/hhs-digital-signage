import { use, useMemo, useState, useEffect, Suspense } from 'react'
import moment from 'moment'

import { fetchCalendarEvents, type EventsTypeSchema } from '@/data/api'
import parseSchedule from '@/widgets/schedule/parser'

import WidgetLoading from '@/widgets/placeholder/WidgetLoading'
import WidgetError from '@/widgets/placeholder/WidgetError'
import Headlines from './Headlines'
import Letter from './Letter'

import './Header.css'

const REFRESH_INTERVAL = moment.duration(15, 'minute').asMilliseconds()

function Widget({ promise }: {
	promise: Promise<EventsTypeSchema>
}) {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseSchedule(data) : null, [data])

	return (
		parsed == null ?
			<WidgetError message={(data as EventsTypeSchema & { success: false }).error.message
				?? "No schedule information found."} /> :
		<>
			<Letter header={parsed.header} />
			<Headlines when={parsed.when} header={parsed.header} />
		</>
	)
}

const calendarId = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'

export default function Header() {
	const [promise, setPromise] = useState<Promise<EventsTypeSchema> | null>(null)
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		const interval = setInterval((function iife() {
				setPromise(fetchCalendarEvents({ calendarId }))
			return iife
		})(), REFRESH_INTERVAL)

		return () => clearInterval(interval)
	}, [refreshKey])

	return (
		<article
			id="header"
			onClick={() => setRefreshKey(Math.random())}
		>
			<Suspense fallback={<WidgetLoading />}>
				<Widget promise={promise ?? new Promise(() => {})} />
			</Suspense>
		</article>
	)
}
