import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import 'style/Card.styl'
import {setHighLight, exitHighLight} from 'components/graph/highLightNode'

export default class Card extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    moreLink: PropTypes.func.isRequired,
  }

  handleHover = (id) => {
    setHighLight(id)
  }

  handleLeave = (id) => {
    exitHighLight(id)
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
        {type === 'intro' || type === 'company' || type === 'store_type' ? (
          <div className="intro" onMouseOver={() => this.handleHover(type)} onMouseLeave={() => this.handleLeave(type)}>
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
          <div className="related" onMouseOver={() => this.handleHover(type)}
               onMouseLeave={() => this.handleLeave(type)}>
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
