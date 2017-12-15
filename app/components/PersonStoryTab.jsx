import React from 'react'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import 'style/StoryTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class PersonStoryTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (cardData.isEmpty() || !cardData.get('detail')) {
      return (
        <div className="product-card">暂无更多信息</div>
      )
    }
    const personStory = fromJS(cardData.get('detail'))
    return (
      <div className="person-cards">
        {cardData.get('description') && cardData.get('description') !== '' ?
          <div className="story">
            {fromJS(cardData.get('description').split('\u2764')).map((d, i) =>
              (<div key={i}>
                <div className="text">{d}</div>
              </div>))}
          </div> : null}
        {personStory.map((item, index) =>
          (<div key={index} className="story">
            <h3>{item.get('key')}</h3>
            {fromJS(item.get('value').split('\u2764')).map((d, i) =>
              (<div key={i}>
                <div className="text">{d}</div>
              </div>))}
          </div>))
        }
      </div>
    )
  }
}
