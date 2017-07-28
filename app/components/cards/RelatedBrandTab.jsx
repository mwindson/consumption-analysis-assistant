import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { Map } from 'immutable'
import CommonCard from 'components/cards/CommonCard'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class RelatedBrandCards extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      num: 6,
      scrollTop: 0,
    }
    this.cards = null
  }

  componentDidMount() {
    this.cards = document.getElementsByClassName('cards')[0]
    this.cards.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    this.cards.removeEventListener('scroll', this.onScroll)
  }

  onScroll = () => {
    // todo 加载动画
    const scrollTop = this.cards.scrollTop
    const scrollHeight = this.cards.scrollHeight
    const windowsHeight = this.cards.clientHeight
    if (scrollTop + windowsHeight === scrollHeight) {
      this.setState({ num: this.state.num + 3 })
    }
  }

  render() {
    const { cardData } = this.props
    const { num } = this.state
    if (!cardData) {
      return (<div className="cards" />)
    }
    const brandList = cardData.map(i => Map({
      imgUrl: '',
      name: i.get('name'),
      content: i.get('description'),
    }))
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
            />)
          )}
      </div>
    )
  }
}
