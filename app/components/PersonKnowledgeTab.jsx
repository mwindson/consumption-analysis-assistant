import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import addSourceHoc from 'hoc/addSourceHoc'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
@addSourceHoc
export default class PersonKnowledgeTab extends React.Component {
  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    const personKnowledge = Map({
      image: cardData.get('image'),
      name: cardData.get('name'),
      attr: fromJS(cardData.get('infoBox')),
    })
    return (
      <div className="person-cards">
        <div className="title">人物介绍</div>
        <div className="person-content">
          {personKnowledge.get('image') ? <img src={personKnowledge.get('image')} alt="" /> : null}
          <div className="person-name">{personKnowledge.get('name')}</div>
          {personKnowledge.get('attr') ?
            <div className="person-attr">
              {personKnowledge.get('attr').map((item, index) =>
                (<div key={index} className="attr">
                  <div className="key">{item.get('key')}</div>
                  <div className="value">{item.get('value')}</div>
                 </div>))}
            </div>
            : null}
        </div>
      </div>
    )
  }
}
