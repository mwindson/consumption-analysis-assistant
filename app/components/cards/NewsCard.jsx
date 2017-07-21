import React from 'react'
import PropTypes from 'prop-types'
import { arrowRight } from 'components/Icons'

export default class NewsCard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }

  render() {
    const { title, imgUrl, content } = this.props
    return (
      <div className="card">
        <div className="title">{title}</div>
        <div className="content">
          <img src={imgUrl} alt="图片" />
          <div className="news-text">{content}</div>
        </div>
        <div className="news-link" onClick={() => null}>{arrowRight}阅读全文</div>
      </div>
    )
  }
}
