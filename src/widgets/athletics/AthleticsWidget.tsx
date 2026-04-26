import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseAthletics from './parser'
import WidgetError from '../placeholder/WidgetError'

import './AthleticsWidget.css'

const AthleticsWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseAthletics(data) : null, [data])

	return (
		parsed == null || parsed.length === 0 ?
			<WidgetError message={(data as any).error ?? "No lunch information found."} /> :
		<>
			<pre>{JSON.stringify(parsed, null, 2)}</pre>
		</>
	)
}

AthleticsWidget.calendarId = 'q2hueogbndsmgmcdidr82j1qjgn1s1oj@import.calendar.google.com'
AthleticsWidget.config = {
	useLiveTiming: true,
}

export default AthleticsWidget
