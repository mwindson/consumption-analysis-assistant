import * as d3 from 'd3'
import { fromJS } from 'immutable'
import 'style/graph.styl'

let nodes
let links
let link
let force
let hoverLinks

// 绘图函数
export function drawGraph(svg, nodeData, linkData, centerId, nodeClick) {
  const width = svg.style('width').replace('px', '')
  const height = svg.style('height').replace('px', '')
  force = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(d => d.distance))
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('collide', d3.forceCollide().radius(50))
    .force('center', d3.forceCenter(width / 2, height / 2))
  links = svg
    .select('.line-group')
    .selectAll('.line')
    .data(linkData.toJS())
    .enter()
  drawNodes(svg, nodeData)
  updateNodes(svg, nodeData, linkData, centerId, nodeClick)
  drawLines(centerId)
  restart(nodeData, linkData)
  svg.select('.graph-g')
    .transition()
    .duration(1000)
    .attr('opacity', 1)
}

function drawNodes(svg, nodeData) {
  nodes = svg
    .select('.node-group')
    .selectAll('.node')
    .data(nodeData.toJS())
  nodes = nodes.enter()
    .append('g')
    .attr('class', 'node')
    .attr('id', d => `node_${d.id}`)
  nodes
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#brandGradient)')
}

function drawLines(centerId) {
  // 显示A和B1的连线
  if (link) {
    link.remove()
    link = links
      .filter(d => d.distance === 100 && (d.source.id === centerId || d.target.id === centerId))
      .append('line')
  } else {
    link = links
      .filter(d => d.distance === 100 && (d.source === centerId || d.target === centerId))
      .append('line')
  }
  link.attr('class', 'line-show')
    .attr('stroke', 'rgba(255,255,255,0.5)')
    .attr('stroke-width', 3)
}

function updateNodes(svg, nodeData, linkData, centerId, nodeClick) {
  // 隐藏B2类
  nodes
    .attr('class', 'node-hidden')
    .attr('type', 'B2')
    .classed('hidden', true)
  // 显示当前中心点的A类和B1类的点
  nodes.filter(d => d.id === centerId)
    .attr('type', 'A')
    .attr('class', 'node-show')
    .classed('hidden', false)
  nodes.filter(d => linkData.filter(x => x.get('distance') === 100 && ((x.get('source') === centerId
    && x.get('target') === d.id) || (x.get('target') === centerId
    && x.get('source') === d.id))).size !== 0)
    .attr('type', 'B1')
    .attr('class', 'node-show')
    .classed('hidden', false)
  // 显示和删除文字
  d3.selectAll('.node-show')
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 18)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')
  d3.selectAll('.node-hidden')
    .selectAll('text')
    .remove()
  // 更新节点点击和拖动事件
  const tooltip = d3.select('.tooltip')
  nodes.on('click', () => {
    const id = d3.select(d3.event.target).datum().id
    if (id !== centerId) {
      nodeClick(id)
      drawLines(id)
      updateNodes(svg, nodeData, linkData, id, nodeClick)
      restart()
    }
  })
    .on('mouseover', () => {
      const node = d3.select(d3.event.target).datum()
      const id = node.id
      hoverOn(linkData, centerId, id)
      d3.select(d3.event.target)
        .classed('highlight', true)
      tooltip
        .style('left', `${node.x + 35}px`)
        .style('top', `${node.y - 70}px`)
        .transition().duration(500)
        .style('opacity', 0.8)
    })
    .on('mouseout', () => {
      hoverLeave()
      d3.select(d3.event.target)
        .classed('highlight', false)
      tooltip.transition().duration(100).style('opacity', 0)
    })
  nodes.call(d3.drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd))
}

function hoverOn(linkData, centerId, currentId) {
  // 透明现有线段和点
  d3.selectAll('.line-show')
    .classed('hidden', true)
  d3.selectAll('.node-show')
    .classed('hover', false)
    .classed('hidden', true)
  // 显示相关联的节点
  nodes
    .filter(d => d.id === currentId || linkData.filter(x => x.get('target') === d.id && x.get('source') === currentId).size !== 0)
    .classed('hidden', false)
    .classed('hover', true)
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 18)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')
  // 绘制临时连接线
  hoverLinks = links
    .filter(d => d.source.id === currentId || d.target.id === currentId)
    .append('line')
    .attr('class', 'line-hover')
    .attr('stroke', 'rgba(255,255,255,0.5)')
    .attr('stroke-width', 3)
  hoverLinks.attr('x1', (d) => {
    const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
    return d.source.x + xDistance
  })
    .attr('y1', (d) => {
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
      return d.source.y + yDistance
    })
    .attr('x2', (d) => {
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
      return d.target.x - xDistance
    })
    .attr('y2', (d) => {
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
      return d.target.y - yDistance
    })
}

function hoverLeave() {
  // 恢复现有线段和点
  d3.selectAll('.line-show')
    .classed('hidden', false)
  d3.selectAll('.node-show')
    .classed('hover', true)
    .classed('hidden', false)
  d3.selectAll('.node-hidden')
    .classed('hover', false)
    .classed('hidden', true)
    .selectAll('text')
    .remove()
  // 删除hover时临时显示的线
  hoverLinks.remove()
}

// 计算和处理函数
function tick() {
  nodes.attr('transform', d => `translate(${d.x}, ${d.y})`)

  link
    .attr('x1', (d) => {
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
      return d.source.x + xDistance
    })
    .attr('y1', (d) => {
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
      return d.source.y + yDistance
    })
    .attr('x2', (d) => {
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
      return d.target.x - xDistance
    })
    .attr('y2', (d) => {
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
      return d.target.y - yDistance
    })
  if (hoverLinks) {
    hoverLinks.attr('x1', (d) => {
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
      return d.source.x + xDistance
    })
      .attr('y1', (d) => {
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
        return d.source.y + yDistance
      })
      .attr('x2', (d) => {
        const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * 37
        return d.target.x - xDistance
      })
      .attr('y2', (d) => {
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * 37
        return d.target.y - yDistance
      })
  }
}

function calDistance(source, target) {
  return Math.sqrt(((target.y - source.y) * (target.y - source.y)) + ((target.x - source.x) * (target.x - source.x)))
}

function restart() {
  force.nodes(nodes.data()).on('tick', tick)
  force.force('link').links(links.data())
  force.alpha(0.3).restart()
}

function dragStart(d) {
  if (!d3.event.active) force.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragEnd(d) {
  if (!d3.event.active) force.alphaTarget(0)
  d.fx = null
  d.fy = null
}
