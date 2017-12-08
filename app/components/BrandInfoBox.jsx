import React from 'react'
import { fromJS } from 'immutable'
import InfoBoxCard from 'components/cards/InfoBoxCard'
import { connect } from 'react-redux'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class BrandInfoBox extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty() || !cardData.get('infoBox')) {
      return (
        <div className="product-card">暂无更多信息</div>
      )
    }
    const infoBox = fromJS(cardData.get('infoBox'))
    const qxInfoBox = fromJS((cardData.get('qxInfoBox')))

    return [<InfoBoxCard name={'品牌信息'} infoBoxData={infoBox} />, <InfoBoxCard name={'启信宝信息'} infoBoxData={qxInfoBox} />]
  }
}

