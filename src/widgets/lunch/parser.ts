import moment from 'moment'

import { type EventsTypeSchema } from '@/data/api'
import * as Regex from './regex'

export type DayLunch = {
	when: moment.Moment
	name: string
	sides: string[]
	isVegetarian: boolean
}

export default function parseLunch(
	data: EventsTypeSchema & { success: true },
): DayLunch[] {
	return data.items
		.filter(item => item.summary.match(Regex.NO_SCHOOL) == null)
		.slice(0, 3)
		.map(parseLunchItem)
}

function parseLunchItem(
	item: (EventsTypeSchema & { success: true })['items'][number]
): DayLunch {
	const vegetarianMatch = item.summary.match(Regex.VEGETARIAN)
	const vegetarian = vegetarianMatch != null
	const name = vegetarian ? vegetarianMatch[1] : item.summary

	const sides = item.description
		?.split(/[\,;\-/\n]+/)
		?.map(s => s.trim())
		?.filter(s => s.length > 0) ?? []

	return {
		when: moment(item.start.date),
		name,
		sides,
		isVegetarian: vegetarian,
	}
}
