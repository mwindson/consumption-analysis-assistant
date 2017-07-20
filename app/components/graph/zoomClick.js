import * as d3 from 'd3'

export function zoomClick(svg, zoom, type) {
  const g = svg.select('.graph-g')
  const scale = type === 'zoom_in' ? 2 : 0.5
  zoom.scaleBy(g, scale)
  const transform = d3.zoomTransform(g.node())
  svg.transition()
    .duration(750)
    .call(zoom.transform, transform)
}

export function zoomReset(svg, zoom) {
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity)
  zoom.scaleTo(svg.select('.graph-g'), 1)
}
