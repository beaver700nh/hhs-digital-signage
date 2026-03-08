import PlaceholderWidget from './placeholder/PlaceholderWidget'
import TestWidget from './test/TestWidget'
import TestWidget2 from './test2/TestWidget2'

const Widgets = [
	TestWidget,
	TestWidget2,
	PlaceholderWidget,
]

export default Widgets

export function nextWidget(current: number) {
	return (current + 1) % Widgets.length
}

export function prevWidget(current: number) {
	return (current - 1 + Widgets.length) % Widgets.length
}
