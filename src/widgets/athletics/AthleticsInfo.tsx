import 'material-symbols'
import { useEffect, useRef } from 'react'

import { lookupConfiguration } from '@/data/api'
import type { AthleticsCalendar, AthleticsEvent } from './parser'

function Event({ event }: { event: Omit<AthleticsEvent, 'when'> }) {
	const summary = (
		<p className="summary">
			{event.level != null && <>
				<span className="level">{event.level}</span>
				&#32;
			</>}
			<span className="sport">{event.sport}</span>
		</p>
	)

	const match = event.opponent != null && (
		<p className="match">
			{event.homeAway != null && <>
				<span className="home-away material-symbols-rounded">
					{event.homeAway === 'home' ? 'family_home' : 'airport_shuttle'}
				</span>
				&#32;
				<span className="home-away">
					{event.homeAway === 'home' ? 'vs' : 'at'}
				</span>
				&#32;
			</>}
			<span className="opponent">{event.opponent}</span>
		</p>
	)

	const location = event.location.site != null && (
		<p className="location">
			<span className="site material-symbols-rounded">pin_drop</span>
			&#32;
			<span className="site">{
				[event.location.site, event.location.subsite]
					.filter(Boolean)
					.join(' \u2013 ')
			}</span>
		</p>
	)

	return (
		<div className="event">
			{summary}
			{match}
			{location}
		</div>
	)
}

function scrollEasing(t: number) {
	if (t < 0) return 0
	if (t > 1) return 1

	const t2 = t * t
	return 3 * t2 - 2 * t2*t
}

export default function AthleticsInfo({ calendar }: { calendar: AthleticsCalendar }) {
	const tableRef = useRef<HTMLTableElement>(null)
	const scrollBeginTime = useRef<number>(null)
	const animationId = useRef<number>(null)

	const scrollSpeed = lookupConfiguration('athleticsScrollSpeed')
	const pauseDuration = lookupConfiguration('athleticsPauseDuration')

	useEffect(() => {
		const table = tableRef.current
		if (!table) return

		const tableStyle = getComputedStyle(table)
		const maxScroll = table.scrollHeight - table.clientHeight
			+ parseFloat(tableStyle.marginBlockStart);

		// Will not recalculate if table changes height but
		// it shouldn't change height between renders anyways
		(function animate(currentTime?: number) {
			(() => {
				if (currentTime == null)
					return

				scrollBeginTime.current ??= currentTime;

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
			<table className="athletics-calendar" ref={tableRef}>
				<thead className="title">
					<tr>
						<th colSpan={2}>Upcoming Sports Events:</th>
					</tr>
				</thead>
				<tbody className="calendar">
					{Object.entries(calendar).map(([id, { when, events }]) =>
						<tr
							key={id}
							className="time-slot"
						>
							<th className="when" scope="row">
								<p className="date">{when.format('MMM Do')}</p>
								<p className="time">{when.format('h:mma')}</p>
							</th>
							<td className="events">
								<ul>
									{events.map((event, index) =>
										<Event key={index} event={event} />
									)}
								</ul>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}
