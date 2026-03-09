import { use, useMemo } from 'react'

import type { WidgetRenderer } from '../WidgetWrapper'
import parseSchedule from './parser'
import WidgetError from '../placeholder/WidgetError'
import Letter from './Letter'
import Headlines from './Headlines'
import BellSchedule from './BellSchedule'

import './ScheduleWidget.css'

const ScheduleWidget: WidgetRenderer = ({ promise }) => {
	const data = use(promise)
	const parsed = useMemo(() => data.success ? parseSchedule(data) : null, [data])
	console.log(parsed)

	return (
		!data.success ?
			<WidgetError message={data.error} /> :
		!parsed!.exists ?
			<WidgetError message="No schedule information found." /> :
		/* success */
			<>
				<div className="schedule-header">
					<Letter what={parsed!.what} />
					<Headlines when={parsed!.when} what={parsed!.what} />
				</div>
				<BellSchedule what={parsed!.what} />
			</>
	)
}

ScheduleWidget.CAL_ID = 'sulsp2f8e4npqtmdp469o8tmro@group.calendar.google.com'
export default ScheduleWidget

