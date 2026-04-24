import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseLunch from './parser'
import WidgetError from '../placeholder/WidgetError'

import './LunchWidget.css'

const LunchWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseLunch(data) : null, [data])

	return (
		parsed == null ?
			<WidgetError message={(data as any).error ?? "No schedule information found."} /> :
		<>
			<pre style={{ whiteSpace: 'pre-wrap', width: '100%' }}>{JSON.stringify(parsed, null, 2)}</pre>
		</>
	)
}

LunchWidget.CAL_ID = 'holliston.k12.ma.us_c2d4uic3gbsg7r9vv9qo8a949g@group.calendar.google.com'
export default LunchWidget

