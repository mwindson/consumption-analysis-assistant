import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import 'style/PersonStoryTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
export default class PersonKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    const detail = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'detail')
    if (!cardData.get('optional') || detail.isEmpty()) {
      return (
        <div className="cards">
          <div className="product-card">暂无更多信息</div>
        </div>
      )
    }
    const personStory = detail.first().get('value')
    return (
      <div className="cards">
        <div className="person-cards">
          {cardData.get('description') && cardData.get('description') !== '' ?
            <div className="story">
              <div className="text">{cardData.get('description')}</div>
            </div> : null}
          {personStory.map((item, index) =>
            (<div key={index} className="story">
              <h3>{item.get('key')}</h3>
              {List.isList(item.get('value')) ?
                item.get('value').map((d, i) =>
                  <div key={i}>
                    <h4>{d.get('key')}</h4>
                    <div className="text">{d.get('value')}</div>
                  </div>)
                : <div className="text">{item.get('value')}</div>
              }
            </div>))
          }
        </div>
      </div>
    )
  }
}
