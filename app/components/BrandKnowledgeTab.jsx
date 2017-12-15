/* eslint-disable quote-props */
import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import ListCard from 'components/cards/ListCard'
import textTruncated from 'utils/textTruncated'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class BrandKnowledgeTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (!cardData || cardData.isEmpty()) {
      return null
    }
    let cards = List()
    if (cardData.get('brand')) {
      const brand = Map({
        title: '品牌信息',
        imgUrl: cardData.get('brand').get('image'),
        name: cardData.get('brand').get('name'),
        desc: cardData.get('brand').get('description'),
        attr: Map(),
      })
      cards = cards.push(brand)
    }
    if (cardData.get('weibo')) {
      const weiboData = cardData.get('weibo')
      const weibo = fromJS({
        title: '微博信息',
        imgUrl: weiboData.get('image'),
        name: weiboData.get('name'),
        desc: weiboData.get('description'),
        attr: [
          { key: '粉丝', value: weiboData.get('followersCount') },
          { key: '关注数', value: weiboData.get('followCount') },
          { key: '认证原因', value: weiboData.get('verifiedReason') },
          { key: '微博地址', value: weiboData.get('url') },
        ],
      })
      cards = cards.push(weibo)
    }
    let lists = List([])
    if (cardData.get('persons')) {
      const persons = Map({
        title: '相关人物',
        list: cardData.get('persons').map(i => Map({
          url: i.get('image') || 'app/static/image/no_picture.jpg',
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
          url: i.get('image') || 'app/static/image/no_picture.jpg',
          text: i.get('name'),
          id: i.get('id'),
        })),
        type: 'Product',
      })
      lists = lists.push(product)
    }
    return [
      cards.toArray().map((data, i) => (
        <CommonCard
          key={i}
          imgUrl={data.get('imgUrl')}
          title={data.get('title')}
          name={data.get('name')}
          content={data.get('desc')}
          attr={data.get('attr')}
          hasExpand
          truncated={data.get('title') === '微博信息' ? false : textTruncated(data.get('desc')).length > 120}
        />)),
      lists.toArray().map((l, i) => (
        <ListCard
          key={i}
          title={l.get('title')}
          list={l.get('list')}
          type={l.get('type')}
        />)),
    ]
  }
}
