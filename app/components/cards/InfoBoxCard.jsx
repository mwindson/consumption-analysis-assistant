import React from 'react'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class InfoBoxCard extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty() || !cardData.get('infoBox')) {
      return (
        <div className="cards">
          <div className="product-card">暂无更多信息</div>
        </div>
      )
    }
    const infoBox = fromJS(cardData.get('infoBox'))

    return (
      <div className="cards">
        <div className="person-cards">
          <div className="person-content">
            <div className="person-attr">
              {infoBox.map((item, index) =>
                <div key={index} className="attr">{`${item.get('key')}：${item.get('value')}`}</div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
