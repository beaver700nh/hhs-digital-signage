import type { WidgetRenderer } from '../WidgetWrapper'

import './PlaceholderWidget.css'

const PlaceholderWidget: WidgetRenderer = ({ promise: _ }) => {
	return (
		<h1 className="placeholder">Placeholder<br />Widget</h1>
	)
}

export default PlaceholderWidget
