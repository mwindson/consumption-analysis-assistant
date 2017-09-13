import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import textTruncated from 'utils/textTruncated'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class PersonKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    let cards = List()
    const company = Map({
      title: '人物简介',
      imgUrl: 'app/static/image/company.png',
      name: cardData.get('name'),
      desc: cardData.get('description'),
      attr: cardData.get('optional').sortBy(x => x.length),
    })
    cards = cards.push(company)
    return (
      <div className="cards">
        {cards.toArray().map((data, i) => (
          <CommonCard
            key={i}
            imgUrl={data.get('imgUrl')}
            title={data.get('title')}
            name={data.get('name')}
            content={data.get('desc')}
            attr={data.get('attr')}
            hasExpand
            truncated={textTruncated(data.get('desc')).length > 120}
          />))}
      </div>
    )
  }
}
