import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import CommonCard from 'components/cards/CommonCard'

export default class RelatedBrandCards extends React.Component {
  static propTypes = {
    brandList: ImmutablePropTypes.list.isRequired,
  }

  render() {
    return (
      <div className="cards">
        {this.props.brandList.toArray().map((brand, i) =>
          (<CommonCard
            key={i}
            imgUrl={brand.get('imgUrl')}
            title={''}
            name={brand.get('name')}
            content={brand.get('content')}
            hasExpand={false}
          />)
        )}
      </div>
    )
  }
}
