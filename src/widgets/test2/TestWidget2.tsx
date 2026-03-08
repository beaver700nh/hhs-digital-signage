import { use } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'

const TestWidget2: WidgetRenderer = ({ promise }) => {
	const data = use(promise)

	return (
		<p className="widget two">{data.summary}</p>
	)
}

TestWidget2.CAL_ID = 'holliston.k12.ma.us_c2d4uic3gbsg7r9vv9qo8a949g@group.calendar.google.com'
export default TestWidget2
