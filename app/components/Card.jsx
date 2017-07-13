import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'style/Card.styl'
import {highLightNode} from 'components/graph/highLightNode'

export default class Card extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    moreLink: PropTypes.func.isRequired,
  }

  handleHover = (event) => {
    event.stopPropagation()
    highLightNode(event.target.id)
  }

  render() {
    const {title, type, content} = this.props
    const size = {
      person: 5,
      store: 3,
      product: 3,
    }
    return (
      <div>
        {type === 'intro' ? (<div className="intro" id={type} onMouseOver={this.handleHover}>
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
          <div className="related" id={type}>
            <div className="title">
              {title}
              {content.length > size[type] ?
                <div className="more-link" onClick={() => this.props.moreLink(type)}>more</div> : null}
            </div>
            <div className="list">
              {content.map((item, i) => (
                i < size[type] ?
                  (<div key={i} className="item">
                      <div className={classNames("img", type)}>
                        <img src={item.url}/>
                      </div>
                      <div className="text">
                        {item.text}
                      </div>
                    </div>
                  ) : null
              ))}
            </div>
          </div>
        )
        }
      </div>
    )
  }
}
