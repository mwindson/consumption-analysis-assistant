import React from 'react'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class WeiboCard extends React.Component {
  render() {
    const { cardData } = this.props
    if (!cardData || cardData.isEmpty()) {
      return <div className="product-card">暂无更多信息</div>
    }
    const weiboAttr = fromJS([
      { key: '粉丝', value: cardData.get('followersCount') },
      { key: '关注数', value: cardData.get('followCount') },
      { key: '认证原因', value: cardData.get('verifiedReason') },
      { key: '链接', value: cardData.get('url') },
    ])
    return (
      <CommonCard
        imgUrl={cardData.get('image')}
        name={cardData.get('name')}
        content={cardData.get('description')}
        attr={weiboAttr}
        hasExpand
      />)
  }
}
