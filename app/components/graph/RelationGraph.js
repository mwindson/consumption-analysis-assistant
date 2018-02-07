import * as d3 from 'd3'
import { fromJS } from 'immutable'
import 'style/graph.styl'

const nodeColor = {
  // type: [normal, hover]
  Brand: ['url(#brandGradient)', '#4AF7FF'],
  Company: ['url(#companyGradient)', '#F1D237'],
  Person: ['url(#personGradient)', '#2095FF'],
  empty: ['url(#brandGradient)', '#4AF7FF'],
  Product: ['url(#productGradient)', '#EA8484'],
  category1: ['#fff', '#fff'],
  category2: ['#ffa421', '#ffa421'],
  category3: ['#38ff8f', '#38ff8f'],
}

export default class RelationGraph {
  constructor(svg) {
    this.svg = svg
    this.width = null
    this.height = null
    this.force = null
    this.nodes = null
    this.links = null
    this.hoverLinks = null // 节点hover时的临时关系线
    this.radius = 50
    this.relationMode = false
  }

  draw(nodeData, linkData, centerId) {
    this.initForce(centerId)
    this.initNodes(nodeData)
    this.updateNodes(nodeData, linkData, centerId)
    this.drawLines(linkData, centerId)
    this.restart(centerId)
  }

