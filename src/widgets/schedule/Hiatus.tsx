import type { NextDaySchedule } from "./parser"

export default function Hiatus({ hiatus }:
	Pick<NextDaySchedule, 'hiatus'>
) {
	if (hiatus == null)
		return null

	if (hiatus.weekend === 'summer') {
		return (
			<p className="hiatus">Have a great summer!</p>
		)
	}

	// One of these will be true, otherwise hiatus would've been null
	const wishes = [
		hiatus.weekend ? 'have a good weekend' : null,
		hiatus.names.length > 0 ? 'enjoy your time off' : null,
	]
		.filter(Boolean)
		.join(' and ')

	return (
		<div className="hiatus">
			<p className="wishes">{wishes.charAt(0).toUpperCase() + wishes.slice(1)}!</p>
			<ul>
				{hiatus.names.map((item, index) => <li key={index}>{item}</li>)}
			</ul>
		</div>
	)
}
