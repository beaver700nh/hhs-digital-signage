import moment, { type DurationInputArg2 } from 'moment'

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
	?? new URLSearchParams(window.location.search).get('gapikey')

export async function fetchCalendarEvents(params: CalendarFetchParameters): Promise<EventsTypeSchema> {
	if (API_KEY == null)
		return {
			success: false,
			error: new Error('Missing Google API key.')
		}

	const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${params.calendarId}/events`)

	const override = (window as { DATE_OVERRIDE?: string }).DATE_OVERRIDE

	if (override != null)
		console.warn(`Using date override ${override} for Google Calendar API requests`)

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

function ms(magnitude: number, unit: DurationInputArg2) {
	return moment.duration(magnitude, unit).asMilliseconds()
}

export const localStorageDefaults = {
	disableHtmlSchedule: false,
	disableWidgets: [] as number[],
	bellScheduleSize: 1.5,
	lunchListMax: 7,
	athleticsListMax: 8,
	calendarScrollSpeed: 67,
	calendarScrollPause: 3000,
	carouselAdvanceInterval: ms(20, 'seconds'),
	carouselRefreshInterval: ms(10, 'minutes'),
	slideshowAdvanceInterval: ms(20, 'seconds'),
	slideshowRefreshInterval: ms(1, 'hour'),
}

type LocalStorageSchema = typeof localStorageDefaults

function checkValidKey(key: string): asserts key is keyof LocalStorageSchema {
	if (!(key in localStorageDefaults))
		throw new Error(`Unknown configuration key: '${key}'`)
}

export function lookupConfiguration<K extends keyof LocalStorageSchema>(key: K) {
	checkValidKey(key)

	const item = localStorage.getItem(key) as (LocalStorageSchema[K] | null)

	const value = item ?? localStorageDefaults[key]
	const fallback = item === null ? ' default' : ''

	console.info(`%cLooked up '${key}', got${fallback} '${value}'`, 'color: #555')
	// console.trace();

	return value
}
