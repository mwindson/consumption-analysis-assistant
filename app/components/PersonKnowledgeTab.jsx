import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class PersonKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    const optional = [
      {
        key: 'info_box',
        value: [
          {
            key: '职务',
            value: '董事长',
          },
          {
            key: '性别',
            value: '男',
          },
        ],
      }]
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
          <div className="person-content">
            <div className="person-intro">
              <div className="person-name">{person.get('name')}</div>
              <div className="person-text">{person.get('desc')}</div>
            </div>
            <img src={person.get('imgUrl')} alt={person.get('name')} />
          </div>
          {person.get('attr') ?
            <div className="person-attr">
              {person.get('attr').map((item, index) =>
                <div key={index} className="attr">
                  <div className="key">{item.get('key')}</div>
                  <div className="value">{item.get('value')}</div>
                </div>)}
            </div>
            : null}
        </div>
      </div>
    )
  }
}
