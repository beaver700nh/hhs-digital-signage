import moment from 'moment'

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
	error: {
		message: string
	}
}

export interface CalendarFetchParameters {
	calendarId?: string
	config?: {
		useLiveTiming: boolean
	}
}

const API_KEY = import.meta.env.VITE_GAPI_KEY

export async function fetchCalendarEvents(params: CalendarFetchParameters): Promise<EventsTypeSchema> {
	const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events`)

	const override = (window as { DATE_OVERRIDE?: string }).DATE_OVERRIDE

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
			const error = data as EventsTypeSchema & { success: false }
			throw new Error(`Google Calendar API returned ${response.status} ${error.error.message}`)
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

export const localStorageDefaults = {
	disableHtmlSchedule: false,
	disableWidgets: [] as number[],
	lunchListMax: 5,
	athleticsListMax: 8,
	athleticsScrollSpeed: 30,
	athleticsPauseDuration: 3000,
	carouselAdvanceInterval: moment.duration(10, 'seconds').asMilliseconds(),
	carouselRefreshInterval: moment.duration(5, 'minutes').asMilliseconds(),
	slideshowAdvanceInterval: moment.duration(15, 'seconds').asMilliseconds(),
	slideshowRefreshInterval: moment.duration(1, 'hour').asMilliseconds(),
}

type LocalStorageSchema = typeof localStorageDefaults

export function lookupConfiguration<K extends keyof LocalStorageSchema>(key: K) {
	let value = localStorage.getItem(key) as (LocalStorageSchema[K] | null)
	let fallback = false

	if (value === null) {
		fallback = true
		value = localStorageDefaults[key]
	}

	console.info(`Using configuration key '${key}' with value '${value}'${fallback ? ' (fallback)' : ''}`)
	return value
}