  initForce(centerId) {
    this.width = this.svg.style('width').replace('px', '')
    this.height = this.svg.style('height').replace('px', '')
    this.force = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id).distance(350))
      .force('charge', d3.forceManyBody().strength(-500))
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
    this.svg
      .select('#textClip')
      .append('rect')
      .attr('x', -this.radius * 0.9)
      .attr('y', -this.radius / 2)
      .attr('width', this.radius * 1.8)
      .attr('height', this.radius)
  }

  initNodes(nodeData) {
    // 节点数据更新绑定
    const nodeJoin = this.svg
      .select('.node-group')
      .selectAll('.node')
      .data(nodeData.toJS(), d => d.id)
    // 绘制新增节点
    const nodeEnter = nodeJoin.enter()
      .append('g')
      .attr('class', 'node')
      .attr('id', d => d.id)
    nodeEnter
      .append('circle')
      .attr('id', d => d.type)
      .attr('fill', d => nodeColor[d.type][0])
      .attr('stroke-width', 5)
    // 文本动画
    nodeEnter
      .append('g')
      .attr('clip-path', 'url(#textClip)')
      .append('text')
      .text('')
    nodeJoin.exit().remove()
    this.nodes = nodeEnter.merge(nodeJoin)
  }

  updateNodes(nodeData, linkData, centerId) {
    // 隐藏C类
    this.nodes
      .attr('class', 'node hidden')
      .attr('type', 'C')
      .attr('opacity', 0.5)
      .selectAll('circle')
      .attr('stroke', '#E88485')
      .attr('r', this.radius * 0.8)
    // 更新当前中心点的A类
    this.nodes
      .filter(d => d.id === centerId)
      .attr('class', 'node show')
      .attr('type', 'A')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', this.radius)
      .attr('stroke', '#4AF7FF')
    // 更新当前中心点的B类
    this.nodes
      .filter(d => linkData.filter(x => x.get('source') === centerId && x.get('target') === d.id).size !== 0)
      .attr('type', 'B')
      .attr('class', 'node show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('r', this.radius)
      .attr('stroke', 'white')

    // 显示和删除文字
    const r = this.radius
    d3
      .selectAll('.node.show')
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
  }

  // 更新节点点击和拖动事件
  updateNodeInteraction(centerId, nodeData, linkData, nodeClick, linkClick, relationMode, onChangeMode) {
    const tooltip = d3.select('.tooltip')
    tooltip.style('opacity', 0)
    this.nodes
      .attr('cursor', 'auto')
      .on('click', null)
      .on('mouseover', null)
      .on('mouseout', null)
    this.nodes
      .filter(d => d.id === centerId)
      .attr('cursor', 'pointer')
      .on('click', () => {
        this.hoverLeave()
        this.force.stop()
        d3.select(d3.event.target).classed('highlight', false)
        tooltip.style('opacity', 0)
        onChangeMode()
      })
    if (!relationMode) {
      d3.selectAll('.line.show').attr('opacity', 0.5)
      this.nodes
        .filter(d => d.id !== centerId)
        .filter(d => d.type !== 'category')
        .attr('cursor', 'pointer')
        .on('click', (d) => {
          const { id, type } = d
          d3.select(d3.event.target).classed('highlight', false)
          this.hoverLeave()
          this.force.stop()
          // 移除文字动画
          d3.selectAll('animateTransform').remove()
          nodeClick(id, type)
        })
      this.nodes.call(d3
        .drag()
        .on('start', d => this.dragStart(d))
        .on('drag', d => this.dragged(d))
        .on('end', d => this.dragEnd(d)))
      this.nodes
        .on('mouseover', () => {
          const { id, name, x, y } = d3.select(d3.event.target).datum()
          this.hoverOn(linkData, centerId, id)
          d3.select(d3.event.target).classed('highlight', true)
          tooltip
            .html(`<p>${name}</p>`)
            .style(
              'transform',
              `translate(${Math.min(this.width - 250, Math.max(0, x + this.radius))}px,${Math.min(this.height - 150, Math.max(0, y))}px)`,
            )
            .transition()
            .duration(500)
            .style('opacity', 0.8)
        })
        .on('mouseout', () => {
          this.hoverLeave()
          d3.select(d3.event.target).classed('highlight', false)
          tooltip
            .transition()
            .duration(100)
            .style('opacity', 0)
        })
    } else {
      this.nodes
        .filter(function () {
          return d3.select(this).attr('type') === 'B'
        })
        .filter(d => d.type !== 'category')
        .attr('cursor', 'pointer')
        .on('click', (d) => {
          const data = linkData.filter(x => x.get('source') === centerId && x.get('target') === d.id).first().toJS()
          const { source, target, relation } = data
          linkClick({
            source: nodeData.find(x => x.get('id') === source).get('name'),
            target: nodeData.find(x => x.get('id') === target).get('name'),
            relation,
          })
          this.links
            .attr('opacity', 0)
          this.links.filter(l => l.source.id === centerId && l.target.id === d.id).attr('opacity', 1)
        })
      this.nodes
        .on('mouseover', null)
        .on('mouseout', null)
    }
  }

  drawLines(linkData, centerId) {
    const linkJoin = this.svg
      .select('.line-group')
      .selectAll('.line')
      .data(linkData.toJS(), d => `${d.source}-${d.target}`)
    const linkEnter = linkJoin.enter()
      .append('g')
      .attr('class', 'line show')
    linkEnter
      .append('line')
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
    this.links = linkEnter.merge(linkJoin)
    this.links.filter(d => d.source !== centerId)
      .attr('class', 'line hidden')
      .attr('opacity', 0)
    linkJoin.exit().remove()
  }

  restart() {
    this.force.nodes(this.nodes.data()).on('tick', () => tick(this.nodes, this.links, this.hoverLinks))
    this.force.force('link').links(this.links.data())
    this.force.alpha(0.5).restart()
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
    d3.selectAll('.line.show').attr('opacity', 0)
    d3.selectAll('.node.show').attr('opacity', 0.5)
    const hoverNode = this.nodes.filter(d => d.id === currentId)
    // A类实体，Hover上去时高亮和B的连线。
    // B类实体，Hover上去时高亮和A的连线，以及显示和C 的连线。
    let relatedNode
    if (hoverNode.attr('type') === 'A') {
      this.links.filter(d => d.source.id === centerId).attr('opacity', 1)
      relatedNode = this.nodes
        .filter(d => d.id === currentId || !linkData.filter(x => x.get('target') === d.id && x.get('source') === currentId).isEmpty())
    } else {
      this.hoverLinks = this.links
        .filter(d => d.source.id === currentId || isLink(d, linkData, currentId, centerId))
      this.hoverLinks
        .attr('opacity', 1)
      relatedNode = this.nodes
        .filter(d => d.id === currentId || !this.hoverLinks.filter(x => x.source.id === d.id || x.target.id === d.id).empty())
    }
    // 显示相关联的节点
    const { radius } = this
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
        const textWidth = d3
          .select(this)
          .node()
          .getBBox().width
        d3.select(this).attr('transform', `translate(${textWidth <= radius * 1.8 ? -textWidth / 2 : -radius},7)`)
      })
    relatedNode
      .filter(d => d.id === currentId)
      .selectAll('text')
      .each(function () {
        const textWidth = d3.select(this).node().getBBox().width
        if (textWidth > radius * 1.8) {
          d3
            .select(this)
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
      .attr('fill', d => nodeColor[d.type][1])
      .transition()
      .duration(500)
      .attr('r', this.radius)
    // 绘制临时连接线
    // if (this.hoverLinks) {
    //   this.hoverLinks
    //     .attr('x1', (d) => {
    //       const r = this.nodes
    //         .filter(n => n.id === d.source.id)
    //         .select('circle')
    //         .attr('r')
    //       const xDistance = (d.target.x - d.source.x) / calDistance(d.source, d.target) * r
    //       return d.source.x + xDistance
    //     })
    //     .attr('y1', (d) => {
    //       const r = this.nodes
    //         .filter(n => n.id === d.source.id)
    //         .select('circle')
    //         .attr('r')
    //       const yDistance = (d.target.y - d.source.y) / calDistance(d.source, d.target) * r
    //       return d.source.y + yDistance
    //     })
    //     .attr('x2', (d) => {
    //       const r = this.nodes
    //         .filter(n => n.id === d.target.id)
    //         .select('circle')
    //         .attr('r')
    //       const xDistance = (d.target.x - d.source.x) / calDistance(d.source, d.target) * r
    //       return d.target.x - xDistance
    //     })
    //     .attr('y2', (d) => {
    //       const r = this.nodes
    //         .filter(n => n.id === d.target.id)
    //         .select('circle')
    //         .attr('r')
    //       const yDistance = (d.target.y - d.source.y) / calDistance(d.source, d.target) * r
    //       return d.target.y - yDistance
    //     })
    // }
  }

  hoverLeave() {
    // 恢复现有线段
    d3.selectAll('.line.show').attr('opacity', 0.5)
    // 恢复现有节点
    d3
      .selectAll('.node.show')
      .attr('opacity', 1)
      .selectAll('circle')
      .attr('fill', d => nodeColor[d.type][0])
    d3
      .selectAll('[type=A]')
      .selectAll('circle')
      .attr('fill', d => nodeColor[d.type][1])
    const nodeHidden = d3
      .selectAll('.node.hidden')
      .attr('opacity', 0.5)
    nodeHidden.selectAll('text')
      .text('')
    nodeHidden.selectAll('circle')
      .attr('fill', d => nodeColor[d.type][0])
      .transition()
      .duration(500)
      .attr('r', this.radius * 0.8)
    // 移除文字动画
    d3.selectAll('animateTransform').remove()
    // 隐藏hover时临时显示的线
    if (this.hoverLinks && !this.hoverLinks.empty()) {
      this.hoverLinks.attr('opacity', 0)
      this.hoverLinks = null
    }
  }

  changeMode(isFixed, centerId) {
    // 进入静止关系模式
    const width = d3.select('.left-part').style('width').replace('px', '')
    const height = d3.select('.left-part').style('height').replace('px', '')
    if (isFixed) {
      const svg = d3.select('.relation-graph').attr('width', '100%').attr('height', '100%')
      const g = d3.select('.relation-mode-group')
      const zoom = d3.zoom()
        .scaleExtent([0.5, 8])
        .on('zoom', function () {
          g.attr('transform', d3.event.transform)
        })
      zoom.transform(svg, d3.zoomIdentity)
      d3.select('g.inner').attr('transform', `translate(${width - this.width},${height - this.height})`)
      svg.call(zoom)
      const relationNodes = this.nodes
        .filter(function () {
          return d3.select(this).attr('type') !== 'C'
        })
      relationNodes.on('.drag', null)
      relationNodes.each(function () {
        svg.select('.relation-nodes').node().insertBefore(this, null)
      })
      const relationLinks = this.links
        .filter(d => d.source.id === centerId)
        .attr('opacity', 0.5)
      relationLinks.each(function () {
        svg.select('.relation-lines').node().insertBefore(this, null)
      })
    } else {
      const reltionNodes = d3.selectAll('.relation-nodes>.node')
      reltionNodes.each(function () {
        d3.select('.node-group').node().insertBefore(this, null)
      })
      const reltionLinks = d3.selectAll('.relation-lines>.line')
      reltionLinks.each(function () {
        d3.select('.line-group').node().insertBefore(this, null)
      })
    }
  }
}

function calDistance(source, target) {
  if (source.x === target.x && source.y === target.y) return 1
  return Math.sqrt((target.y - source.y) * (target.y - source.y) + (target.x - source.x) * (target.x - source.x))
}

function tick(nodes, links, hoverLinks) {
  nodes.each(function () {
    d3.select(this).attr('transform', d => `translate(${d.x}, ${d.y})`)
  })
  links
    .selectAll('line')
    .attr('x1', (d) => {
      const r = nodes
        .filter(n => n.id === d.source.id)
        .select('circle')
        .attr('r')
      const xDistance = (d.target.x - d.source.x) / calDistance(d.source, d.target) * r
      return d.source.x + xDistance
    })
    .attr('y1', (d) => {
      const r = nodes
        .filter(n => n.id === d.source.id)
        .select('circle')
        .attr('r')
      const yDistance = (d.target.y - d.source.y) / calDistance(d.source, d.target) * r
      return d.source.y + yDistance
    })
    .attr('x2', (d) => {
      const r = nodes
        .filter(n => n.id === d.target.id)
        .select('circle')
        .attr('r')
      const xDistance = (d.target.x - d.source.x) / calDistance(d.source, d.target) * r
      return d.target.x - xDistance
    })
    .attr('y2', (d) => {
      const r = nodes
        .filter(n => n.id === d.target.id)
        .select('circle')
        .attr('r')
      const yDistance = (d.target.y - d.source.y) / calDistance(d.source, d.target) * r
      return d.target.y - yDistance
    })
}

function isLink(d, linkData, currentId, centerId) {
  return (
    (d.source.id === centerId &&
      linkData.filter(x => x.get('source') === d.target.id && x.get('target') === currentId).size !== 0) ||
    (d.source.id === currentId &&
      linkData.filter(x => x.get('source') === d.target.id && x.get('target') === centerId).size !== 0) ||
    (d.target.id === currentId &&
      linkData.filter(x => x.get('target') === d.source.id && x.get('source') === centerId).size !== 0) ||
    (d.target.id === centerId &&
      linkData.filter(x => x.get('target') === d.source.id && x.get('source') === currentId).size !== 0)
  )
}
