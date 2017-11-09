import React from 'react'
import { Portal, PortalWithState } from 'react-portal'
import { Motion, spring, TransitionMotion } from 'react-motion'
import 'style/FloatLayer.styl'

class FloatLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  openPortal = () => {
    this.setState({ isOpen: true })
  }
  closePortal = () => {
    this.setState({ isOpen: false })
  }

  render() {
    const { isOpen } = this.state
    return [
      (!isOpen ?
        <div className="bookmark-open" onClick={this.openPortal}>
          浏览记录
        </div> : null),
      <Portal node={document && document.getElementById('left-part')}>
        <Motion style={{ x: spring(isOpen ? -280 : 0) }}>
          {({ x }) => (
            <div className="float-layer" style={{ transform: `translate(${x}px,0)` }}>
              <div className="top-part">
                <div className="keyword">{`搜索关键词：小米 `}</div>
                <div className="bookmark-close" onClick={this.closePortal}>收起</div>
              </div>
              <div className="list">
                <div className="item">小米11111111</div>
                <div className="item">小米222</div>
                <div className="item">小米3</div>
                <div className="item">小米444444444444</div>
                <div className="item">小米88888888</div>
                <div className="item">小米6666</div>
                <div className="item">小米777</div>
                <div className="item">小米</div>
                <div className="item">小米</div>
              </div>
            </div>
          )}
        </Motion>
      </Portal>,
    ]
  }
}

export default FloatLayer
