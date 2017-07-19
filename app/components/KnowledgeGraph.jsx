import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import * as A from 'actions'
import { drawGraph } from 'components/graph/drawGraph'
import { bindingZoom, zoomClick, zoomReset } from 'components/graph/zoomClick'
import { ResetIcon, ZoomInIcon, ZoomOutIcon } from 'components/Icons'
import 'style/KnowledgeGraph.styl'

const mapStateToProps = state => state.toJS()

@connect(mapStateToProps)
export default class KnowledgeGraph extends React.Component {
  static propTypes = {
    nodeData: ImmutablePropTypes.list.isRequired,
    linkData: ImmutablePropTypes.list.isRequired,
    currentCenterId: PropTypes.number.isRequired,
    lineClick: PropTypes.func.isRequired,
    // callback
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      lineId: 0,
      currentNodeId: 0,
    }
    this.svgElement = null
  }

  componentWillMount() {
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA })
  }

  componentDidMount() {
    // window.addEventListener('resize', () => {
    //   drawGraph(this.props.data, this.state.currentNodeId, this.handleLineClick, this.handleNodeClick, this.hasClicked)
    // })
    this.svgElement = d3.select('.graph-svg')
    bindingZoom(this.svgElement)
  }

  componentWillReceiveProps(nextProps) {
    const { nodeData, linkData, currentCenterId } = this.props
    if ((nextProps.nodeData !== nodeData) || (nextProps.linkData !== linkData)) {
      // drawGraph(nextProps.data, this.handleLineClick, this.handleNodeClick)
      // updateGraph(nextProps.currentNodeId, this.handleLineClick)
      drawGraph(
        nextProps.nodeData, nextProps.linkData, currentCenterId, this.handleLineClick,
        this.handleNodeClick, this.hasClicked,
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', drawGraph)
  }

  shouldCompopnentUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data) {
      return false
    }
    return false
  }


  handleButtonClick = (type) => {
    if (type === 'reset') {
      zoomReset(this.svgElement)
    } else {
      zoomClick(this.svgElement, type)
    }
  }

  handleLineClick = (id, type) => {
    this.props.lineClick(id, type)
  }
  handleNodeClick = (id) => {
    this.setState({ currentNodeId: id })
  }
  hasClicked = id => this.state.currentNodeId !== id

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
              <linearGradient id="newsGradient" x1="0" x2="1" y1="0" y2="0">
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
              <linearGradient id="personGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EA8484" />
              </linearGradient>
            </defs>
            <g className="graph-g" />
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
