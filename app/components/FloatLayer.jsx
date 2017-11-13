import React from 'react'
import { is } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Portal } from 'react-portal'
import { Motion, spring } from 'react-motion'
import { replace } from 'react-router-redux'
import classNames from 'classnames'
import { connect } from 'react-redux'
import querystring from 'querystring'
import * as A from 'actions'
import { PrevStepIcon, NextStepIcon } from 'components/Icons'
import 'style/FloatLayer.styl'
import config from '../utils/config.yaml'

const mapStateToProps = (state, ownProps) => Object.assign({}, state.main.toObject(), state.routing, ownProps)

@connect(mapStateToProps)
class FloatLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      index: this.props.data.size - 1, // 浏览记录的当前选中下标
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.footprint, this.props.footprint)) {
      this.setState({ index: nextProps.data.size - 1 })
    }
  }

  handleClick = (id, type, index) => {
    if (this.props.contentType === 'history') this.setState({ index })
    this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
    this.props.dispatch({
      type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: this.props.contentType !== 'history',
    })
    this.props.dispatch({ type: A.FLOAT_LAYER_OPEN, isOpen: false })
  }

  openPortal = () => {
    this.props.dispatch({ type: A.CHANGE_OPEN_TYPE, contentType: 'history' })
    this.props.dispatch({ type: A.FLOAT_LAYER_OPEN, isOpen: true })
  }
  closePortal = () => {
    this.props.dispatch({ type: A.FLOAT_LAYER_OPEN, isOpen: false })
  }
  toPrev = () => {
    if (this.state.index > 0) {
      this.setState({ index: this.state.index - 1 })
      const type = this.props.data.get(this.state.index - 1).get('type')
      const id = this.props.data.get(this.state.index - 1).get('id')
      this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
      this.props.dispatch({
        type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: false,
      })
    }
  }
  toNext = () => {
    if (this.state.index < this.props.data.size - 1) {
      this.setState({ index: this.state.index + 1 })
      const type = this.props.data.get(this.state.index + 1).get('type')
      const id = this.props.data.get(this.state.index + 1).get('id')
      this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
      this.props.dispatch({
        type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: false,
      })
    }
  }

  render() {
    const {
      data, keyword, contentType, floatLayerOpen,
    } = this.props
    const { index } = this.state
    return [
      <div
        className={classNames('step-button', { disable: index === 0 })}
        onClick={() => (index > 0 ? this.toPrev() : null)}
      >
        <PrevStepIcon color={index === 0 ? 'gray' : '#fff'} />上一条
      </div>,
      <div
        className={classNames('step-button', { disable: index === data.size - 1 })}
        onClick={() => (index < data.size - 1 ? this.toNext() : null)}
      >
        下一条<NextStepIcon color={index === data.size - 1 ? 'gray' : '#fff'} />
      </div>,
      <div className={classNames('bookmark-open', { hidden: floatLayerOpen })} onClick={this.openPortal}>
        浏览记录
      </div>,
      <Portal node={document && document.getElementById('left-part')}>
        <Motion style={{ x: spring(floatLayerOpen ? -280 : 0) }}>
          {({ x }) => (
            <div className="float-layer" style={{ transform: `translate(${x}px,0)` }}>
              <div className="top-part">
                {contentType === 'moreResult' ? <div className="keyword">{`搜索关键词：${keyword} `}</div> : null}
                <div className="bookmark-close" onClick={this.closePortal}>收起</div>
              </div>
              <div className="list">
                {data.toArray().map((item, i) =>
                  (<div
                    key={i}
                    className={classNames('item', { long: contentType === 'history' }, { chosen: index === i })}
                    onClick={() => this.handleClick(item.get('id'), item.get('type'), i)}
                  >
                    {`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                   </div>))}
              </div>
            </div>
          )}
        </Motion>
      </Portal>,
    ]
  }
}

FloatLayer.propTypes = {
  data: ImmutablePropTypes.list.isRequired,
}
export default FloatLayer
