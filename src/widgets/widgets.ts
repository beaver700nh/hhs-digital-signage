import { lookupConfiguration } from '@/data/api'

import PlaceholderWidget from './placeholder/PlaceholderWidget'
import ScheduleWidget from './schedule/ScheduleWidget'
import LunchWidget from './lunch/LunchWidget'

const Widgets = [
	ScheduleWidget,
	LunchWidget,
	PlaceholderWidget,
]
	.filter((_, index) => !lookupConfiguration('disableWidgets')?.includes(index))

export default Widgets

export function nextWidget(current: number) {
	return (current + 1) % Widgets.length
}

export function prevWidget(current: number) {
	return (current - 1 + Widgets.length) % Widgets.length
}
