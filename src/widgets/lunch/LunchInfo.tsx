import { DATE_FORMATS } from '@/data/api'
import type { DayLunch } from './parser'
import CalendarTable from '../table/CalendarTable'

export default function LunchInfo({ lunches }: { lunches: DayLunch[] }) {
	return (
		<CalendarTable title="Upcoming Lunch:">
			{lunches.map((day, index) =>
				<tr
					key={index}
					data-vegetarian={day.isVegetarian}
				>
					<th scope="row">
						{index === 0 ?
							day.when.calendar(DATE_FORMATS) :
							day.when.format('MMM Do')}
					</th>
					<td>
						<span className="name">{day.name}</span>
						<ul className="sides">
							{day.sides.map((side, index) =>
								<li key={index}>{side}</li>
							)}
						</ul>
					</td>
				</tr>
			)}
		</CalendarTable>
	)
}
