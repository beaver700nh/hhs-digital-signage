import * as Regex from './regex'
import type { NextDaySchedule } from './parser'

import CalendarTable from '../table/CalendarTable'
import Hiatus from './Hiatus'

export default function ScheduleInfo({ data }: { data: NextDaySchedule }) {
	const schedule = data.schedule!

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
			<CalendarTable title="Bell Schedule:" extras={
				<tfoot className="hiatus">
					<Hiatus hiatus={data.hiatus} />
				</tfoot>
			}>
				{schedule.data.map((line, index) =>
					<tr
						key={index}
						data-lunch={line.name.match(Regex.LUNCH_BLOCK)}
						data-class={line.name.match(Regex.CLASS_BLOCK)}
					>
						<th>{line.start} &ndash; {line.end}</th>
						<td>{line.name}</td>
					</tr>
				)}
			</CalendarTable>
		)
	}
}
