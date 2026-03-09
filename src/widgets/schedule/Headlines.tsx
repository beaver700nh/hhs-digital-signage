import type { NextDaySchedule } from "./parser"

const DATE_FORMATS = {
	lastDay: '[Yesterday]',
	sameDay: '[Today]',
	nextDay: '[Tomorrow]',
	lastWeek: '[Last] dddd',
	thisWeek: 'dddd',
	nextWeek: '[Next] dddd',
	sameElse: 'MMM Do',
}

export default function Headlines({ when, what }:
	Pick<NextDaySchedule & { exists: true }, 'when' | 'what'>
) {
	return (
		<p className="headlines">
			{what.type === 'special' ? <span className="quirk">{what.quirk}</span> : null}
			<span className="humanDate">{when.calendar(DATE_FORMATS)}'s Schedule</span>
			<span className="fullDate">{when.format('dddd, MMMM Do, YYYY')}</span>
		</p>
	)
}
