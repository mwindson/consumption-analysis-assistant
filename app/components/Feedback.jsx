import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import classNames from 'classnames'
import 'style/Feedback.styl'

export default class Feedback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      hint: '',
    }
  }

  handleInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  handleSubmit = () => {
    // 提交反馈的信息POST给服务器
    // 关闭对话框
    const { name, id, type } = this.props
    const input = document.getElementById('input').value
    if (input.length !== 0) {
      console.log(input)
      console.log({ id, name, content: input, type })
      this.submitMessage({ id, name, content: input, type })
    } else {
      alert('请输入内容')
    }
  }
  handleCancel = () => {
    this.props.closeFunc()
    this.setState({ hint: '' })
  }
  submitMessage = async (opts) => {
    const url = 'http://10.214.208.50:9001/feedback/submit'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      })
      if (response.ok) {
        this.setState({ hint: '提交成功,即将关闭' })
        setTimeout(() => {
          this.props.closeFunc()
          this.setState({ input: '', hint: '' })
        }, 1000)
      } else {
        this.setState({ hint: '提交失败，请稍后再试' })
      }
    } catch (e) {
      console.log(e)
    }
  }
  renderFeedback(y, opacity) {
    const { name } = this.props
    const { input, hint } = this.state

    return (
      <div className="feedback-dialog" style={{ transform: `translate(0,${y}px)`, opacity }}>
        <div className="title">反馈问题</div>
        <div className="name">{name}</div>
        <div className="input">
          <div className="key">存在问题:</div>
          <textarea id="input" onChange={e => this.handleInputChange(e)} value={input} />
        </div>
        <div className="buttons">
          <div className="stage">{hint}</div>
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  closeFunc: PropTypes.func.isRequired,
  expand: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
}
