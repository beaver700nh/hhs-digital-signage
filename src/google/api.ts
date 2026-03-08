export const API_KEY = import.meta.env.VITE_GAPI_KEY

export interface EventsType {
	summary: string
	description: string
}

export async function fetchCalendarEvents(id: string) {
	let url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${id}/events`)

	let params = new URLSearchParams({
		key: API_KEY,
	})

	url.search = params.toString()
	console.log(`Fetching calendar events from ${url.toString()}`)

	return fetch(url).then(response => response.json()) as Promise<EventsType>
}
