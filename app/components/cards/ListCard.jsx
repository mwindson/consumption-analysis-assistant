import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { connect } from 'react-redux'
import querystring from 'querystring'
import { replace } from 'react-router-redux'
import * as A from 'actions'
import { ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/CommonCard.styl'

export default class ListCard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    list: ImmutablePropTypes.list.isRequired,
    type: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      overflow: false,
      imageLoaded: Array(this.props.list.size).fill(false), // 判断图片是否加载完成
    }
    this.list = null
  }

  checkImageLoaded = () => {
    if (this.state.imageLoaded.includes(false)) {
      return false
    } else {
      this.setState({ overflow: this.list.scrollHeight > 200 })
      return true
    }
  }

  handleExpand = () => {
    this.setState({ expand: !this.state.expand })
  }
  handleClick = (id, type) => {
    this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
    this.props.dispatch({
      type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: true,
    })
  }
  handleImageLoaded = (index) => {
    const status = this.state.imageLoaded
    status[index] = true
    this.setState({ imageLoaded: status })
    this.checkImageLoaded()
  }

  render() {
    const { title, list, type } = this.props
    const { expand, overflow, imageLoaded } = this.state
    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="list" ref={node => this.list = node}>
          {list.toArray().map((l, i) => (
            <div
              id={type}
              key={i}
              className={classNames('item', type)}
              onClick={() => this.handleClick(l.get('id'), type)}
              style={{ visibility: imageLoaded.includes(false) }}
            >
              <img src={l.get('url')} alt="" onLoad={() => this.handleImageLoaded(i)} />
              <div className="name" title={l.get('text')}>{l.get('text')}</div>
            </div>
          ))}
        </div>
        {overflow ? (
          <div className="expand" onClick={this.handleExpand}>
            {expand ? <div><ArrowTop />收起</div> : <div><ArrowBottom />展开</div>}
          </div>) : null}
      </div>
    )
  }
}
