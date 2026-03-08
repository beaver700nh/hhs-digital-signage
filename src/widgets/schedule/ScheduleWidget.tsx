import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'

const ScheduleWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => {
		const parsed = JSON.stringify(data.items.map(x => `${x.summary} @ ${x.start.date} - ${x.end.date}`), null, 2);
		console.log(parsed)
		return parsed
	}, [data])

	return (
		<>
			<p className="widget one">{data.summary}</p>
			<pre>{parsed}</pre>
		</>
	)
}

ScheduleWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default ScheduleWidget

