import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'
import 'style/Feedback.styl'

export default class Feedback extends React.Component {

  handleSubmit = () => {
    // 提交反馈的信息
    // 关闭对话框
    const input = document.getElementById('input')
    console.log(input.value)
    this.props.closeFunc()
  }
  handleCancel = () => this.props.closeFunc()

  renderFeedback(y, opacity) {
    const { name } = this.props

    return (
      <div className="feedback-dialog" style={{ transform: `translate(0,${y}px)`, opacity }}>
        <div className="title">反馈问题</div>
        <div className="name">{name}</div>
        <div className="input">
          <div className="key">存在问题:</div>
          <textarea id="input" />
        </div>
        <div className="buttons">
          <div className="submit" onClick={() => this.handleSubmit()}>提交</div>
          <div className="cancel" onClick={() => this.handleCancel()}>取消</div>
        </div>
      </div>
    )
  }

  render() {
    const { expand } = this.props
    return (
      <div className={classNames('feedback', { expand: this.props.expand })}>
        <div className="mask" />
        <Motion style={{ y: spring(expand ? 100 : 0), opacity: spring(expand ? 1 : 0.5) }}>
          {({ y, opacity }) => this.renderFeedback(y, opacity)}
        </Motion>
      </div>
    )
  }
}

Feedback.propsTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  closeFunc: PropTypes.func,
  expand: PropTypes.bool,
}
