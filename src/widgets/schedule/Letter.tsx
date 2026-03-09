import type { NextDaySchedule } from "./parser"

export default function Letter({ what }:
	Pick<NextDaySchedule & { exists: true }, 'what'>
) {
	return (
		<svg viewBox="0 0 18 18" className="letter-box">
			<text
				x="50%" y="50%"
				textAnchor="middle"
				dominantBaseline="central"
				fontSize="100%"
				fill="currentColor"
				className="letter"
			>
				{what.letter ?? "?"}
			</text>
			<text
				x="100%" y="0%"
				textAnchor="end"
				dominantBaseline="hanging"
				fontSize="48%"
				fill="currentColor"
				className="letter-star"
			>
				{what.type === 'special' ? <>&#x2605;</> : null}
			</text>
		</svg>
	)
}
