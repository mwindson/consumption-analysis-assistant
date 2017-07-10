import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'style/Card.styl'

export default class Card extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }

  render() {
    const {title, type} = this.props
    return (
      <div>
        {type === 'intro' ? (<div className="intro">
            <div className="title">{title}</div>
            <div className="detail">
              <div className="img">
                image
              </div>
              <div className="text">
                这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本
              </div>
            </div>
          </div>
        ) : (
          <div className="related">
            <div className="title">{title}</div>
            <div className="list">
              <div className="item">
                <div className={classNames("img", type)}>
                  image
                </div>
                <div className="text">
                  这是文本
                </div>
              </div>
              <div className="item">
                <div className={classNames("img", type)}>
                  image
                </div>
                <div className="text">
                  这是文本
                </div>
              </div>
              <div className="item">
                <div className={classNames("img", type)}>
                  image
                </div>
                <div className="text">
                  这是文本
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
