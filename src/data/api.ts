import moment from 'moment'

import { lookupConfiguration } from './config'

export const DATE_FORMATS = {
	lastDay: '[Yesterday]',
	sameDay: '[Today]',
	nextDay: '[Tomorrow]',
	lastWeek: '[Last] dddd',
	thisWeek: 'dddd',
	nextWeek: '[Next] dddd',
	sameElse: 'MMM Do',
}

export interface EventsFailure {
	success: false
	error: {
		message: string
	}
}

export interface EventsSuccess {
	success: true
	summary: string
	timeZone: string
	items: {
		summary: string
		description?: string
		start: {
			date: string
			dateTime: string
		}
		end: {
			date: string
			dateTime: string
		}
	}[]
}

export type EventsTypeSchema = EventsFailure | EventsSuccess

export interface CalendarFetchParameters {
	calendarId?: string
	config?: {
		useLiveTiming: boolean
	}
}

const API_KEY = import.meta.env.VITE_GAPI_KEY
	?? lookupConfiguration('gapiKey')

export async function fetchCalendarEvents(params: CalendarFetchParameters): Promise<EventsTypeSchema> {
	if (!API_KEY)
		return {
			success: false,
			error: new Error('Missing Google API key.')
		}

	const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events`)

	const override = (window as { __DATE_OVERRIDE?: string }).__DATE_OVERRIDE

	if (override != null)
		console.warn(`Using date override ${override} for Google Calendar API requests`)

	if (params.config != null)
		console.info(`This calendar has a special configuration: ${JSON.stringify(params.config)}`)

	const start = moment(override ?? undefined)
	let offset = lookupConfiguration('dayRolloverTime')

	if (offset < 0 || offset > 24) {
		console.warn(`Invalid day rollover time: ${offset}.`)
		offset = 24 // Don't rollover at all, because it's never 24:00
	}

	// e.g. offset = 17 (5pm)
	// 17 + 7 = 24, so if we add 7 hours it will look at tomorrow at 5pm
	if (!params.config?.useLiveTiming)
		start.add(24 - offset, 'hours')

	const timeMin = start.toISOString()

	const searchParams = new URLSearchParams({
		key: API_KEY,
		singleEvents: 'true',
		orderBy: 'startTime',
		timeMin,
	})

	url.search = searchParams.toString()
	console.info(`Fetching Google Calendar events for timestamp '${timeMin}' from '${url.toString()}'`)

	try {
		const response = await fetch(url)
		const data = await response.json() as EventsTypeSchema

		if (!response.ok) {
			const message = (data as EventsFailure).error.message
			throw new Error(`Google Calendar API returned ${response.status} ${message}`)
		}

		data.success = true
		return data
	}
	catch (error) {
		return {
			success: false,
			error: error as Error
		}
	}
}
