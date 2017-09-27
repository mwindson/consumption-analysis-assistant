import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Motion, spring } from 'react-motion'
import 'style/collapseButton.styl'

export default class CollapseButton extends React.Component {
  static propTypes = {
    contentList: ImmutablePropTypes.list.isRequired,
    itemClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      expand: false,
    }
  }

  handleButtonHover = () => {
    this.setState({ expand: true })
  }
  handleMouseOut = () => {
    setTimeout(() => this.setState({ expand: false }), 500)
  }
  handleItemClick = (id, type) => {
    this.setState({ expand: false })
    this.props.itemClick(id, type)
  }

  render() {
    const { contentList } = this.props
    const { expand } = this.state
    if (!expand) {
      return <div className="collapse-button" onMouseEnter={() => this.handleButtonHover()}>浏览记录</div>
    }
    return (
      <Motion style={{
        width: spring(expand ? 170 : 0),
        height: spring(expand ? (contentList.size) * 36 : 0),
        opacity: spring(expand ? 1 : 0),
      }}
      >
        {({ width, height, opacity }) => {
          if (contentList.size === 0) {
            return <div className="collapse-list" onMouseLeave={() => this.handleMouseOut()}>
              <div className="collapse-item">暂无历史记录</div>
            </div>
          } else {
            return (<div
              style={{ width, height, opacity }}
              className="collapse-list"
              onMouseLeave={() => this.handleMouseOut()}
            >
              {contentList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => this.handleItemClick(item.get('id'), item.get('type'))}
                  title={item.get('name')}
                  className="collapse-item"
                >{item.get('name')}</div>))}</div>)
          }
        }}
      </Motion>
    )
  }
}
