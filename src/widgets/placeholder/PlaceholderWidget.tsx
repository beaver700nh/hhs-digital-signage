import type { WidgetRenderer } from '../WidgetWrapper'

import './PlaceholderWidget.css'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PlaceholderWidget: WidgetRenderer = ({ promise: _ }) => {
	return (
		<h1 className="widget-placeholder">Placeholder<br />Widget</h1>
	)
}

export default PlaceholderWidget
