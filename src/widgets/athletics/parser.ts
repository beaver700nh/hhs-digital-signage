import moment from 'moment'

import { type EventsTypeSchema } from '@/data/api'
import * as Regex from './regex'

type Schema = EventsTypeSchema & { success: true }
type Item = Schema['items'][number]

export type AthleticsEvent = {
	when: moment.Moment
	sport: string
	opponent?: string
	location?: string
}

export default function parseAthletics(data: Schema):
	any {
	const parsed = data.items
		.slice(0, 5)
		.map(parseAthleticsEvent)

	// TODO group by start time
	return parsed
}

function parseAthleticsEvent(item: Item): AthleticsEvent {
	const { summary, description, start } = item

	return {
		when: moment(start.dateTime),
		sport: summary,
	}
}
