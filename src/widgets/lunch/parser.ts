import moment from 'moment'

import { lookupConfiguration, type EventsTypeSchema } from '@/data/api'
// import * as Regex from './regex'

// export type ScheduleHeader = {
// 	// e.g. 'A Day'
// 	type: 'normal'
// 	letter: string
// } | {
// 	// e.g. 'D Day - Transition Day' or 'Half Day'
// 	type: 'special'
// 	letter?: string
// 	quirk: string
// }

// export type BellSchedule = {
// 	type: 'none'
// } | {
// 	type: 'html'
// 	data: string
// } | {
// 	type: 'text'
// 	data: string[]
// } | {
// 	type: 'table'
// 	data: {
// 		start: string
// 		end: string
// 		name: string
// 	}[]
// }

// export type NextDaySchedule = {
// 	when: moment.Moment
// 	header: ScheduleHeader
// 	schedule?: BellSchedule
// 	hiatus?: {
// 		// e.g. false, ['PD Day']
// 		// e.g. true, []
// 		// e.g. true, ['PD Day', 'Spring Break]
// 		names: string[]
// 		weekend: boolean | 'summer'
// 	}
// }


export default function parseLunch(
	data: EventsTypeSchema & { success: true },
):
	any {
	return {
		success: true,
		data: data.items,
	}
}
