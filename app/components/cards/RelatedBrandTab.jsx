import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import * as A from 'actions'
import CommonCard from 'components/cards/CommonCard'
import textTruncated from 'utils/textTruncated'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class RelatedBrandCards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      num: 6,
      scrollTop: 0,
      loading: false,
    }
    this.cards = null
  }

  componentDidMount() {
    this.props.dispatch({ type: A.UPDATE_GRAPH_TYPE, graphType: 'Brand' })
    this.cards = document.getElementsByClassName('cards')[0]
    this.cards.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    this.cards.removeEventListener('scroll', this.onScroll)
    this.props.dispatch({ type: A.UPDATE_GRAPH_TYPE, graphType: 'all' })
  }

  onScroll = () => {
    // todo 加载动画
    const scrollTop = this.cards.scrollTop
    const scrollHeight = this.cards.scrollHeight
    const windowsHeight = this.cards.clientHeight
    if (scrollTop + windowsHeight === scrollHeight) {
      this.setState({ loading: true })
      setTimeout(() => {
        this.setState({ loading: false, num: this.state.num + 3 })
      }, 3000)
    }
  }

  render() {
    const { cardData } = this.props
    const { num } = this.state
    if (cardData.isEmpty()) {
      return (<div className="cards" />)
    }
    const brandList = cardData.map(i => Map({
      imgUrl: 'static/image/logo.png',
      name: i.get('name'),
      content: i.get('description'),
      attr: Map(),
    }))
    if (num > brandList.size) {
      this.cards.removeEventListener('scroll', this.onScroll)
    }
    return (
      <div className="cards">
        {brandList.slice(0, num > brandList.size ? brandList.size : num)
          .toArray().map((brand, i) =>
            (<CommonCard
              key={i}
              imgUrl={brand.get('imgUrl')}
              title={''}
              name={brand.get('name')}
              content={brand.get('content')}
              hasExpand={false}
              truncated={textTruncated(brand.get('content')).length > 120}
              attr={brand.get('attr')}
            />)
          )}
        {this.state.loading ?
          <div className="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div> : null}
      </div>
    )
  }
}
