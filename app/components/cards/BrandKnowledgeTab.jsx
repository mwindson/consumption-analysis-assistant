import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import ListCard from 'components/cards/ListCard'
import textTruncated from 'utils/textTruncated'

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
    if (cardData.get('brand')) {
      const brand = Map({
        title: titles.brand,
        imgUrl: 'static/image/logo.png',
        name: cardData.get('brand').get('name'),
        desc: cardData.get('brand').get('description'),
        attr: Map(),
      })
      cards = cards.push(brand)
    }
    if (cardData.get('company')) {
      const company = Map({
        title: titles.company,
        imgUrl: 'static/image/company.png',
        name: cardData.get('company').get('name'),
        desc: '',
        attr: Map({
          address: cardData.get('company').get('address'),
          wechat: cardData.get('company').get('wechat').get('value'),
          website: cardData.get('company').get('officialWebsite'),
          telephone: cardData.get('company').get('telephone'),
          email: cardData.get('company').get('email'),
          icp: cardData.get('company').get('icp').get('value'),
        }),
      })
      cards = cards.push(company)
    }
    let lists = List([Map({
      title: '相关人物',
      list: cardData.get('persons').map(i => Map({ url: 'static/image/person1.png', text: i.get('name') })),
      type: 'Person',
    })])
    if (cardData.get('products')) {
      const product = Map({
        title: '相关商品',
        list: cardData.get('products').map(i => Map({ url: 'static/image/product1.png', text: i.get('name') })),
        type: 'Product',
      })
      lists = lists.push(product)
    }
    return (
      <div className="cards">
        {cards.toArray().map((data, i) => (
          <CommonCard
            key={i}
            imgUrl={data.get('imgUrl')}
            title={data.get('title')}
            name={data.get('name')}
            content={data.get('desc')}
            attr={data.get('attr')}
            hasExpand
            truncated={textTruncated(data.get('desc')).length > 120}
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
