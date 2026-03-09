import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

import './index.css'

import moment from 'moment'

moment.calendarFormat = (then, now) => {
	const then_ = then.clone().startOf('day')
	const now_ = now.clone().startOf('day')

	const diff = then_.diff(now_, 'days')
	const nowWeekday = now_.isoWeekday() - 1
	const diffWeekday = nowWeekday + diff

	return (
		diff === 0 ? 'sameDay' :
		diff === 1 ? 'nextDay' :
		diff === -1 ? 'lastDay' :
		(-7 <= diffWeekday && diffWeekday <  0) ? 'lastWeek' :
		( 0 <= diffWeekday && diffWeekday <  7) ?
			// Sunday is last week from Wednesday on
			// Saturday is next week until Wednesday
			(diffWeekday === 0 && nowWeekday >= 3) ? 'lastWeek' :
			(diffWeekday === 6 && nowWeekday <= 3) ? 'nextWeek' : 'thisWeek' :
		( 7 <= diffWeekday && diffWeekday < 14) ? 'nextWeek' :
		'sameElse'
	)
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
