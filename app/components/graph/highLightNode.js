import * as d3 from 'd3'

export function setHighLight(id) {
  let node = d3.selectAll(`#${id}`)
    .attr('stroke', 'red')
    .attr('stroke-width', 5)
}

export function exitHighLight(id) {
  let node = d3.selectAll(`#${id}`)
    .attr('stroke', 'none')
    .attr('stroke-width', 'none')
}
