import { useCallback, useEffect, useRef } from 'react'
import type { PropsWithChildren, ReactNode } from 'react'

import { lookupConfiguration } from '@/data/config'

import './CalendarTable.css'

function scrollEasing(t: number) {
	if (t < 0) return 0
	if (t > 1) return 1

	// Standard cubic smoothstep
	const t2 = t * t
	return 3 * t2 - 2 * t2*t
}

export default function CalendarTable({
	children,
	title,
	extras,
}: PropsWithChildren<{
	title: string
	extras?: ReactNode
}>) {
	const cleanTitle = title.replaceAll(/\W/g, '')

	const tableRef = useRef<HTMLTableElement>(null)
	const scrollBeginTime = useRef<number>(null)
	const animationId = useRef<number>(null)

	const scrollSpeed = lookupConfiguration('calendarScrollSpeed')
	const pauseDuration = lookupConfiguration('calendarScrollPause')

	console.info(`CalendarTable '${cleanTitle}' rendered`)

	const scroll = useCallback((maxScroll: number, currentTime: number) => {
		scrollBeginTime.current ??= currentTime

		const scrollDuration = maxScroll / scrollSpeed * 1000
		const cycleDuration = 2 * (scrollDuration + pauseDuration)

		const elapsed = currentTime - scrollBeginTime.current
		const phaseElapsed = elapsed % cycleDuration

		if (elapsed >= cycleDuration) {
			scrollBeginTime.current = currentTime - phaseElapsed
		}

		return (() => {
			const cutoff = cycleDuration - scrollDuration

			return maxScroll * (
				phaseElapsed < cutoff
					? scrollEasing((phaseElapsed - pauseDuration) / scrollDuration)
					: 1 - scrollEasing((phaseElapsed - cutoff) / scrollDuration)
			)
		})()
	}, [pauseDuration, scrollSpeed])

	const animate = useCallback((currentTime: number) => {
		const table = tableRef.current

		if (table == null)
			return

		// Unfocused widgets are hidden
		if (getComputedStyle(table).getPropertyValue('--focused') !== '1') {
			console.log(`CalendarTable '${cleanTitle}' isn't focused so won't animate`)
			return
		}

		const maxScroll = table.scrollHeight - table.clientHeight

		if (maxScroll <= 0) {
			console.log(`CalendarTable '${cleanTitle}' isn't tall enough to animate`)
			table.scrollTop = 0
			return
		}

		table.scrollTop = scroll(maxScroll, currentTime)

		animationId.current = requestAnimationFrame(animate);
	}, [scroll, cleanTitle])

	useEffect(() => {
		// Reset scroll on every render
		scrollBeginTime.current = null;

		animationId.current = requestAnimationFrame(animate)

		return () => {
			if (animationId.current != null)
				cancelAnimationFrame(animationId.current)
		}
	})

	return (
		<div className={`table-wrapper caltab-${cleanTitle}`}>
			<table ref={tableRef}>
				<thead>
					<tr>
						<th colSpan={2}>{title}</th>
					</tr>
				</thead>
				<tbody data-caltab>
					{children}
				</tbody>
				{extras}
			</table>
		</div>
	)
}
