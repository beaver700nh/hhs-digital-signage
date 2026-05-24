import { use, useMemo } from 'react'

import type { EventsTypeSchema } from '@/data/api'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseLunch from './parser'
import WidgetError from '../placeholder/WidgetError'
import LunchInfo from './LunchInfo'

import './LunchWidget.css'

const LunchWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseLunch(data) : null, [data])

	return (
		parsed == null || parsed.length === 0 ?
			<WidgetError message={(data as EventsTypeSchema & { success: false }).error.message
				?? "No lunch information found."} /> :
		<>
			<LunchInfo lunches={parsed} />
		</>
	)
}

LunchWidget.calendarId = 'holliston.k12.ma.us_c2d4uic3gbsg7r9vv9qo8a949g@group.calendar.google.com'
export default LunchWidget
