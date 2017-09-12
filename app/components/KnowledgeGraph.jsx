import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { is } from 'immutable'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import * as A from 'actions'
import { drawGraph, drawLines, restart, updateNodes } from 'components/graph/drawGraph'
import { zoomClick, zoomReset } from 'components/graph/zoomClick'
import { ResetIcon, ZoomInIcon, ZoomOutIcon } from 'components/Icons'
import 'style/KnowledgeGraph.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class KnowledgeGraph extends React.Component {
  // todo react-redux 有bug
  static propTypes = {
    // nodeData: ImmutablePropTypes.list.isRequired,
    // linkData: ImmutablePropTypes.list.isRequired,
    // currentCenterId: PropTypes.number.isRequired,
    // lineClick: PropTypes.func.isRequired,
    // // callback
    // dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentNodeId: 0,
    }
    this.svgElement = null
    this.graphZoom = null
    this.resizeId = null
  }

  componentDidMount() {
    this.svgElement = d3.select('.graph-svg')
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeId)
      this.resizeId = setTimeout(this.resize, 500)
    })
    this.graphZoom = d3.zoom().scaleExtent([0.5, 8])
    this.graphZoom.on('zoom', this.zoomed)
    this.svgElement.call(this.graphZoom)
  }

  componentWillReceiveProps(nextProps) {
    const { nodeData, linkData, centerId, graphType } = this.props
    if (!is(nextProps.nodeData, nodeData) || !is(nextProps.linkData, linkData)) {
      drawGraph(this.svgElement, nextProps.nodeData, nextProps.linkData, centerId,
        this.handleNodeClick, graphType, !nodeData.isEmpty(),
      )
    }
    if (nextProps.graphType !== graphType) {
      drawLines(centerId, nextProps.graphType, false)
      updateNodes(this.svgElement, nodeData, linkData, centerId, this.handleNodeClick, nextProps.graphType)
      restart(centerId)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize')
  }

  resize = () => {
    const { nodeData, linkData, centerId, graphType } = this.props
    drawGraph(this.svgElement, nodeData, linkData, centerId, this.handleNodeClick, graphType, !nodeData.isEmpty())
  }
  zoomed = () => {
    const g = d3.select('.graph-g')
    g.attr('transform', d3.event.transform)
  }

  handleButtonClick = (type) => {
    if (type === 'reset') {
      zoomReset(this.svgElement, this.graphZoom, this.props.centerId)
    } else {
      zoomClick(this.svgElement, this.graphZoom, type, this.props.centerId)
    }
  }

  handleNodeClick = (id, nodeType) => {
    if (nodeType !== 'Product') {
      zoomReset(this.svgElement, this.graphZoom, this.props.centerId)
      this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: nodeType })
    } else {
      this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'product', id })
    }

  }

  render() {
    return (
      <div className="knowledge-graph">
        <div className="diagram">
          <svg className="graph-svg">
            <defs>
              <linearGradient id="brandGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#4AF7FF" />
              </linearGradient>
              <linearGradient id="storeTypeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="companyGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#F1D237" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.43" />
              </linearGradient>
              <linearGradient id="productGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EA8484" />
              </linearGradient>
              <linearGradient id="personGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2095FF" />
              </linearGradient>
            </defs>
            <g className="graph-g">
              <g className="line-group" />
              <g className="node-group" />
            </g>
          </svg>
          <div className="tooltip">
            tooltip
          </div>
        </div>
        <div className="tools">
          <div className="reset" onClick={() => this.handleButtonClick('reset')}><ResetIcon /></div>
          <div className="zoom-in" onClick={() => this.handleButtonClick('zoom_in')}><ZoomInIcon /></div>
          <div className="zoom-out" onClick={() => this.handleButtonClick('zoom_out')}><ZoomOutIcon /></div>
        </div>
      </div>
    )
  }
}
