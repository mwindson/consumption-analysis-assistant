import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { replace, push } from 'react-router-redux'
import querystring from 'querystring'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import * as A from 'actions'
import CommonCard from 'components/cards/CommonCard'
import textTruncated from 'utils/textTruncated'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class RelatedBrandTab extends React.Component {

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
    // this.props.dispatch({ type: A.UPDATE_GRAPH_TYPE, graphType: 'Brand' })
    this.cards = document.getElementsByClassName('cards')[0]
    this.cards.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    this.cards.removeEventListener('scroll', this.onScroll)
    // this.props.dispatch({ type: A.UPDATE_GRAPH_TYPE, graphType: 'all' })
  }

  onScroll = () => {
    const scrollTop = this.cards.scrollTop
    const scrollHeight = this.cards.scrollHeight
    const windowsHeight = this.cards.clientHeight
    if (scrollTop + windowsHeight === scrollHeight) {
      this.setState({ loading: true })
      setTimeout(() => {
        this.setState({ loading: false, num: this.state.num + 3 })
      }, 1500)
    }
  }

  relatedBrandClick = (id, type) => {
    this.props.dispatch(push(`?${querystring.stringify({ type, id })}`))
  }

  render() {
    const { cardData } = this.props
    const { num } = this.state
    if (cardData.isEmpty()) {
      return (<div className="cards" />)
    }
    const brandList = cardData.map(i => Map({
      imgUrl: i.get('image') !== '' ? i.get('image') : 'app/static/image/logo.png',
      id: i.get('id'),
      type: i.get('type').last(),
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
            (<div key={i} Fstyle={{ cursor: 'pointer' }} onClick={() => this.relatedBrandClick(brand.get('id'), brand.get('type'))}>
              <CommonCard
                imgUrl={brand.get('imgUrl')}
                title={''}
                name={brand.get('name')}
                content={brand.get('content')}
                hasExpand={false}
                truncated={textTruncated(brand.get('content')).length > 120}
                attr={brand.get('attr')}
              /></div>),
        )}
        {this.state.loading ?
          <div className="loading">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div> : null}
      </div>
    )
  }
}
