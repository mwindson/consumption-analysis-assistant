import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import ListCard from 'components/cards/ListCard'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class BrandKnowledgeTab extends React.Component {

  render() {
    const titles = {
      company: '企业信息',
      brand: '品牌信息',
      persons: '相关人物',
    }
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    let cards = List()
    const brand = Map({
      title: titles.brand,
      imgUrl: '',
      name: cardData.get('brand').get('name'),
      desc: cardData.get('brand').get('description'),
    })
    cards = cards.push(brand)
    if (cardData.get('company')) {
      const company = Map({
        title: titles.company,
        imgUrl: '',
        name: cardData.get('company').get('name'),
        desc: '',
      })
      cards = cards.push(company)
    }
    const lists = List([Map({
      title: '相关人物',
      list: cardData.get('persons').map(i => Map({ url: '', text: i.get('name') })),
      type: 'Person',
    })])
    return (
      <div className="cards">
        {cards.toArray().map((data, i) => (
          <CommonCard
            key={i}
            imgUrl={data.get('imgUrl')}
            title={data.get('title')}
            name={data.get('name')}
            content={data.get('desc')}
            hasExpand
          />))}
        {lists.toArray().map((l, i) => (
          <ListCard
            key={i}
            title={l.get('title')}
            list={l.get('list')}
            type={l.get('type')}
          />))}
      </div>
    )
  }
}
