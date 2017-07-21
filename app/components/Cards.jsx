import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import 'style/Card.styl'
import { setHighLight, exitHighLight } from 'components/graph/highLightNode'
import NewsCards from 'components/cards/NewsCards'

export default class Cards extends React.Component {
  static propTypes = {
    data: ImmutablePropTypes.map.isRequired,
    type: PropTypes.string.isRequired,
  }

  handleHover = (id) => {
    setHighLight(id)
  }

  handleLeave = (id) => {
    exitHighLight(id)
  }

  render() {
    const { type, data } = this.props
    const size = {
      person: 5,
      store: 3,
      product: 3,
    }
    return (
      <div className="cards">
        {type === 'hot' ? <NewsCards wordList={data.get('keywords')} newsList={data.get('newsList')} /> : null}
      </div>
    )
  }
}
