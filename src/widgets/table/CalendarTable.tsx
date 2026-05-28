import { useEffect, useRef, type PropsWithChildren } from 'react'

import { lookupConfiguration } from '@/data/api'

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
}: PropsWithChildren<{
	title: string
}>) {
	console.info(`CalendarTable '${title}' rendered`)

	const tableRef = useRef<HTMLTableElement>(null)
	const scrollBeginTime = useRef<number>(null)
	const animationId = useRef<number>(null)

	const scrollSpeed = lookupConfiguration('calendarScrollSpeed')
	const pauseDuration = lookupConfiguration('calendarScrollPause')

	useEffect(() => {
		// Will not recalculate if the table changes height but
		// it shouldn't change height between renders anyways
		(function animate(currentTime?: number) {
			const table = tableRef.current
			if (!table) return

			(() => {
				if (currentTime == null)
					return

				scrollBeginTime.current ??= currentTime;

				const tableStyle = getComputedStyle(table)

				// TODO fix because opacity is always 1 for some reason
				// Unfocused widgets are hidden
				if (tableStyle.opacity === '0') {
					console.info('CalendarTable skipping animation because not focused')
					return
				}

				const maxScroll = table.scrollHeight - table.clientHeight
					+ parseFloat(tableStyle.marginBlockStart);

				if (maxScroll <= 0) {
					table.scrollTop = 0
					return
				}

				const scrollDuration = maxScroll / scrollSpeed * 1000
				const cycleDuration = scrollDuration * 2 + pauseDuration * 2

				const elapsed = currentTime - scrollBeginTime.current
				const phaseElapsed = elapsed % cycleDuration

				if (elapsed >= cycleDuration) {
					scrollBeginTime.current = currentTime - phaseElapsed
					return
				}

				table.scrollTop = (() => {
					const cutoff = cycleDuration - scrollDuration

					return maxScroll * (
						phaseElapsed < cutoff
							? scrollEasing((phaseElapsed - pauseDuration) / scrollDuration)
							: 1 - scrollEasing((phaseElapsed - cutoff) / scrollDuration)
					)
				})()
			})()

			animationId.current = requestAnimationFrame(animate)
		})()

		return () => {
			if (animationId.current != null)
				cancelAnimationFrame(animationId.current)
		}
	}, [pauseDuration, scrollSpeed])

	return (
		<div className="table-wrapper">
			<table ref={tableRef}>
				<thead>
					<tr>
						<th colSpan={2}>{title}</th>
					</tr>
				</thead>
				<tbody data-caltab>
					{children}
				</tbody>
			</table>
		</div>
	)
}
