import React from 'react'
import { connect } from 'react-redux'
import { Map, Range, List } from 'immutable'
import ListCard from 'components/cards/ListCard'
import config from 'utils/config.yaml'
import 'style/ProductDetailTab.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class ProductDetailTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    const productDetail = Map({
      name: cardData.get('name'),
      brand: cardData.get('brand'),
      category: cardData.get('category'),
      description: cardData.get('description'),
      sku: cardData.get('sku'),
      source: cardData.get('source'),
      url: cardData.get('url'),
      optional: cardData.get('optional'),
    })
    const category = cardData.get('category')
    const lists = Map({
      title: '相关商品',
      list: List(),
      type: 'Poduct',
    })
    return (
      <div className="cards">
        <div className="product-card">
          <div className="title">商品信息</div>
          {productDetail.entrySeq().map((attr, index) => {
            if (attr[0] !== 'category' && attr[0] !== 'optional' && attr[1] && attr[1].length !== 0) {
              return (<div key={index} className="attr">
                <div className="key">{config.nameMap[attr[0]]}</div>
                <div className="value">{attr[0] === 'url' ?
                  <a href={attr[1]} target="_blank">京东页面</a> : attr[1]} </div>
              </div>)
            } else if (attr[0] === 'category') {
              return (<div key={index} className="attr">
                <div className="key">类别</div>
                <div className="value">{attr[1].join('、')}</div>
              </div>)
            } else if (attr[0] === 'optional' && attr[1].size !== 0) {
              return (<div key={index} className="attr">
                <div className="key">其他</div>
                <div className="value">{attr[1].entrySeq().map((v, i) =>
                  <div key={i} className="other">{`${v[0]}: ${v[1]}`}</div>)}
                </div>
              </div>)
            }
          })}
        </div>
        <div className="product-card">
          <div className="title">商品类别</div>
          <div className="category">一级类别：
            <div className="tag">{category.get(0)}</div>
          </div>
          <div className="category">二级类别：
            <div className="tag">{category.get(1)}</div>
          </div>
          <div className="category">商品标签：
            {Range(0, category.size).map(i => <div key={i} className="tag">{category.get(i)}</div>)}
          </div>
        </div>
        <ListCard
          title={'相关商品'}
          list={List()}
          type={'Product'}
        />
      </div>
    )
  }
}
