import moment, { type DurationInputArg2 } from 'moment'

export const URL_SEARCH_PARAMS = new URLSearchParams(window.location.search)

function ms(magnitude: number, unit: DurationInputArg2) {
	return moment.duration(magnitude, unit).asMilliseconds()
}

const localStorageDefaults = {
	gapiKey: '',
	dayRolloverTime: 17,
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
type Key = keyof LocalStorageSchema

const localStorageAlt = (() => {
	const data = URL_SEARCH_PARAMS.get('config')

	if (data == null)
		return null

	return (
		JSON.parse(
			new TextDecoder().decode(
				Uint8Array.fromBase64(data, { alphabet: "base64url" })))
	)	as Partial<LocalStorageSchema>
})()

// @ts-expect-error assigning extra property
window.__EXPORT_CONFIG = function (data: object) {
	return (
		new TextEncoder().encode(
			JSON.stringify({ ...localStorage, ...localStorageAlt, ...data }))
				.toBase64({ alphabet: "base64url" })
	)
}

const sources = [
	{
		name: '?config=(base64)',
		lookup: key => localStorageAlt?.[key] ?? null,
	},
	{
		name: 'localStorage',
		lookup: key => localStorage.getItem(key),
	},
	{
		name: null,
		lookup: key => localStorageDefaults[key],
	},
] as const as {
	name?: string,
	lookup: <K extends Key>(k: K) => LocalStorageSchema[K] | null,
}[]

export function lookupConfiguration<K extends Key>(key: K) {
	for (const { name, lookup } of sources) {
		const value = lookup(key)

		if (value != null || name == null) {
			console.log(
				`%cFound '${key}' in ${name == null ? '(default)' : `'${name}'`}' =`,
				'color: #555', JSON.stringify(value)
			)
			return value!
		}
	}

	throw new Error() // unreachable
}
