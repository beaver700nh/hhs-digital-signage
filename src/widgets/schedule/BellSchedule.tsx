import * as Regex from './regex'
import type { BellSchedule } from './parser'

export default function BellSchedule({ schedule }: { schedule: BellSchedule }) {
	switch (schedule.type) {
	case 'none':
		return (
			<p className="bell-sched none">No bell schedule listed.</p>
		)
	case 'html':
		return (
			// eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
			<div className="bell-sched html" dangerouslySetInnerHTML={{ __html: schedule.data }} />
		)
	case 'text':
		return (
			<div className="bell-sched text">
				{schedule.data.map((line, i) => <p key={i}>{line}</p>)}
			</div>
		)
	case 'table':
		return (
			<table className="bell-sched table">
				<thead className="title">
					<tr>
						<th colSpan={2}>Bell Schedule:</th>
					</tr>
				</thead>
				<tbody>
					{schedule.data.map((line, index) =>
						<tr
							key={index}
							className="line"
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
