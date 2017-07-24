import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import CommonCard from 'components/cards/CommonCard'
import ListCard from 'components/cards/ListCard'

export default class BrandKnowledgeTab extends React.Component {
  static propTypes = {
    cards: ImmutablePropTypes.list.isRequired,
    lists: ImmutablePropTypes.list.isRequired,
  }

  render() {
    const { cards, lists } = this.props
    return (
      <div className="cards">
        {cards.toArray().map((data, i) => (
          <CommonCard
            key={i}
            imgUrl={data.get('imgUrl')}
            title={data.get('title')}
            name={data.get('name')}
            content={data.get('text')}
            hasExpand
          />))}
        {lists.toArray().map((l, i) => (
          <ListCard
            key={i}
            title={l.get('title')}
            list={l.get('list')}
            type={l.get('type')}
          />))}
      </div>
    )
  }
}
