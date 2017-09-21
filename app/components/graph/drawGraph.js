import * as d3 from 'd3'
import 'style/graph.styl'

let nodes
let links
let link
let force
let hoverLinks
let width
let height

const chosenNodeColor = {
  Brand: '#4AF7FF',
  Company: '#F1D237',
  Person: '#2095FF',
  empty: '#4AF7FF',
  Product: '#EA8484',
}

const nodeColor = {
  empty: 'url(#brandGradient)',
  Brand: 'url(#brandGradient)',
  Company: 'url(#companyGradient)',
  Person: 'url(#personGradient)',
  Product: 'url(#productGradient)',
}

// 绘图函数
export function drawGraph(svg, nodeData, linkData, centerId, nodeClick, type, firstLoad) {
  width = svg.style('width').replace('px', '')
  height = svg.style('height').replace('px', '')
  force = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(d => d.source.id === centerId ? 100 : 500))
    .force('charge', d3.forceManyBody())
    .force('collide', d3.forceCollide().radius(50))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
  links = svg
    .select('.line-group')
    .selectAll('.line')
    .data(linkData.toJS())
    .enter()
  drawNodes(svg, nodeData)
  updateNodes(svg, nodeData, linkData, centerId, nodeClick, type)
  drawLines(centerId, type, firstLoad)
  restart(centerId)
}

function drawNodes(svg, nodeData) {
  if (nodes) nodes.remove()
  if (hoverLinks) hoverLinks.remove()
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
    .attr('fill', d => nodeColor[d.type])
    .attr('stroke-width', '3')
  nodes
    .append('g')
    .attr('clip-path', 'url(#textClip)')
    .append('text')
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
  nodes
    .attr('class', 'node-hidden')
    .attr('type', 'D')
    .attr('opacity', 0.8)
    .attr('r', 40)
  // 隐藏C类
  nodes
    .filter(d => d.type !== 'empty')
    .attr('class', 'node-hidden')
    .attr('type', 'C')
    .attr('opacity', 0.5)
    .selectAll('circle')
    .attr('stroke', '#E88485')
    .attr('stroke-width', 5)
    .attr('r', 40)
  // 隐藏B2类
  nodes.filter(d => linkData.filter(x => x.get('score') !== 1 && x.get('source') === centerId
    && x.get('target') === d.id).size !== 0)
    .attr('class', 'node-hidden')
    .attr('type', 'B2')
    .attr('opacity', 0.5)
    .selectAll('circle')
    .attr('stroke', '#2496FD')
    .attr('stroke-width', 5)
    .attr('r', 40)
  // 更新当前中心点的A类
  nodes.filter(d => d.id === centerId)
    .attr('type', 'A')
    .attr('class', 'node-show')
    .attr('opacity', 1)
    .selectAll('circle')
    .attr('r', 50)
    .attr('fill', d => chosenNodeColor[d.type])
    .attr('stroke', '#4AF7FF')
    .attr('stroke-width', 5)
  // 更新当前中心点的B1类
  if (type === 'all') {
    nodes.filter(d => linkData.filter(x => x.get('score') === 1 && x.get('source') === centerId
      && x.get('target') === d.id).size !== 0)
      .attr('type', 'B1')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', 50)
      .attr('stroke', 'white')
      .attr('stroke-width', 5)
  } else {
    nodes.filter(d => linkData.filter(x => x.get('source') === centerId && x.get('target') === d.id).size !== 0
      && d.type === type)
      .attr('type', 'B1')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', 50)
      .attr('stroke', 'white')
      .attr('stroke-width', 5)
  }
  // 显示和删除文字
  d3.selectAll('.node-show')
    .selectAll('text')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', d => d.id === centerId ? 20 : 14)
    .attr('font-weight', d => d.id === centerId ? 'bold' : 'null')
    .attr('fill', '#125091')
    .each(function () {
      const textWidth = d3.select(this).node().getBBox().width
      d3.select(this).attr('transform', `translate(${textWidth <= 90 ? -textWidth / 2 : -45},7)`)
    })

  d3.selectAll('.node-hidden')
    .selectAll('text')
    .text('')
// 更新节点点击和拖动事件
  const tooltip = d3.select('.tooltip')
  nodes
    .attr('cursor', 'pointer')
    .on('click', () => {
      const id = d3.select(d3.event.target).datum().id
      force.stop()
      // 移除文字动画
      d3.selectAll('animateTransform').remove()
      if (hoverLinks) hoverLinks.remove()
      hoverLinks = null
      if (id !== centerId) {
        const nodeType = d3.select(d3.event.target).datum().type
        nodeClick(id, nodeType)
      }
    })
  nodes
    .filter(d => d.type !== 'empty')
    .on('mouseover', () => {
      const n = d3.select(d3.event.target).datum()
      const id = n.id
      hoverOn(linkData, centerId, id)
      d3.select(d3.event.target)
        .classed('highlight', true)
      tooltip
        .html(`<p>${n.name}</p>`)
        .style('left', `${n.x + 60}px`)
        .style('top', `${n.y - 70}px`)
        .transition()
        .duration(500)
        .style('opacity', 0.8)
    })
    .on('mouseout', () => {
      hoverLeave()
      d3.select(d3.event.target)
        .classed('highlight', false)
      tooltip.transition().duration(100).style('opacity', 0)
    })
  nodes
    .filter(d => d.type !== 'empty')
    .call(d3.drag()
      .on('start', dragStart)
      .on('drag', dragged)
      .on('end', dragEnd))
}

