import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseSchedule from './parser'

const ScheduleWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => parseSchedule(data), [data])

	return (
		<>
			<p className="widget one">{data.summary}</p>
			<pre>{JSON.stringify(parsed, null, 2)}</pre>
		</>
	)
}

ScheduleWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default ScheduleWidget

