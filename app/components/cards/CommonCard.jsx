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
    truncated: PropTypes.bool.isRequired,
  }

  state = {
    expand: !this.props.truncated,
  }

  handleExpand = () => {
    // todo 关系图需要以该类变换
    // this.setState({ truncated: !this.state.truncated })
    this.setState({ expand: !this.state.expand })
  }

  render() {
    const { title, imgUrl, name, content, hasExpand, truncated } = this.props
    const { expand } = this.state
    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="content">
          <img src={imgUrl} alt={name} />
          <div className="intro">
            <div className="name">{name}</div>
            <div className={classNames('text', { truncated: expand })}>
              <div id="text" dangerouslySetInnerHTML={{ __html: content }} />
              {/* {expand ? content : this.handleTextTruncate(content)}*/}
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
