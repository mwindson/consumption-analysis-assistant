import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import 'style/ProductSpecTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class ProductSpecTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    // 商品规格与参数
    let productSpec = List()
    const spec = cardData.get('spec')
    spec.forEach((s) => {
      if (s.get('key') !== '主体') {
        productSpec = productSpec.push(s)
      }
    })
    if (productSpec.isEmpty()) {
      return (
        <div className="product-card">暂无更多信息</div>
      )
    }
    return [
      productSpec.map((item, index) =>
        (<div key={index} className="product-card">
          <div className="title">{item.get('key')}</div>
          {item.get('value').map((attr, i) =>
            (<div key={i} className="model">
              <div className="key">{attr.get('key')}</div>
              <div className="value">{attr.get('value')}</div>
            </div>))}
        </div>)),
    ]
  }
}
