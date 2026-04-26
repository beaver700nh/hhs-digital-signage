import moment from "moment"

export const DATE_FORMATS = {
	lastDay: '[Yesterday]',
	sameDay: '[Today]',
	nextDay: '[Tomorrow]',
	lastWeek: '[Last] dddd',
	thisWeek: 'dddd',
	nextWeek: '[Next] dddd',
	sameElse: 'MMM Do',
}

export type EventsTypeSchema = {
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
} | {
	success: false
	error: string
}

export type CalendarFetchParameters = {
	calendarId?: string
	config?: {
		useLiveTiming: boolean
	}
}

const API_KEY = import.meta.env.VITE_GAPI_KEY

export async function fetchCalendarEvents(params: CalendarFetchParameters): Promise<EventsTypeSchema> {
	let url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events`)

	const override = (window as any).DATE_OVERRIDE

	if (override != null)
		console.warn(`Using date override ${override} for Google Calendar API requests`)

	// Debug: Makes it load forever
	// return new Promise(() => {})

	if (params.config != null)
		console.info(`This calendar has a special configuration: ${JSON.stringify(params.config)}`)

	const start = moment(override ?? undefined)
	// Begin querying the next day at 5pm (17:00 + 7h = midnight)
	if (!params.config?.useLiveTiming)
		start.add(7, 'hours')

	const timeMin = start.toISOString()

	let searchParams = new URLSearchParams({
		key: API_KEY,
		singleEvents: 'true',
		orderBy: 'startTime',
		timeMin,
	})

	url.search = searchParams.toString()
	console.info(`Fetching Google Calendar events for timestamp '${timeMin}' from '${url.toString()}'`)

	try {
		const response = await fetch(url)
		let data = await response.json()

		if (!response.ok)
			throw new Error(`Google Calendar API returned ${response.status} ${data.error?.message}`)

		data.success = true
		return data
	}
	catch (error) {
		return {
			success: false,
			error: (error as any).message ?? 'Couldn\'t reach Google Calendar',
		}
	}
}

export interface LocalStorageSchema {
	disableHtmlSchedule: boolean
	disableWidgets: number[]
}

export function lookupConfiguration<K extends keyof LocalStorageSchema>(key: K): LocalStorageSchema[K] | null {
	return localStorage.getItem(key) as (LocalStorageSchema[K] | null)
}
