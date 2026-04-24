import { DATE_FORMATS } from '@/data/api'
import type { DayLunch } from './parser'

export default function LunchInfo({ lunches }: { lunches: DayLunch[] }) {
	return (
		<div className="table-wrapper">
			<table className="lunch-info">
				<thead className="title">
					<tr>
						<th colSpan={2}>Upcoming Lunch:</th>
					</tr>
				</thead>
				<tbody>
					{lunches.map((day, index) =>
						<tr
							key={index}
							className="day-lunch"
							data-vegetarian={day.isVegetarian}
						>
							<th className="day" scope="row">
								{index === 0 ?
									day.when.calendar(DATE_FORMATS) :
									day.when.format('MMM Do')}
							</th>
							<td className="content">
								<span className="name">{day.name}</span>
								<ul className="sides">
									{day.sides.map((side, index) =>
										<li key={index}>{side}</li>
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
