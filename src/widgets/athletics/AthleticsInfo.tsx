import 'material-symbols'

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
	return (
		<div className="table-wrapper">
			<table className="athletics-calendar">
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
