import DataFetcher from './widgets/DataFetcher'
import TestWidget from './widgets/test/TestWidget'
import TestWidget2 from './widgets/test2/TestWidget2'

import './Carousel.css'

export default function Carousel() {
	return (
		<article id="carousel">
			<DataFetcher RendererComponent={TestWidget} />
			<DataFetcher RendererComponent={TestWidget2} />
		</article>
	)
}
