import { use } from 'react'

import type { WidgetRenderer } from '../DataFetcher'

const TestWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)

	return (
		<p className="widget one">{data.summary}</p>
	)
}

TestWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default TestWidget

