import * as Regex from './regex'
import type { NextDaySchedule } from "./parser"

export default function BellSchedule({ what }:
	Pick<NextDaySchedule & { exists: true }, 'what'>
) {
	switch (what.schedule.type) {
	case 'none':
		return (
			<p className="bell-sched none">No bell schedule listed.</p>
		)
	case 'html':
		return (
			<div className="bell-sched html" dangerouslySetInnerHTML={{ __html: what.schedule.data }} />
		)
	case 'text':
		return (
			<div className="bell-sched text">
				{what.schedule.data.map((line, i) => <p key={i}>{line}</p>)}
			</div>
		)
	case 'table':
		return (
			<table className="bell-sched table">
				<tbody>
					{what.schedule.data.map((line, index) =>
						<tr
							key={index}
							className='line'
							data-lunch={line.name.match(Regex.LUNCH_BLOCK)}
						>
							<td>{line.start} &ndash; {line.end}</td>
							<td>{line.name}</td>
						</tr>
					)}
				</tbody>
			</table>
		)
	}
}
