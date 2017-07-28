import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { connect } from 'react-redux'
import * as A from 'actions'
import { ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/CommonCard.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
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

  componentWillReceiveProps(nextProps) {
    // 其他页面展开或变更中心点时收起
    if (nextProps.graphType === 'all' || nextProps.graphType !== this.props.type) {
      if (this.state.expand) this.setState({ expand: false })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setItemNum)
  }

  setItemNum = () => {
    const width = document.querySelector('.list').clientWidth
    const itemWidth = document.querySelector(`div.item.${this.props.type}`).clientWidth + 30
    this.setState({ itemNum: Math.floor(width / itemWidth) })
  }

  // todo 关系图需要以该类变换
  handleExpand = () => {
    // todo 增加动画
    const { dispatch, type } = this.props
    this.setState({ expand: !this.state.expand })
    dispatch({ type: A.UPDATE_GRAPH_TYPE, graphType: this.state.expand ? 'all' : type })
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
        {/*{list.size > itemNum ?*/}
          <div className="expand" onClick={this.handleExpand}>
            {expand ? <div><ArrowTop />收起</div> : <div><ArrowBottom />展开</div>}
          </div>
        {/*{: null}*/}
      </div>
    )
  }
}
