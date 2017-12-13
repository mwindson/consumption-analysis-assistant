import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import 'style/InfoBoxCard.styl'

export default class InfoBoxCard extends React.Component {
  render() {
    const { name, infoBoxData } = this.props
    if (!infoBoxData || infoBoxData.isEmpty()) {
      return null
    }
    return (
      <div className="info-box-card">
        <div className="info-box-card_title">{name}</div>
        <div className="info-box-card_attrs">
          {infoBoxData.map((item, index) => (
            <div key={index} className="info-box-card_attr">
              <div className="info-box-card_key">{`${item.get('key')}`}</div>
              <div className="info-box-card_value">{`${item.get('value')}`}</div>
            </div>))}
        </div>
      </div>
    )
  }
}
InfoBoxCard.propTypes = {
  name: PropTypes.string.isRequired,
  infoBoxData: ImmutablePropTypes.list.isRequired,
}

