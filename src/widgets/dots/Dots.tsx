import { use } from 'react'

import ActiveWidgetContext from '@/widgets/ActiveWidgetContext'

import './Dots.css'

export default function Dots({ count }: {
	count: number
}) {
	const activeWidget = use(ActiveWidgetContext)

	return (
		<p className="carousel-dots">
			{Array.from({ length: count }).map((_, i) => (
				<span
					key={i}
					className={`dot ${i === activeWidget ? 'active' : ''}`}
				/>
			))}
		</p>
	)
}