function hoverOn(linkData, centerId, currentId) {
  // 透明现有线段和点
  d3.selectAll('.line-show')
    .attr('opacity', 0)
  d3.selectAll('.node-show')
    .attr('opacity', 0.5)
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
  } else if (hoverNode.attr('type') === 'B1' || hoverNode.attr('type') === 'B2') {
    link.filter(d => (d.source.id === centerId && d.target.id === currentId) || (d.source.id === currentId && d.target.id === centerId))
      .attr('opacity', 1)
    hoverLinks = links
      .filter(d => (d.source.id === currentId && d.score === 1) || (d.target.id === currentId && d.source.id === centerId))
      .append('line')
      .attr('class', 'line-hover')
      .attr('stroke', '#fff')
      .attr('opacity', 1)
      .attr('stroke-width', 3)
    relatedNode = nodes
      .filter(d => d.id === currentId
        || d.id === centerId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
          && x.get('score') === 1)).size !== 0)
    // || !hoverLinks.filter(x => x.source.id === d.id || x.target.id === d.id).empty())
  } else {
    hoverLinks = links
      .filter(d => (d.source.id === currentId && d.score === 1) || isLink(d, linkData, currentId, centerId))
      .append('line')
      .attr('class', 'line-hover')
      .attr('stroke', '#fff')
      .attr('opacity', 1)
      .attr('stroke-width', 3)
    relatedNode = nodes
      .filter(d => d.id === currentId || !hoverLinks.filter(x => x.source.id === d.id || x.target.id === d.id).empty())
  }
  // 显示相关联的节点
  relatedNode
    .attr('opacity', 1)
    .selectAll('text')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', d => d.id === centerId ? 20 : 14)
    .attr('font-weight', d => d.id === centerId ? 'bold' : 'null')
    .attr('fill', '#125091')
    .each(function () {
      const textWidth = d3.select(this).node().getBBox().width
      d3.select(this).attr('transform', `translate(${textWidth <= 90 ? -textWidth / 2 : -45},7)`)
    })
  relatedNode
    .filter(d => d.id === currentId)
    .selectAll('text')
    .each(function () {
      const textWidth = d3.select(this).node().getBBox().width
      if (textWidth > 90) {
        d3.select(this)
          .append('animateTransform')
          .attr('attributeName', 'transform')
          .attr('type', 'translate')
          .attr('from', '45 7')
          .attr('to', `${-textWidth - 45} 7`)
          .attr('dur', `${textWidth / 40}`)
          .attr('repeatCount', 'indefinite')
      }
    })
  relatedNode
    .selectAll('circle')
    .transition()
    .duration(500)
    .attr('r', 50)
    .attr('fill', d => chosenNodeColor[d.type])
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
    .selectAll('circle')
    .attr('fill', d => nodeColor[d.type])
  d3.selectAll('[type=A]')
    .selectAll('circle')
    .attr('fill', d => chosenNodeColor[d.type])
  d3.selectAll('.node-hidden')
    .attr('opacity', 0.5)
    .selectAll('text')
    .text('')
  d3.selectAll('.node-hidden')
    .attr('opacity', 0.5)
    .selectAll('circle')
    .transition(500)
    .duration(500)
    .attr('r', 40)
    .attr('fill', d => nodeColor[d.type])
  // 移除文字动画
  d3.selectAll('animateTransform').remove()
  // 删除hover时临时显示的线
  if (hoverLinks && !hoverLinks.empty()) {
    hoverLinks.remove()
    // 将hoverLinks的数据清空
    hoverLinks = null
  }
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

export function restart(centerId) {
  force.nodes(nodes.data()).on('tick', tick)
  force.force('link').links(links.data())
  force.alpha(0.3).restart()
  setTimeout(() => {
    const centerNode = nodes.filter(d => d.id === centerId).datum()
    d3.select('.graph-g').transition().duration(1000)
      .attr('transform', `translate(${(width / 2) - centerNode.x},${(height / 2) - centerNode.y})`)
  }, 1000)
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

function isLink(d, linkData, currentId, centerId) {
  return (d.source.id === centerId && linkData.filter(x => x.get('source') === d.target.id && x.get('target') === currentId).size !== 0)
    || (d.source.id === currentId && linkData.filter(x => x.get('source') === d.target.id && x.get('target') === centerId).size !== 0)
    || (d.target.id === currentId && linkData.filter(x => x.get('target') === d.source.id && x.get('source') === centerId).size !== 0)
    || (d.target.id === centerId && linkData.filter(x => x.get('target') === d.source.id && x.get('source') === currentId).size !== 0)
}
