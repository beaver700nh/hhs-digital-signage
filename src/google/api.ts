export const API_KEY = import.meta.env.VITE_GAPI_KEY

export interface EventsType {
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
}

export async function fetchCalendarEvents(id: string) {
	let url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${id}/events`)

	let params = new URLSearchParams({
		key: API_KEY,
		singleEvents: 'true',
		orderBy: 'startTime',
		timeMin: (new Date("2026-06-24T05:00:00.000Z")).toISOString(),
	})

	url.search = params.toString()
	console.log(`Fetching calendar events from ${url.toString()}`)

	return fetch(url).then(response => response.json()) as Promise<EventsType>
}
