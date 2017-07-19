import * as d3 from 'd3'

let zoom = d3.zoom()
  .scaleExtent([0.5, 8])
export function bindingZoom(svg) {
  zoom.on('zoom', zoomed)
  svg.call(zoom)
    .on('wheel.zoom', null)
}
export function zoomClick(svgElement, type) {
  let g = svgElement.select('.graph-g')
  const scale = type === 'zoom_in' ? 2 : 0.5
  zoom.scaleBy(g, scale)
  let transform = d3.zoomTransform(g.node())
  svgElement.transition()
    .duration(750)
    .call(zoom.transform, transform)
}

export function zoomReset(svg) {
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity)
}

function zoomed() {
  let g = d3.select(this).select('.graph-g')
  console.log(d3.event.transform)
  g.attr("transform", d3.event.transform)
  zoom.transform(g, d3.event.transform)
}
