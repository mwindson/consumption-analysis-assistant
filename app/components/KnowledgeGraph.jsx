import React from 'react'
import 'style/KnowledgeGraph.styl'
import {drawGraph} from 'components/graph/drawGraph'
import {bindingZoom, zoomClick, zoomReset} from 'components/graph/zoomClick'
import {ResetIcon, ZoomInIcon, ZoomOutIcon} from 'components/Icons'
import * as d3 from 'd3'
export default class KnowledgeGraph extends React.Component {
  constructor(props) {
    super(props)
    this.svgElement = null
  }

  componentDidMount() {
    drawGraph()
    this.svgElement = d3.select('.graph-svg')
    bindingZoom(this.svgElement)
  }

  handleButtonClick = (type) => {
    if (type === 'reset') {
      zoomReset(this.svgElement)
    } else {
      zoomClick(this.svgElement, type)
    }
  }

  render() {
    return (
      <div className="knowledge-graph">
        <div className="diagram">
          <svg className="graph-svg">
            <defs>
              <linearGradient id="brandGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#4AF7FF"/>
              </linearGradient>
              <linearGradient id="storeTypeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#FFFFFF"/>
              </linearGradient>
              <linearGradient id="newsGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#F1D237"/>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.43"/>
              </linearGradient>
              <linearGradient id="productGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#EA8484"/>
              </linearGradient>
              <linearGradient id="personGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#2095FF"/>
              </linearGradient>
              <linearGradient id="personGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#EA8484"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="tools">
          <div className="reset" onClick={() => this.handleButtonClick('reset')}><ResetIcon/></div>
          <div className="zoom-in" onClick={() => this.handleButtonClick('zoom_in')}><ZoomInIcon/></div>
          <div className="zoom-out" onClick={() => this.handleButtonClick('zoom_out')}><ZoomOutIcon/></div>
        </div>
      </div>
    )
  }
}
