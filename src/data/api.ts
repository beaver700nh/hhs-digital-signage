export const API_KEY = import.meta.env.VITE_GAPI_KEY

export type EventsType = {
	success: true
	summary: string
	timeZone: string
	items: {
		summary: string
		description: string
		start: {
			date: string
		}
		end: {
			date: string
		}
	}[]
} | {
	success: false
	error: string
}

export async function fetchCalendarEvents(id: string): Promise<EventsType> {
	let url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${id}/events`)

	const override = (window as any).DATE_OVERRIDE

	if (override != null)
		console.warn(`Using date override ${override} for Google Calendar API requests`)

	let params = new URLSearchParams({
		key: API_KEY,
		singleEvents: 'true',
		orderBy: 'startTime',
		timeMin: override ?? new Date().toISOString(),
	})

	url.search = params.toString()
	console.info(`Fetching Google Calendar events from '${url.toString()}'`)

	try {
		let response = await (await fetch(url)).json()
		response.success = true
		return response
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

export function lookupConfiguration< K extends keyof LocalStorageSchema >(key: K): LocalStorageSchema[K] | null {
	return localStorage.getItem(key) as (LocalStorageSchema[K] | null)
}
