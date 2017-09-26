import React from 'react'
import { connect } from 'react-redux'
import { Map, Range, List, fromJS } from 'immutable'
import ListCard from 'components/cards/ListCard'
import 'style/ProductDetailTab.styl'

const mapStateToProps = state => state.reducer.toObject()

@connect(mapStateToProps)
export default class ProductDetailTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    let productDetail = List([
      Map({ key: '商品名称', value: cardData.get('name') }),
      Map({ key: '品牌', value: cardData.get('brand') }),
      Map({ key: '商品编号', value: cardData.get('sku') }),
      Map({ key: '来源', value: cardData.get('source') }),
      Map({ key: '链接', value: cardData.get('url') }),
    ])
    const main = cardData.get('spec')
      .filter(x => x.get('key') === '主体')
    if (!main.isEmpty()) {
      productDetail = productDetail.concat(main.first().get('value').filter(x => x.get('key') !== '品牌'))
    }
    const category = cardData.get('category')
    return (
      <div className="cards">
        <div className="product-card">
          <div className="title">商品信息</div>
          {productDetail.map((attr, index) => {
            return (<div key={index} className="attr">
              <div className="key">{attr.get('key')}</div>
              <div className="value">{attr.get('key') === '链接' ?
                <a href={attr.get('value')} target="_blank">京东页面</a> : attr.get('value')}
              </div>
            </div>)
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
