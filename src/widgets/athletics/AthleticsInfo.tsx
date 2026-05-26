import 'material-symbols'
import { useEffect, useMemo, useRef } from 'react'

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
		<p className="match" data-homeAway={event.homeAway}>
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

export default function AthleticsInfo({ calendar }: { calendar: AthleticsCalendar }) {
	const tableRef = useRef<HTMLTableElement>(null)

	const easingFunction = useMemo(() => (t: number) => {
		const t2 = t * t
		return t2 / (2 * (t2 - t) + 1)
	}, [])

	const scrollSpeed = 40 // pixels per second
	const pauseDuration = 3000 // ms to pause at each end

	useEffect(() => {
		const table = tableRef.current
		if (!table) return

		let startTime: number | null = null

		const animate = (currentTime: number) => {
			startTime ??= currentTime

			const maxScroll = table.scrollHeight - table.clientHeight

			if (maxScroll <= 0) {
				table.scrollTop = 0
			}
			else {
				const scrollDuration = maxScroll / scrollSpeed * 1000
				const cycleDuration = scrollDuration * 2 + pauseDuration * 2

				const elapsed = currentTime - startTime
				const phaseElapsed = elapsed % cycleDuration

				if (elapsed >= cycleDuration) {
					startTime = currentTime - phaseElapsed
					return
				}

				let scrollPosition: number

				if (phaseElapsed < pauseDuration) {
					scrollPosition = 0
				}
				else if (phaseElapsed < pauseDuration + scrollDuration) {
					const scrollProgress = (phaseElapsed - pauseDuration) / scrollDuration
					const eased = easingFunction(scrollProgress)
					scrollPosition = maxScroll * eased
				}
				else if (phaseElapsed < pauseDuration * 2 + scrollDuration) {
					scrollPosition = maxScroll
				}
				else {
					const scrollProgress = (phaseElapsed - pauseDuration * 2 - scrollDuration) / scrollDuration
					const eased = easingFunction(scrollProgress)
					scrollPosition = maxScroll * (1 - eased)
				}

				table.scrollTop = scrollPosition
			}

			requestAnimationFrame(animate)
		}

		const animationFrameId = requestAnimationFrame(animate)

		return () => cancelAnimationFrame(animationFrameId)
	}, [easingFunction])

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
