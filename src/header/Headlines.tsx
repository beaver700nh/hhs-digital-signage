import { DATE_FORMATS } from '@/data/api'
import type { NextDaySchedule } from '@/widgets/schedule/parser'

export default function Headlines({ when, header }:
	Pick<NextDaySchedule & { exists: true }, 'when' | 'header'>
) {
	return (
		<p className="headlines">
			{header.type === 'special' ? <span className="quirk">{header.quirk}</span> : null}
			<span className="humanDate">{when.calendar(DATE_FORMATS)}</span>
			<span className="fullDate">{when.format('ddd, MMM Do, YYYY')}</span>
		</p>
	)
}
