/* eslint-disable quote-props */
import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import ListCard from 'components/cards/ListCard'
import textTruncated from 'utils/textTruncated'

const mapStateToProps = state => state.reducer.toObject()

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
        imgUrl: cardData.get('brand').get('image'),
        name: cardData.get('brand').get('name'),
        desc: cardData.get('brand').get('description'),
        attr: Map(),
      })
      cards = cards.push(brand)
    }
    const companyKeys = {
      address: '公司地址',
      email: '官网',
      icp: '网站备案号',
      website: '官网',
      telephone: '联系方式',
      wechat: '微信公众号',
    }
    if (cardData.get('company')) {
      let company = Map({
        title: titles.company,
        imgUrl: cardData.get('company').get('image'),
        name: cardData.get('company').get('name'),
        desc: '',
        attr: Map({
          '公司地址': cardData.get('company').get('address'),
          '官网': cardData.get('company').get('officialWebsite'),
          '联系方式': cardData.get('company').get('telephone'),
          '邮箱': cardData.get('company').get('email'),
        }),
      })
      if (cardData.get('company').get('optional')) {
        cardData.get('company').get('optional').forEach((item) => {
          if (typeof item.get('value') === 'string') {
            company = company.set('attr', company.get('attr').set(item.get('key'), item.get('value')))
          }
        })
      }
      cards = cards.push(company)
    }
    let lists = List([])
    if (cardData.get('persons')) {
      const persons = Map({
        title: '相关人物',
        list: cardData.get('persons').map(i => Map({
          url: i.get('image'),
          text: i.get('name'),
          id: i.get('id'),
        })),
        type: 'Person',
      })
      lists = lists.push(persons)
    }
    if (cardData.get('products')) {
      const product = Map({
        title: '相关商品',
        list: cardData.get('products').map(i => Map({
          url: 'app/static/image/product1.png',
          text: i.get('name'),
          id: i.get('id'),
        })),
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
