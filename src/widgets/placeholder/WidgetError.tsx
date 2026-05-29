import './WidgetError.css'

export default function WidgetError({ message }: {
	message: string
}) {
	return (
		<div className="widget-error">
			<h1>Couldn't load widget</h1>
			<p>{message}</p>
			<p>Try refreshing the page, or contact support.</p>
		</div>
	)
}
