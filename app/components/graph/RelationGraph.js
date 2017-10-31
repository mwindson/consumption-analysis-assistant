import * as d3 from 'd3'
import 'style/graph.styl'

const nodeColor = {
  // type: [normal, hover]
  Brand: ['url(#brandGradient)', '#4AF7FF'],
  Company: ['url(#companyGradient)', '#F1D237'],
  Person: ['url(#personGradient)', '#2095FF'],
  empty: ['url(#brandGradient)', '#4AF7FF'],
  Product: ['url(#productGradient)', '#EA8484'],
}

export default class RelationGraph {
  constructor(svg) {
    this.svg = svg
    this.width = null
    this.height = null
    this.force = null
    this.nodes = null
    this.links = null
    this.link = null
    this.hoverLinks = null // 节点hover时的临时关系线
    this.radius = 50
  }

  draw(nodeData, linkData, centerId, nodeClick, firstLoad) {
    this.initForce(nodeData, linkData, centerId, nodeClick, firstLoad)
    this.initNodes(nodeData)
    this.updateNodes(nodeData, linkData, centerId, nodeClick)
    this.drawLines(centerId, firstLoad)
    this.restart(centerId)
  }

  initForce(nodeData, linkData, centerId, nodeClick, firstLoad) {
    this.width = this.svg.style('width').replace('px', '')
    this.height = this.svg.style('height').replace('px', '')
    this.force = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(350))
      .force('collide', d3.forceCollide().radius(this.radius + 5))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('x', d3.forceX((d) => {
        if (d.id !== centerId) {
          if (d.type === 'Brand') {
            return 0
          } else if (d.type === 'Product') {
            return this.width
          } else {
            return this.width / 2
          }
        }
        return this.width / 2
      }))
      .force('y', d3.forceY((d) => {
        if (d.id !== centerId) {
          if (d.type === 'Company') {
            return this.height
          } else if (d.type === 'Person') {
            return 0
          } else {
            return this.height / 2
          }
        }
        return this.height / 2
      }))
    this.svg.select('#textClip')
      .append('rect')
      .attr('x', -this.radius)
      .attr('y', -this.radius / 2)
      .attr('width', this.radius * 1.8)
      .attr('height', this.radius)
    this.links = this.svg
      .select('.line-group')
      .selectAll('.line')
      .data(linkData.toJS())
      .enter()
  }

  initNodes(nodeData) {
    // 清空之前的节点和线段
    if (this.nodes) this.nodes.remove()
    if (this.hoverLinks) this.hoverLinks.remove()
    // 节点数据绑定
    this.nodes = this.svg
      .select('.node-group')
      .selectAll('.node')
      .data(nodeData.toJS())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', d => d.id)
    this.nodes
      .append('circle')
      .attr('id', d => d.type)
      .attr('fill', d => nodeColor[d.type][0])
      .attr('stroke-width', '3')
    // 文本动画
    this.nodes
      .append('g')
      .attr('clip-path', 'url(#textClip)')
      .append('text')
      .text('')
  }

  updateNodes(nodeData, linkData, centerId, nodeClick) {
    // 隐藏C类
    this.nodes
      .attr('class', 'node-hidden')
      .attr('type', 'C')
      .attr('opacity', 0.5)
      .selectAll('circle')
      .attr('stroke', '#E88485')
      .attr('stroke-width', 5)
      .attr('r', this.radius * 0.8)
    // 更新当前中心点的A类
    this.nodes.filter(d => d.id === centerId)
      .attr('type', 'A')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', this.radius)
      .attr('fill', d => nodeColor[d.type][1])
      .attr('stroke', '#4AF7FF')
      .attr('stroke-width', 5)
    // 更新当前中心点的B类
    this.nodes.filter(d => linkData.filter(x => x.get('source') === centerId && x.get('target') === d.id).size !== 0)
      .attr('type', 'B')
      .attr('class', 'node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', this.radius)
      .attr('stroke', 'white')
      .attr('stroke-width', 5)

    // 显示和删除文字
    const r = this.radius
    d3.selectAll('.node-show')
      .selectAll('text')
      .text(d => d.name)
      .attr('class', 'node-text')
      .attr('pointer-events', 'none')
      .attr('font-size', d => (d.id === centerId ? 20 : 14))
      .attr('font-weight', d => (d.id === centerId ? 'bold' : 'null'))
      .attr('fill', '#125091')
      .each(function () {
        const textWidth = d3.select(this).node().getBBox().width
        d3.select(this).attr('transform', `translate(${textWidth <= r * 1.8 ? -textWidth / 2 : -r},7)`)
      })

    d3.selectAll('.node-hidden')
      .selectAll('text')
      .text('')
    // 更新节点点击和拖动事件
    const tooltip = d3.select('.tooltip')
    this.nodes
      .attr('cursor', 'pointer')
      .on('click', () => {
        const id = d3.select(d3.event.target).datum().id
        this.force.stop()
        // 移除文字动画
        d3.selectAll('animateTransform').remove()
        if (this.hoverLinks) this.hoverLinks.remove()
        this.hoverLinks = null
        if (id !== centerId) {
          const nodeType = d3.select(d3.event.target).datum().type
          nodeClick(id, nodeType)
        }
      })
      .on('mouseover', () => {
        const n = d3.select(d3.event.target).datum()
        const id = n.id
        this.hoverOn(linkData, centerId, id)
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
        this.hoverLeave()
        d3.select(d3.event.target)
          .classed('highlight', false)
        tooltip.transition().duration(100).style('opacity', 0)
      })
    this.nodes
      .call(d3.drag()
        .on('start', d => this.dragStart(d))
        .on('drag', d => this.dragged(d))
        .on('end', d => this.dragEnd(d)))
  }

  drawLines(centerId, first = true) {
    // 显示A和B的连线
    if (this.link) {
      this.link.remove()
      if (first) {
        this.link = this.links
          .filter(d => d.source === centerId)
          .append('line')
      } else {
        this.link = this.links
          .filter(d => d.source.id === centerId)
          .append('line')
      }
    } else {
      this.link = this.links
        .filter(d => d.source === centerId)
        .append('line')
    }
    this.link.attr('class', 'line-show')
      .attr('stroke', '#fff')
      .attr('opacity', 0.5)
      .attr('stroke-width', 3)
  }

  restart(centerId) {
    this.force.nodes(this.nodes.data())
      .on('tick', () => tick(this.nodes, this.link, this.hoverLinks))
    this.force.force('link').links(this.links.data())
    this.force.alpha(1).restart()
    // setTimeout(() => {
    //   const centerNode = this.nodes.filter(d => d.id === centerId).datum()
    //   d3.select('.graph-g').transition().duration(1000)
    //     .attr('transform', `translate(${(this.width / 2) - centerNode.x},${(this.height / 2) - centerNode.y})`)
    // }, 1000)
  }

  dragStart(d) {
    if (!d3.event.active) this.force.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  dragEnd(d) {
    if (!d3.event.active) this.force.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
  hoverOn(linkData, centerId, currentId) {
    // 透明现有线段和点
    d3.selectAll('.line-show')
      .attr('opacity', 0)
    d3.selectAll('.node-show')
      .attr('opacity', 0.5)
    const hoverNode = this.nodes.filter(d => d.id === currentId)
    // A类实体，Hover上去时高亮和B1的连线。
    // B1类实体，Hover上去时高亮和A的连线，以及显示和C1的连线。
    // B2以及其他类实体，默认不显示和A的连线，Hover时会显示在当前视角里，和它有关系的第一类实体的连线。
    let relatedNode
    if (hoverNode.attr('type') === 'A') {
      this.link.filter(d => d.source.id === centerId)
        .attr('opacity', 1)
      relatedNode = this.nodes
        .filter(d => d.id === currentId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
          && x.get('score') === 1)).size !== 0)
    } else if (hoverNode.attr('type') === 'B1' || hoverNode.attr('type') === 'B2') {
      this.link.filter(d => (d.source.id === centerId && d.target.id === currentId) ||
        (d.source.id === currentId && d.target.id === centerId))
        .attr('opacity', 1)
      this.hoverLinks = this.links
        .filter(d => (d.source.id === currentId) ||
          (d.target.id === currentId && d.source.id === centerId))
        .append('line')
        .attr('class', 'line-hover')
        .attr('stroke', '#fff')
        .attr('opacity', 1)
        .attr('stroke-width', 3)
      relatedNode = this.nodes
        .filter(d => d.id === currentId
          || d.id === centerId || linkData.filter(x => (x.get('target') === d.id && x.get('source') === currentId
            && x.get('score') === 1)).size !== 0)
      // || !hoverLinks.filter(x => x.source.id === d.id || x.target.id === d.id).empty())
    } else {
      this.hoverLinks = this.links
        .filter(d => (d.source.id === currentId) ||
          isLink(d, linkData, currentId, centerId))
        .append('line')
        .attr('class', 'line-hover')
        .attr('stroke', '#fff')
        .attr('opacity', 1)
        .attr('stroke-width', 3)
      relatedNode = this.nodes
        .filter(d => d.id === currentId ||
          !this.hoverLinks.filter(x => x.source.id === d.id || x.target.id === d.id).empty())
    }
    // 显示相关联的节点
    const radius = this.radius
    relatedNode
      .attr('opacity', 1)
      .selectAll('text')
      .text(d => d.name)
      .attr('class', 'node-text')
      .attr('pointer-events', 'none')
      .attr('font-size', d => (d.id === centerId ? 20 : 14))
      .attr('font-weight', d => (d.id === centerId ? 'bold' : 'null'))
      .attr('fill', '#125091')
      .each(function () {
        const textWidth = d3.select(this).node().getBBox().width
        d3.select(this).attr('transform', `translate(${textWidth <= radius * 1.8 ? -textWidth / 2 : -radius},7)`)
      })
    relatedNode
      .filter(d => d.id === currentId)
      .selectAll('text')
      .each(function () {
        const textWidth = d3.select(this).node().getBBox().width
        if (textWidth > radius * 1.8) {
          d3.select(this)
            .append('animateTransform')
            .attr('attributeName', 'transform')
            .attr('type', 'translate')
            .attr('from', `${radius} 7`)
            .attr('to', `${-textWidth - radius} 7`)
            .attr('dur', `${textWidth / radius}`)
            .attr('repeatCount', 'indefinite')
        }
      })
    relatedNode
      .selectAll('circle')
      .transition()
      .duration(500)
      .attr('r', this.radius)
      .attr('fill', d => nodeColor[d.type][1])
    // 绘制临时连接线
    if (this.hoverLinks) {
      this.hoverLinks.attr('x1', (d) => {
        const r = this.nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
        const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
        return d.source.x + xDistance
      })
        .attr('y1', (d) => {
          const r = this.nodes.filter(n => n.id === d.source.id).select('circle').attr('r')
          const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
          return d.source.y + yDistance
        })
        .attr('x2', (d) => {
          const r = this.nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
          const xDistance = ((d.target.x - d.source.x) / calDistance(d.source, d.target)) * r
          return d.target.x - xDistance
        })
        .attr('y2', (d) => {
          const r = this.nodes.filter(n => n.id === d.target.id).select('circle').attr('r')
          const yDistance = ((d.target.y - d.source.y) / calDistance(d.source, d.target)) * r
          return d.target.y - yDistance
        })
    }
  }

  hoverLeave() {
    // 恢复现有线段
    d3.selectAll('.line-show')
      .attr('opacity', 0.5)
    // 恢复现有节点
    d3.selectAll('.node-show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('fill', d => nodeColor[d.type][0])
    d3.selectAll('[type=A]')
      .selectAll('circle')
      .attr('fill', d => nodeColor[d.type][1])
    d3.selectAll('.node-hidden')
      .attr('opacity', 0.5)
      .selectAll('text')
      .text('')
    d3.selectAll('.node-hidden')
      .attr('opacity', 0.5)
      .selectAll('circle')
      .transition(500)
      .duration(500)
      .attr('r', this.radius * 0.8)
      .attr('fill', d => nodeColor[d.type][0])
    // 移除文字动画
    d3.selectAll('animateTransform').remove()
    // 删除hover时临时显示的线
    if (this.hoverLinks && !this.hoverLinks.empty()) {
      this.hoverLinks.remove()
      this.hoverLinks = null
    }
  }
}

function calDistance(source, target) {
  return Math.sqrt(
    ((target.y - source.y) * (target.y - source.y))
    + ((target.x - source.x) * (target.x - source.x)),
  )
}

function tick(nodes, link, hoverLinks) {
  nodes.each(function () { d3.select(this).attr('transform', d => `translate(${d.x}, ${d.y})`) })
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

function isLink(d, linkData, currentId, centerId) {
  return (d.source.id === centerId && linkData.filter(x => x.get('source') === d.target.id && x.get('target') === currentId).size !== 0)
    || (d.source.id === currentId && linkData.filter(x => x.get('source') === d.target.id && x.get('target') === centerId).size !== 0)
    || (d.target.id === currentId && linkData.filter(x => x.get('target') === d.source.id && x.get('source') === centerId).size !== 0)
    || (d.target.id === centerId && linkData.filter(x => x.get('target') === d.source.id && x.get('source') === currentId).size !== 0)
}
