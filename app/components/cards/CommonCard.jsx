import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/CommonCard.styl'

export default class CommonCard extends React.Component {
  static propTypes = {
    imgUrl: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    hasExpand: PropTypes.bool.isRequired,
  }

  state = {
    expand: false,
    truncated: this.props.content.length >= 120,
  }

  handleExpand = () => {
    // todo 关系图需要以该类变换
    // this.setState({ truncated: !this.state.truncated })
    this.setState({ expand: !this.state.expand })
  }

  handleTextTruncate = (text) => text.length >= 120 ? `${text.toString().substr(0, 120)}...` : text

  render() {
    const { title, imgUrl, name, content, hasExpand } = this.props
    const { expand, truncated } = this.state
    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="content">
          <img src={imgUrl} alt={name} />
          <div className="intro">
            <div className="name">{name}</div>
            <div className="text">
              {expand ? content : this.handleTextTruncate(content)}
            </div>
          </div>
        </div>
        {hasExpand && truncated ?
          <div className="expand" onClick={this.handleExpand}>
            {expand ? <div><ArrowTop />收起</div> : <div><ArrowBottom />展开</div>}
          </div> : null}
      </div>
    )
  }
}
