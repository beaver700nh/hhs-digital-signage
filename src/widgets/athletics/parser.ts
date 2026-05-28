import moment from 'moment'

import { lookupConfiguration, type EventsTypeSchema } from '@/data/api'
import * as Regex from './regex'

type Schema = EventsTypeSchema & { success: true }
type Item = Schema['items'][number]
type Description = Partial<Record<"Sport" | "Level" | "Team" | "Site" | "Subsite", string>>

export interface AthleticsEvent {
	when: moment.Moment
	sport: string
	level?: string
	opponent?: string
	homeAway?: 'home' | 'away'
	location: {
		site?: string
		subsite?: string
	}
}

export type AthleticsCalendar = Record<string, {
		when: moment.Moment
		events: Omit<AthleticsEvent, 'when'>[]
	}>

export default function parseAthletics(data: Schema): AthleticsCalendar {
	const maxItems = lookupConfiguration('athleticsListMax')
	const parsed = data.items
		.slice(0, maxItems)
		.map(parseAthleticsEvent)

	const calendar: AthleticsCalendar = {}

	for (const item of parsed) {
		const id = item.when.unix()

		calendar[id] ??= {
			when: item.when,
			events: [],
		}

		calendar[id].events.push(item)
	}

	return calendar
}

function parseAthleticsEvent(item: Item): AthleticsEvent {
	const { summary, description, start } = item

	/*
	 * Title format: LEVEL SPORT [VS OPPONENT]
	 * Grab opponent from title, if present
	 * Grab level and sport from description, but fall back to title if missing
	 * - In that case, it will be impossible to separate them, so omit level
	 */

	const summaryMatch = summary.match(Regex.HOME_AWAY)
	const [, team, homeAway, opponent] = [...summaryMatch ?? []]

	const data = parseDescription(description ?? '')

	const site = removeHighSchool(data.Site)
	const subsite = removeHighSchool(data.Subsite)

	return {
		when: moment(start.dateTime),
		sport: (data.Sport ?? team).replaceAll(Regex.REDUNDANT_SPECIFIER, ''),
		level: data.Sport != null ? data.Level : undefined,
		opponent: removeHighSchool(opponent),
		homeAway:
			homeAway === 'vs' ? 'home' :
			homeAway === 'at' ? 'away' :
			homeAway === '@' ? 'away' :
			undefined,
		location: {
			site: site != null && subsite?.includes(site)
				? subsite : site,
			subsite: false // eslint-disable-line no-constant-binary-expression
				|| site == null
				|| subsite == null
				|| site.includes(subsite)
				|| subsite.includes(site)
				? undefined : subsite,
		},
	}
}

function parseDescription(description: string) {
	const match = description.matchAll(Regex.DESCRIPTION);

	if (match == null)
		return {}

	return Object.fromEntries(
		[...match].map(m => m.slice(1)
			.map(x => x.trim().replace(/\s+/g, ' ')))
	) as Description
}

function removeHighSchool(location: string | undefined) {
	if (location == null)
		return undefined

	const match = location.match(Regex.HIGH_SCHOOL)?.[1]

	if (match == null)
		return location

	return `${match} HS`
}
