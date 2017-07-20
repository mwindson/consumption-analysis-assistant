import * as d3 from 'd3'
import { fromJS } from 'immutable'
import 'style/graph.styl'

let node,
  link,
  allLinks,
  tmpLink
let simulation
let graph,
  svg

export function drawGraph(nodeData, linkData, nodeId, lineClick, nodeClick, hasClicked) {
  svg = d3.select('.graph-svg')
  const width = svg.style('width').replace('px', '')
  const height = svg.style('height').replace('px', '')
  graph = svg.select('.graph-g')
    .attr('width', width)
    .attr('height', height)
  graph.attr('opacity', 0)
  // 清除已有的图形便于重画
  graph.selectAll('*').remove()
  // 设定力度图的参数
  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(100))
    // .force('charge', d3.forceManyBody().strength(-100))
    .force('collide', d3.forceCollide().radius(50))
    .force('center', d3.forceCenter(width / 2, height / 2))
  // .force('x', d3.forceX(width / 2))
  // .force('y', d3.forceY(height / 2))
  // 绑定线段数据
  allLinks = graph
    .append('g')
    .attr('class', 'line-group')
    .selectAll('.link')
    .data(linkData, d => d.target)

  // 绑定节点数据
  node = graph.selectAll('.node')
    .data(nodeData, d => d.id)
  node = node.enter()
    .append('g')
    .attr('class', 'node')
    .attr('id', d => `node_${d.id}`)
  node
    .filter(d => d.type === 'center')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#brandGradient)')
  node.filter(d => d.type === 'news')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#newsGradient)')
  node.filter(d => d.type === 'related_brand')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#storeTypeGradient)')
  node.filter(d => d.type === 'product')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#productGradient)')
  node.filter(d => d.type === 'store_type')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#storeTypeGradient)')
  node.filter(d => d.type === 'person')
    .append('circle')
    .attr('id', d => d.type)
    .attr('r', 37)
    .attr('fill', 'url(#personGradient)')

  // // 计算布局
  simulation.nodes(nodeData)
    .on('tick', tick)
  simulation.force('link').links(linkData)

  graph
    .transition()
    .duration(1000)
    .attr('opacity', 1)

  const newLinkData = fromJS(linkData).filter(ele => ele.get('source').get('id') === nodeId || ele.get('target').get('id') === nodeId)
  updateGraph(nodeData, linkData, newLinkData.toJS(), nodeId, lineClick)

  // 线段点击事件
  svg.on('click', () => {
    const selection = d3.select(d3.event.target)
    if (selection.attr('class') === 'line') {
      selection
        .attr('stroke', 'rgba(255,255,255,0.8)')
        .attr('stroke-width', d => d.strength + 3)
        .attr('clicked', true)
      lineClick(selection.datum().target.id, selection.datum().target.type)
    } else {
      d3.selectAll('.line')
        .attr('stroke', 'rgba(255,255,255,0.51)')
        .attr('stroke-width', d => d.strength)
        .attr('clicked', false)
      lineClick(0, 'center')
    }
  })

  // 节点点击和拖动事件
  node.on('click', () => {
    const id = d3.select(d3.event.target).datum().id
    if (hasClicked(id)) {
      nodeClick(id)
      const nextData = fromJS(linkData).filter(ele => ele.get('source').get('id') === id || ele.get('target').get('id') === id)
      updateGraph(nodeData, linkData, nextData.toJS(), nodeId, lineClick)
    }
  })
  node.call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended))
}

function tick() {
  node.attr('transform', d => `translate(${d.x}, ${d.y})`)

  link
    .attr('x1', (d) => {
      const distance = calDistance(d.source, d.target)
      const xDistance = ((d.target.x - d.source.x) / distance) * 37
      return d.source.x + xDistance
    })
    .attr('y1', (d) => {
      const distance = calDistance(d.source, d.target)
      const yDistance = ((d.target.y - d.source.y) / distance) * 37
      return d.source.y + yDistance
    })
    .attr('x2', (d) => {
      const distance = calDistance(d.source, d.target)
      const xDistance = ((d.target.x - d.source.x) / distance) * 37
      return d.target.x - xDistance
    })
    .attr('y2', (d) => {
      const distance = calDistance(d.source, d.target)
      const yDistance = ((d.target.y - d.source.y) / distance) * 37
      return d.target.y - yDistance
    })

  if (tmpLink !== undefined) {
    tmpLink
      .attr('x1', (d) => {
        const distance = calDistance(d.source, d.target)
        const xDistance = ((d.target.x - d.source.x) / distance) * 37
        return d.source.x + xDistance
      })
      .attr('y1', (d) => {
        const distance = calDistance(d.source, d.target)
        const yDistance = ((d.target.y - d.source.y) / distance) * 37
        return d.source.y + yDistance
      })
      .attr('x2', (d) => {
        const distance = calDistance(d.source, d.target)
        const xDistance = ((d.target.x - d.source.x) / distance) * 37
        return d.target.x - xDistance
      })
      .attr('y2', (d) => {
        const distance = calDistance(d.source, d.target)
        const yDistance = ((d.target.y - d.source.y) / distance) * 37
        return d.target.y - yDistance
      })
  }
}

function calDistance(source, target) {
  return Math.sqrt(
    ((target.y - source.y) * (target.y - source.y)) +
    ((target.x - source.x) * (target.x - source.x)),
  )
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0)
  d.fx = null
  d.fy = null
}

