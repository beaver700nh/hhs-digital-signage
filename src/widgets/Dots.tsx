import { useContext } from 'react'

import { ActiveWidgetContext } from '@/Carousel'

import './Dots.css'

export default function Dots({ count }: {
	count: number
}) {
	const activeWidget = useContext(ActiveWidgetContext)

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
