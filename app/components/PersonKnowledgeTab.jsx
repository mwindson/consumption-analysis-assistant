import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.reducer.toObject()

@connect(mapStateToProps)
export default class PersonKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    const infoBox = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box')
    const person = Map({
      title: '人物简介',
      imgUrl: cardData.get('image'),
      name: cardData.get('name'),
      desc: cardData.get('description'),
      attr: infoBox.isEmpty() ? null : infoBox.first().get('value'),
    })
    return (
      <div className="cards">
        <div className="person-cards">
          <div className="title">人物介绍</div>
          <div className="person-content">
            <img src={person.get('imgUrl')} />
            <div className="person-name">{person.get('name')}</div>
            {person.get('attr') ?
              <div className="person-attr">
                {person.get('attr').map((item, index) =>
                  <div key={index} className="attr">{`${item.get('key')}：${item.get('value')}`}</div>)}
              </div>
              : null}
          </div>
        </div>
      </div>
    )
  }
}
