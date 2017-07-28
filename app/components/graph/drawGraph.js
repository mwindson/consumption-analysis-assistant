import * as d3 from 'd3'
import { fromJS } from 'immutable'
import 'style/graph.styl'

let nodes
let node
let links
let link
let force
let hoverLinks
let text

// 绘图函数
export function drawGraph(svg, nodeData, linkData, centerId, nodeClick, type) {
  const width = svg.style('width').replace('px', '')
  const height = svg.style('height').replace('px', '')
  const scale = d3.scaleLinear()
    .domain([0, 1])
    .range([200, 0])
  force = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(d => scale(d.score)))
    .force('charge', d3.forceManyBody().strength(-1000).distanceMin(50).distanceMax(200))
    .force('collide', d3.forceCollide().radius(60))
    .force('center', d3.forceCenter(width / 2, height / 2))
  links = svg
    .select('.line-group')
    .selectAll('.line')
    .data(linkData.toJS())
    .enter()
  drawNodes(svg, nodeData)
  updateNodes(svg, nodeData, linkData, centerId, nodeClick, type)
  drawLines(centerId, type)
  restart()
}

function drawNodes(svg, nodeData) {
  const nodeColor = {
    Brand: 'url(#brandGradient)',
    Company: 'url(#companyGradient)',
    Person: 'url(#personGradient)',
  }
  if (nodes) nodes.remove()
  nodes = svg
    .select('.node-group')
    .selectAll('.node')
    .data(nodeData.toJS())
  nodes = nodes.enter()
    .append('g')
    .attr('class', 'node')
    .attr('id', d => d.id)
  nodes
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 40)
    .attr('fill', d => nodeColor[d.type])
  nodes
    .append('text')
    .attr('text-anchor', 'middle')
    .text('')
}

export function drawLines(centerId, type, first = true) {
  // 显示A和B1的连线
  if (link) {
    link.remove()
    if (type === 'all') {
      if (first) {
        link = links
          .filter(d => d.score === 1 && d.source === centerId)
          .append('line')
      } else {
        link = links
          .filter(d => d.score === 1 && d.source.id === centerId)
          .append('line')
      }
    } else {
      link = links
        .filter(d => d.source.id === centerId && d.target.type === type)
        .append('line')
    }
  } else {
    link = links
      .filter(d => d.score === 1 && d.source === centerId)
      .append('line')
  }
  link.attr('class', 'line-show')
    .attr('stroke', '#fff')
    .attr('opacity', 0.5)
    .attr('stroke-width', 3)
}

