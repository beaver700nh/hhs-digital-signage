import { lookupConfiguration } from '@/data/api'

// import PlaceholderWidget from './placeholder/PlaceholderWidget'
import ScheduleWidget from './schedule/ScheduleWidget'
import LunchWidget from './lunch/LunchWidget'
import AthleticsWidget from './athletics/AthleticsWidget'

const disabledWidgets = lookupConfiguration('disableWidgets')

const Widgets = [
	ScheduleWidget,
	LunchWidget,
	AthleticsWidget,
]
	.filter((_, index) => !disabledWidgets.includes(index))

export default Widgets

export function nextWidget(current: number) {
	return (current + 1) % Widgets.length
}

export function prevWidget(current: number) {
	return (current - 1 + Widgets.length) % Widgets.length
}
