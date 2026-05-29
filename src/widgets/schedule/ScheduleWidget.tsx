import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseSchedule from './parser'
import WidgetError from '../placeholder/WidgetError'
import ScheduleInfo from './ScheduleInfo'

import './ScheduleWidget.css'

const ScheduleWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseSchedule(data, true) : null, [data])

	return (
		parsed == null ?
			<WidgetError message={data.success
				? "No schedule information found."
				: data.error.message} /> :
		<>
			<ScheduleInfo data={parsed} />
		</>
	)
}

ScheduleWidget.calendarId = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default ScheduleWidget
