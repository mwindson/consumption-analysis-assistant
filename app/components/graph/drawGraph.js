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
    },
    {
      "source": 0,
      "target": 2,
    },
    {
      "source": 0,
      "target": 3,
    },
    {
      "source": 0,
      "target": 4,
    },
    {
      "source": 0,
      "target": 5,
    },
    {
      "source": 0,
      "target": 6,
    },
    {
      "source": 0,
      "target": 7,
    },
    {
      "source": 0,
      "target": 8,
    },
    {
      "source": 0,
      "target": 9,
    },
    {
      "source": 0,
      "target": 10,
    },
    {
      "source": 0,
      "target": 11,
    }
  ]
}


export function drawGraph() {
  let svg = d3.select('.graph-svg')
  let width = svg.style('width').replace('px', ''), height = svg.style('height').replace('px', '')
  svg.append('g')
    .attr('class', 'graph-g')
    .attr('width', width)
    .attr('height', height)
  let graph = d3.selectAll('g')
  // .attr('transform',`translate(${},${})`)
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
    .attr('stroke', '#aaa')
    .attr('stroke-width', 3)

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
    .attr('font-size', 14)

  simulation.nodes(data.nodes)
  simulation.force("link").links(data.links)

  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick()
  }

  node.attr("transform", d => `translate(${d.x}, ${d.y})`)

  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y)
    .attr('cursor', 'pointer')
}


