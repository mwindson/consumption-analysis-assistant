import React from 'react'
import { is } from 'immutable'
import * as d3 from 'd3'
import { connect } from 'react-redux'
import querystring from 'querystring'
import { replace } from 'react-router-redux'
import { Portal } from 'react-portal'
import classNames from 'classnames'
import * as A from 'actions'
import RelationGraph from 'components/graph/RelationGraph'
import { zoomClick, zoomReset } from 'components/graph/zoomClick'
import { ResetIcon, ZoomInIcon, ZoomOutIcon, ModeIcon } from 'components/Icons'
import 'style/KnowledgeGraph.styl'
import NodeRelation from 'components/NodeRelation'

const mapStateToProps = state => Object.assign({}, state.graph.toObject(), state.routing)

@connect(mapStateToProps)
export default class KnowledgeGraph extends React.Component {
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
      show: false,
      relations: null,
      relationMode: false,
    }
    this.svgElement = null
    this.graphZoom = null
    this.resizeId = null
    this.graph = null
  }

  componentDidMount() {
    this.svgElement = d3.select('.graph-svg')
    this.graph = new RelationGraph(this.svgElement)
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeId)
      this.resizeId = setTimeout(this.resize, 500)
    })
    this.graphZoom = d3.zoom().scaleExtent([0.5, 8])
    this.graphZoom.on('zoom', this.zoomed)
    this.svgElement.call(this.graphZoom)
  }

  componentWillReceiveProps(nextProps) {
    const { nodeData, linkData, location } = nextProps
    const { id } = querystring.parse(location.search.substring(1))
    if (!is(nodeData, this.props.nodeData) || !is(linkData, this.props.linkData)) {
      this.graph.draw(nodeData, linkData, id)
      this.graph.updateNodeInteraction(id, nodeData, linkData, this.handleNodeClick, this.relationShow, this.state.relationMode, this.onChangeMode)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  onChangeMode = () => {
    const { nodeData, linkData, location } = this.props
    const { id } = querystring.parse(location.search.substring(1))
    this.graph.changeMode(!this.state.relationMode, id)
    this.graph.updateNodeInteraction(id, nodeData, linkData, this.handleNodeClick, this.relationShow, !this.state.relationMode, this.onChangeMode)
    this.setState({ relationMode: !this.state.relationMode })
  }
  resize = () => {
    const { nodeData, linkData, location } = this.props
    const { id } = querystring.parse(location.search.substring(1))
    this.graph.draw(nodeData, linkData, id)
    this.graph.updateNodeInteraction(id, nodeData, linkData, this.handleNodeClick, this.relationShow, this.state.relationMode, this.onChangeMode)
  }
  zoomed = () => {
    const g = d3.select('.graph-g')
    g.attr('transform', d3.event.transform)
  }
  relationClose = () => {
    this.setState({ show: false })
  }
  relationShow = (relations) => {
    this.setState({ show: true, relations })
  }
  handleButtonClick = (type) => {
    const { location } = this.props
    const { id } = querystring.parse(location.search.substring(1))
    if (type === 'reset') {
      zoomReset(this.svgElement, this.graphZoom, id, this.graph)
    } else {
      zoomClick(this.svgElement, this.graphZoom, type, id)
    }
  }

  handleNodeClick = (id, type) => {
    const { location } = this.props
    const { id: currentId } = querystring.parse(location.search.substring(1))
    zoomReset(this.svgElement, this.graphZoom, currentId, this.graph)
    this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
    this.props.dispatch({
      type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: true,
    })
  }

  render() {
    const { show, relations, relationMode } = this.state
    return (
      <div className="knowledge-graph">
        {this.props.graphLoading ?
          <div className="mask">
            <div className="loading">
              <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
            </div>
          </div> : null}
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
              <clipPath id="textClip" />
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
        <NodeRelation show={show} relations={relations} onClose={this.relationClose} />
        <Portal node={document && document.getElementById('left')}>
          <div className={classNames('relation-mode', { show: relationMode })}>
            <svg className="relation-graph">
              <g className="relation-mode-group">
                <g className="inner">
                  <g className="relation-lines" />
                  <g className="relation-nodes" />
                </g>
              </g>
            </svg>
          </div>
        </Portal>
      </div>
    )
  }
}