export function updateGraph(nodeData, linkData, currentData, nodeId) {
  // 隐藏不相关节点和文字
  node.filter(d => currentData.find(ele => ele.target.id === d.id || ele.source.id === d.id) === undefined)
    .selectAll('text')
    .remove()
  node.filter(d => currentData.find(ele => ele.target.id === d.id || ele.source.id === d.id) === undefined)
    .attr('class', 'node_hidden')
    .transition().duration(1000)
    .attr('opacity', 0.3)
  d3.select('.line-group').selectAll('*').remove()
  // 显示相关节点
  node.filter(d => currentData.find(ele => ele.target.id === d.id || ele.source.id === d.id) !== undefined)
    .attr('class', 'node')
    .transition().duration(1000)
    .attr('opacity', 1)
  node
    .filter(d => currentData.find(ele => ele.target.id === d.id || ele.source.id === d.id) !== undefined)
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 18)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')

  link = allLinks
    .enter()
    .filter(d => currentData.find(ele => ele.target.id === d.target.id && ele.source.id === d.source.id) !== undefined)
    .append('line')
    .attr('class', 'line')
    .attr('stroke', 'rgba(255,255,255,0.51)')
    .attr('stroke-width', d => d.strength)
    .attr('cursor', 'pointer')
    .attr('id', d => d.target.id)
    .attr('clicked', false)
  simulation.force('link').links(currentData).distance(100)
  simulation.alpha(0.3).restart()

  const tooltip = d3.select('.tooltip')
  node
    .on('mouseover', () => {
      const id = d3.select(d3.event.target).data()[0].id
      showLines(id, linkData, nodeId)
      d3.select(d3.event.target)
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
      tooltip.transition().duration(500).style('opacity', 1)
    })
    .on('mouseout', () => {
      removeLines()
      d3.select(d3.event.target)
        .attr('stroke', null)
        .attr('stroke-width', null)
      tooltip.transition().duration(100).style('opacity', 0)
    })

  link.on('mouseover', () => {
    d3.select(d3.event.target)
      .attr('stroke', 'rgba(255,255,255,0.8)')
      .attr('stroke-width', d => d.strength + 3)
    tooltip.transition().duration(500).style('opacity', 1)
  })
    .on('mouseout', () => {
      const clicked = d3.select(d3.event.target).attr('clicked')
      if (clicked === 'false') {
        d3.select(d3.event.target)
          .attr('stroke', 'rgba(255,255,255,0.51)')
          .attr('stroke-width', d => d.strength)
      }
      tooltip.transition().duration(100).style('opacity', 0)
    })
}

function showLines(id, linkData) {
  d3.selectAll('g.node')
    .attr('opacity', 0.3)
  d3.selectAll('line')
    .attr('opacity', 0.1)
  if (graph.selectAll(`g#node_${id}`).attr('class') === 'node_hidden') {
    graph.selectAll(`g#node_${id}`).attr('class', 'node_show')
  }
  graph.selectAll(`g#node_${id}`)
    .attr('opacity', 1)
  graph.selectAll(`#line${id}`)
    .attr('opacity', 1)
  linkData.forEach((d) => {
    if (d.source.id === id) {
      const selection = graph.selectAll(`g#node_${d.target.id}`)
      selection.attr('opacity', 1)
        .attr('class', selection.attr('class') === 'node_hidden' ? 'node_show' : 'node')
    } else if (d.target.id === id) {
      const selection = graph.selectAll(`g#node_${d.source.id}`)
      selection.attr('class', selection.attr('class') === 'node_hidden' ? 'node_show' : 'node')
        .attr('opacity', 1)
    }
  })
  graph
    .selectAll('.node_show')
    .append('text')
    .attr('text-anchor', 'middle')
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 18)
    .attr('fill', '#125091')
    .attr('transform', 'translate(0,5)')
  tmpLink = allLinks
    .enter()
    .filter(d => d.source.id === id || d.target.id === id)
    .append('line')
    .attr('class', 'line_show')
    .attr('stroke', 'rgba(255,255,255,0.51)')
    .attr('stroke-width', d => d.strength)
    .attr('cursor', 'pointer')
    .attr('id', d => d.target)
    .attr('clicked', false)
  tmpLink
    .attr('x1', (d) => {
      const distance = calDistance(d.source, d.target)
      const x_distance = (d.target.x - d.source.x) / distance * 37
      return d.source.x + x_distance
    })
    .attr('y1', (d) => {
      const distance = calDistance(d.source, d.target)
      const y_distance = (d.target.y - d.source.y) / distance * 37
      return d.source.y + y_distance
    })
    .attr('x2', (d) => {
      const distance = calDistance(d.source, d.target)
      const x_distance = (d.target.x - d.source.x) / distance * 37
      return d.target.x - x_distance
    })
    .attr('y2', (d) => {
      const distance = calDistance(d.source, d.target)
      const y_distance = (d.target.y - d.source.y) / distance * 37
      return d.target.y - y_distance
    })
}

function removeLines() {
  d3.selectAll('g.node')
    .attr('opacity', 1)
  graph.selectAll('line')
    .attr('opacity', 1)
  graph
    .selectAll('.node_show')
    .attr('opacity', 0.3)
    .attr('class', 'node_hidden')
    .select('text')
    .remove()
  tmpLink
    .remove()
}
