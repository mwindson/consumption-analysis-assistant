import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/CommonCard.styl'

export default class ListCard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    list: ImmutablePropTypes.list.isRequired,
    type: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      expand: false,
      itemNum: this.props.list.size,
    }
  }


  componentDidMount() {
    this.setItemNum()
    window.addEventListener('resize', this.setItemNum)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setItemNum)
  }

  setItemNum = () => {
    const width = document.querySelector('.list').clientWidth
    const itemWidth = document.querySelector(`div.item.${this.props.type}`).clientWidth + 30
    this.setState({ itemNum: Math.floor(width / itemWidth) })
  }


  handleExpand = () => {
    // todo 关系图需要以该类变换
    // this.setState({ truncated: !this.state.truncated })
    this.setState({ expand: !this.state.expand })
    // todo 增加动画
  }

  render() {
    const { title, list, type } = this.props
    const { expand, itemNum } = this.state

    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="list">
          {(expand ? list : list.slice(0, itemNum)).toArray().map((l, i) => (
            <div id={type} key={i} className={classNames('item', type)}>
              <img src={l.get('url')} alt={l.get('text')} />
              <div className="name">{l.get('text')}</div>
            </div>
          ))}
        </div>
        {list.size > itemNum ?
          <div className="expand" onClick={this.handleExpand}>
            {expand ? <div><ArrowTop />收起</div> : <div><ArrowBottom />展开</div>}
          </div> : null}
      </div>
    )
  }
}
