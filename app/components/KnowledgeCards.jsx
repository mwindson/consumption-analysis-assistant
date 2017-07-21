import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, Map } from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Cards from 'components/Cards'
import * as A from 'actions'
import 'style/KnowledgeCards.styl'

const mapStateToProps = state => state.toJS()

@connect(mapStateToProps)
export default class KnowledgeCards extends React.Component {
  static propTypes = {
    cardData: PropTypes.object.isRequired,
    // callback
    dispatch: PropTypes.func.isRequired,
  }
  state = {
    chosen: 'knowledge',
  }

  componentDidMount() {
    this.props.dispatch({ type: A.FETCH_CARD_DATA })
  }

  handleClick = (tab) => {
    this.setState({ chosen: tab })
  }

  render() {
    const tabMap = Map({
      knowledge: '品牌知识',
      hot: '热点聚焦',
      trend: '品牌动态',
      related: '相关品牌',
    })
    const { chosen } = this.state
    const { cardData } = this.props
    if (fromJS(cardData).isEmpty()) {
      return null
    }
    return (
      <div className="knowledge-cards">
        <div className="tabs-part">
          {fromJS(cardData).keySeq().map((k, i) => (
            <div
              key={i}
              className={classNames('tab', { chosen: chosen === k })}
              onClick={() => this.handleClick(k)}
            >
              {tabMap.get(k)}
            </div>))}
        </div>
        <Cards data={fromJS(cardData[chosen])} type={chosen} />
      </div>
    )
  }
}