export function updateNodes(svg, nodeData, linkData, centerId, nodeClick, type) {
  // 隐藏C类
  nodes
    .attr('class', 'node-hidden')
    .attr('type', 'C')
    .attr('opacity', 0.3)
  // 隐藏B2类
  nodes.filter(d => linkData.filter(x => x.get('score') !== 1 && x.get('source') === centerId
    && x.get('target') === d.id).size !== 0)
    .attr('class', 'node-hidden')
    .attr('type', 'B2')
    .attr('opacity', 0.3)
  // 更新当前中心点的A类
  nodes.filter(d => d.id === centerId)
    .attr('type', 'A')
    .attr('fill', '#4AF7FF')
    .attr('class', 'node-show')
    .attr('opacity', 1)
    .selectAll('circle')
    .attr('r', 50)
  // 更新当前中心点的B1类
  if (type === 'all') {
    nodes.filter(d => linkData.filter(x => x.get('score') === 1 && x.get('source') === centerId
      && x.get('target') === d.id).size !== 0)
      .attr('type', 'B1')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', 50)
  } else {
    nodes.filter(d => linkData.filter(x => x.get('source') === centerId && x.get('target') === d.id).size !== 0
      && d.type === type)
      .attr('type', 'B1')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', 50)
  }
  // 显示和删除文字
  d3.selectAll('.node-show')
    .selectAll('text')
    .text(d => d.name.length > 4 ? `${d.name.substr(0, 4)}...` : d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 14)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')
  d3.selectAll('.node-hidden')
    .selectAll('text')
    .text('')
  // 更新节点点击和拖动事件
  const tooltip = d3.select('.tooltip')
  nodes
    .filter(d => d.type === 'Brand')
    .attr('cursor', 'pointer')
    .on('click', () => {
      const id = d3.select(d3.event.target).datum().id
      hoverLinks.remove()
      if (id !== centerId) {
        nodeClick(id)
        // drawLines(id, 'all')
        // updateNodes(svg, nodeData, linkData, id, nodeClick, 'all')
        // restart()
      }
    })
  nodes.on('mouseover', () => {
    const n = d3.select(d3.event.target).datum()
    const id = n.id
    hoverOn(linkData, centerId, id)
    d3.select(d3.event.target)
      .classed('highlight', true)
    tooltip
      .style('left', `${n.x + 35}px`)
      .style('top', `${n.y - 70}px`)
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

// todo 不同类型的节点hover时情况不一
function hoverOn(linkData, centerId, currentId) {
  // 透明现有线段和点
  d3.selectAll('.line-show')
    .attr('opacity', 0)
  d3.selectAll('.node-show')
    .attr('opacity', 0.3)
  const hoverNode = nodes.filter(d => d.id === currentId)
  // A类实体，Hover上去时高亮和B1的连线。
  // B1类实体，Hover上去时高亮和A的连线，以及显示和C1的连线。
  // B2以及其他类实体，默认不显示和A的连线，Hover时会显示在当前视角里，和它有关系的第一类实体的连线。
  let relatedNode
  if (hoverNode.attr('type') === 'A') {
    link.filter(d => d.source.id === centerId && d.score === 1)
      .attr('opacity', 1)
    relatedNode = nodes
      .filter(d => d.id === currentId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
        && x.get('score') === 1)).size !== 0)
  } else if (hoverNode.attr('type') === 'B1') {
    link.filter(d => d.source.id === centerId && d.target.id === currentId)
      .attr('opacity', 1)
    hoverLinks = links
      .filter(d => (d.source.id === currentId && d.score === 1) || (d.target.id === currentId && d.source.id === centerId))
      .append('line')
      .attr('class', 'line-hover')
      .attr('stroke', '#fff')
      .attr('opacity', 1)
      .attr('stroke-width', 3)
    relatedNode = nodes
      .filter(d => d.id === currentId || d.id === centerId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
        && x.get('score') === 1)).size !== 0)
  } else {
    hoverLinks = links
      .filter(d => d.source.id === currentId && d.score === 1)
      .append('line')
      .attr('class', 'line-hover')
      .attr('stroke', '#fff')
      .attr('opacity', 1)
      .attr('stroke-width', 3)
    relatedNode = nodes
      .filter(d => d.id === currentId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
        && x.get('score') === 1)).size !== 0)
  }
  // 显示相关联的节点
  relatedNode
    .attr('opacity', 1)
    .selectAll('text')
    .text(d => d.name.length > 4 ? `${d.name.substr(0, 4)}...` : d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 14)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')
  // 绘制临时连接线
  if (hoverLinks) {
    hoverLinks.attr('x1', (d) => {
      const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
      return d.source.x + xDistance
    })
      .attr('y1', (d) => {
        const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
        return d.source.y + yDistance
      })
      .attr('x2', (d) => {
        const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
        const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
        return d.target.x - xDistance
      })
      .attr('y2', (d) => {
        const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
        return d.target.y - yDistance
      })
  }
}

function hoverLeave() {
  // 恢复现有线段和点
  d3.selectAll('.line-show')
    .attr('opacity', 0.5)
  d3.selectAll('.node-show')
    .attr('opacity', 1)
  d3.selectAll('.node-hidden')
    .attr('opacity', 0.3)
    .selectAll('text')
    .text('')
  // 删除hover时临时显示的线
  hoverLinks.remove()
}

// 计算和处理函数
function tick() {
  nodes.attr('transform', d => `translate(${d.x}, ${d.y})`)

  link
    .attr('x1', (d) => {
      const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
      return d.source.x + xDistance
    })
    .attr('y1', (d) => {
      const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
      return d.source.y + yDistance
    })
    .attr('x2', (d) => {
      const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
      return d.target.x - xDistance
    })
    .attr('y2', (d) => {
      const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
      const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
      return d.target.y - yDistance
    })
  if (hoverLinks) {
    hoverLinks.attr('x1', (d) => {
      const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
      const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
      return d.source.x + xDistance
    })
      .attr('y1', (d) => {
        const r = nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
        return d.source.y + yDistance
      })
      .attr('x2', (d) => {
        const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
        const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
        return d.target.x - xDistance
      })
      .attr('y2', (d) => {
        const r = nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
        const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
        return d.target.y - yDistance
      })
  }
}

function calDistance(source, target) {
  return Math.sqrt(((target.y - source.y) * (target.y - source.y)) + ((target.x - source.x) * (target.x - source.x)))
}

export function restart() {
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
