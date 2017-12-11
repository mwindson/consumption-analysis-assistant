import React from 'react'
import { fromJS, List } from 'immutable'
import InfoBoxCard from 'components/cards/InfoBoxCard'
import { connect } from 'react-redux'
import addSourceHoc from 'hoc/addSourceHoc'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
@addSourceHoc
export default class BrandInfoBox extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty() || !cardData.get('infoBox')) {
      return (
        <div className="product-card">暂无更多信息</div>
      )
    }
    const infoBox = fromJS(cardData.get('infoBox'))
    const qxInfoBox = fromJS((cardData.get('qxInfoBox'))) || List()

    return [
      <InfoBoxCard name={'品牌信息'} infoBoxData={infoBox} key={'0'} />,
      <InfoBoxCard name={'启信宝信息'} infoBoxData={qxInfoBox} key={'1'} />,
    ]
  }
}
