import type { NextDaySchedule } from "@/widgets/schedule/parser"

export default function Letter({ header }:
	Pick<NextDaySchedule & { exists: true }, 'header'>
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
				{header.letter ?? "?"}
			</text>
			<text
				x="100%" y="0%"
				textAnchor="end"
				dominantBaseline="hanging"
				fontSize="48%"
				fill="currentColor"
				className="letter-star"
			>
				{header.type === 'special' ? <>&#x2605;</> : null}
			</text>
		</svg>
	)
}
