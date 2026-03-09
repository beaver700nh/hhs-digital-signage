import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseSchedule from './parser'
import WidgetError from '../placeholder/WidgetError'

const ScheduleWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseSchedule(data) : null, [data])

	return (
		data.success ?
		<>
			<p className="widget one">{data.summary}</p>
			<pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(parsed!, null, 2)}</pre>
		</> :
		<WidgetError message={data.error} />
	)
}

ScheduleWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default ScheduleWidget

