import * as d3 from 'd3'
import { restart } from 'components/graph/drawGraph'

export function zoomClick(svg, zoom, type) {
  const g = svg.select('.graph-g')
  const k = type === 'zoom_in' ? 2 : 0.5
  // const width = svg.style('width').replace('px', '')
  // const height = svg.style('height').replace('px', '')
  zoom.scaleBy(svg, k)
  // const transform = d3.zoomTransform(svg.node()).translate(type === 'zoom_in' ? -width / 2 : width / 2,
  //   type === 'zoom_in' ? -height / 2 : height / 2).scale(k)
  // svg.transition()
  //   .duration(750)
  // .call(zoom.transform, transform)
}

export function zoomReset(svg, zoom, centerId) {
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity)
  restart(centerId)
  // zoom.scaleTo(svg.select('.graph-g'), 1)
}
