import { use } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'

const TestWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)

	return (
		<>
			<p className="widget one">{data.summary}</p>
			<pre>{JSON.stringify(data.items.map(x => `${x.summary} @ ${x.start.date} - ${x.end.date}        ${x.description}`), null, 2)}</pre>
		</>
	)
}

TestWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default TestWidget

