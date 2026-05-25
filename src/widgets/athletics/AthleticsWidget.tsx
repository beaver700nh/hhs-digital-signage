import { use, useMemo } from 'react'

import type { EventsTypeSchema } from '@/data/api'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseAthletics from './parser'
import WidgetError from '../placeholder/WidgetError'
import AthleticsInfo from './AthleticsInfo'

import './AthleticsWidget.css'

const AthleticsWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseAthletics(data) : null, [data])

	return (
		parsed == null ?
			<WidgetError message={(data as EventsTypeSchema & { success: false }).error.message
				?? "No athletics information found."} /> :
		<>
			<AthleticsInfo calendar={parsed} />
		</>
	)
}

AthleticsWidget.calendarId = 'q2hueogbndsmgmcdidr82j1qjgn1s1oj@import.calendar.google.com'
AthleticsWidget.config = {
	useLiveTiming: true,
}

export default AthleticsWidget
