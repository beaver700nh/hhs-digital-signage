import { lookupConfiguration } from '@/data/api'

import PlaceholderWidget from './placeholder/PlaceholderWidget'
import ScheduleWidget from './schedule/ScheduleWidget'
import TestWidget2 from './test2/TestWidget2'

const Widgets = [
	ScheduleWidget,
	TestWidget2,
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
