import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'style/Card.styl'

export default class Card extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
  }

  render() {
    const {title, type, content} = this.props
    return (
      <div>
        {type === 'intro' ? (<div className="intro">
            <div className="title">{title}</div>
            <div className="detail">
              <div className="img">
                <img src={content[0].url}/>
              </div>
              <div className="text">
                {content[0].text}
              </div>
            </div>
          </div>
        ) : (
          <div className="related">
            <div className="title">{title}</div>
            <div className="list">
              {content.map((item, i) => (
                <div key={i} className="item">
                  <div className={classNames("img", type)}>
                    <img src={item.url}/>
                  </div>
                  <div className="text">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        }
      </div>
    )
  }
}
