import React from 'react'
import { fromJS, List } from 'immutable'
import { connect } from 'react-redux'
import 'style/PersonStoryTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class DetailCard extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty() || !cardData.get('detail')) {
      return (
        <div className="cards">
          <div className="product-card">暂无更多信息</div>
        </div>
      )
    }
    const detail = fromJS(cardData.get('detail'))
    const splitDetail = (textMap) => (
      textMap.map((item, index) =>
        (<div key={index} className="story">
          <h3>{item.get('key')}</h3>
          {!List.isList(item.get('value')) ? fromJS(item.get('value').split('\u2764')).map((d, i) =>
            (<div key={i}>
              <div className="text">{d}</div>
            </div>)) : splitDetail(item.get('value'))}
        </div>))
    )
    return (
      <div className="cards">
        <div className="person-cards">
          {cardData.get('description') && cardData.get('description') !== '' ?
            <div className="story">
              {fromJS(cardData.get('description').split('\u2764')).map((d, i) =>
                (<div key={i}>
                  <div className="text">{d}</div>
                </div>))}
            </div> : null}
          {splitDetail(detail)}
        </div>
      </div>
    )
  }
}
