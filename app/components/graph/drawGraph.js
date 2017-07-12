import * as d3 from 'd3'
import 'style/graph.styl'

let data = {
  "nodes": [
    {
      "id": 0,
      "name": "小米",
      "type": 'center',
      "value": 0
    },
    {
      "id": 1,
      "name": "所属公司",
      "type": 'news',
      "value": 1
    },
    {
      "id": 2,
      "name": "新闻列表",
      "type": 'news',
      "value": 1
    },
    {
      "id": 3,
      "name": "手机",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 4,
      "name": "笔记本",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 5,
      "name": "家用电器",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 6,
      "name": "华为",
      "type": 'related_brand',
      "value": 3
    },
    {
      "id": 7,
      "name": "魅族",
      "type": 'related_brand',
      "value": 3,
    },
    {
      "id": 8,
      "name": "雷军",
      "type": 'person',
      "value": 4,
    },
    {
      "id": 9,
      "name": "小米4",
      "type": 'product',
      "value": 5,
    },
    {
      "id": 10,
      "name": "小米NOTE",
      "type": 'product',
      "value": 5,
    },
    {
      "id": 11,
      "name": "林斌",
      "type": 'person',
      "value": 4,
    }
  ],
  "links": [
    {
      "source": 0,
      "target": 1,
      "type": 'news',
      "strength": 1,
    },
    {
      "source": 0,
      "target": 2,
      "type": 'news',
      "strength": 1,

    },
    {
      "source": 0,
      "target": 3,
      "type": 'store_type',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 4,
      "type": 'store_type',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 5,
      "type": 'store_type',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 6,
      "type": 'related_brand',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 7,
      "type": 'related_brand',
      "strength": 4,
    },
    {
      "source": 0,
      "target": 8,
      "type": 'person',
      "strength": 4,
    },
    {
      "source": 0,
      "target": 9,
      "type": 'product',
      "strength": 5,
    },
    {
      "source": 0,
      "target": 10,
      "type": 'product',
      "strength": 5,
    },
    {
      "source": 0,
      "target": 11,
      "type": 'person',
      "strength": 5,
    }
  ]
}


export function drawGraph() {
  let svg = d3.select('.graph-svg')
  let width = svg.style('width').replace('px', ''), height = svg.style('height').replace('px', '')
  let graph = svg.select('.graph-g')
    .attr('width', width)
    .attr('height', height)
  graph.selectAll('*').remove()
  let simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(250))
    // .force("charge", d3.forceManyBody().strength(-1))
    .force("collide", d3.forceCollide().radius(40))
    // .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force('x', d3.forceX(d => {
      if (d.value === 0) {
        return width / 2
      } else if (d.value === 1) {
        return width * 0.1
      } else if (d.value === 2) {
        return width * 0.5
      } else if (d.value === 3) {
        return width
      } else if (d.value === 4) {
        return width * 0.7
      } else {
        return width * 0.3
      }
    }))
    .force('Y', d3.forceY(d => {
      if (d.value === 0) {
        return height / 2
      } else if (d.value === 1) {
        return height * 0.5
      } else if (d.value === 2) {
        return height * 0.1
      } else if (d.value === 3) {
        return height * 0.5
      } else if (d.value === 4) {
        return height
      } else {
        return height * 0.8
      }
    }))
  let link = graph.selectAll(".link")
    .data(data.links, d => d.target.id)
  link = link.enter()
    .append("line")
    .attr('stroke', 'rgba(255,255,255,0.51)')
    .attr('stroke-width', d => d.strength)

  let node = graph.selectAll(".node")
    .data(data.nodes, d => d.id)

  node = node.enter()
    .append("g")

  node
    .filter(d => d.type === 'center')
    .append('circle')
    .attr('r', 78)
    .attr('fill', 'url(#brandGradient)')

  node.filter(d => d.type === 'news')
    .append('rect')
    .attr('width', 148)
    .attr('height', 34)
    .attr('fill', 'url(#newsGradient)')
    .attr("transform", `translate(-74,-17)`)
  node.filter(d => d.type === 'related_brand')
    .append("ellipse")
    .attr("rx", 66)
    .attr("ry", 25)
    .attr("fill", "url(#storeTypeGradient)")

  node.filter(d => d.type === 'store_type')
    .append("circle")
    .attr("r", 55)
    .attr("fill", 'url(#storeTypeGradient)')

  node.filter(d => d.type === 'person')
    .append('circle')
    .attr('r', 37)
    .attr('fill', 'url(#personGradient)')
  node.filter(d => d.type === 'product')
    .append('circle')
    .attr('r', 52)
    .attr('fill', 'url(#productGradient)')

  node.append("text")
    .attr("text-anchor", "middle")
    .text(d => d.name)
    .attr('class', 'node-text')
    .attr('pointer-events', 'none')
    .attr('font-size', 18)
    .attr('fill', '#125091')

  simulation.nodes(data.nodes)
  simulation.force("link").links(data.links)

  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick()
  }

  node.attr("transform", d => `translate(${d.x}, ${d.y})`)

  link
    .attr("x1", d => {
      const distance = calDistance(d.source, d.target)
      const x_distance = (d.target.x - d.source.x) / distance * 78
      return d.source.x + x_distance
    })
    .attr("y1", d => {
      const distance = calDistance(d.source, d.target)
      const y_distance = (d.target.y - d.source.y) / distance * 78
      return d.source.y + y_distance
    })
    .attr("x2", d => {
      const distance = calDistance(d.source, d.target)
      let x_distance
      if (d.type === 'store_type') {
        x_distance = (d.target.x - d.source.x) / distance * 55
      } else if (d.type === 'person') {
        x_distance = (d.target.x - d.source.x) / distance * 37
      } else if (d.type === 'product') {
        x_distance = (d.target.x - d.source.x) / distance * 52
      } else if (d.type === 'news') {
        if (d.source.x === d.target.x) {
          x_distance = 0
        } else {
          const tan = Math.abs((d.source.y - d.target.y) / (d.source.x - d.target.x))
          x_distance = (d.source.x > d.target.x ? -1 : 1) * (tan >= 34 / 148 ? 17 / tan : 74)
        }
      } else {
        const distance = calDistance(d.source, d.target)
        const cos = Math.abs((d.source.x - d.target.x) / distance)
        x_distance = (d.source.x > d.target.x ? -1 : 1) * 66 * cos
      }
      return d.target.x - x_distance
    })
    .attr("y2", d => {
      const distance = calDistance(d.source, d.target)
      let y_distance
      if (d.type === 'store_type') {
        y_distance = (d.target.y - d.source.y) / distance * 55
      } else if (d.type === 'person') {
        y_distance = (d.target.y - d.source.y) / distance * 37
      } else if (d.type === 'product') {
        y_distance = (d.target.y - d.source.y) / distance * 52
      } else if (d.type === 'news') {
        if (d.source.x === d.target.x) {
          y_distance = 17
        } else {
          const tan = Math.abs((d.source.y - d.target.y) / (d.source.x - d.target.x))
          y_distance = (d.source.y > d.target.y ? -1 : 1) * (tan >= 34 / 148 ? 17 : tan * 74)
        }
      } else {
        const distance = calDistance(d.source, d.target)
        const sin = Math.abs((d.source.y - d.target.y) / distance)
        y_distance = (d.source.y > d.target.y ? -1 : 1) * sin * 25
      }
      return d.target.y - y_distance
    })
    .attr('cursor', 'pointer')
}

function calDistance(source, target) {
  return Math.sqrt((target.y - source.y) * (target.y - source.y) +
    (target.x - source.x) * (target.x - source.x))
}

