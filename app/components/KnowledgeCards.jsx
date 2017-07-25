import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, Map } from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NewsCards from 'components/cards/NewsTab'
import BrandTrendCards from 'components/cards/BrandTrendTab'
import RelatedBrandCards from 'components/cards/RelatedBrandTab'
import * as A from 'actions'
import 'style/KnowledgeCards.styl'
import BrandKnowledgeTab from './cards/BrandKnowledgeTab'

const mapStateToProps = state => state.toJS()

@connect(mapStateToProps)
export default class KnowledgeCards extends React.Component {
  // todo react-redux 有bug
  // static propTypes = {
  //   cardData: PropTypes.object.isRequired,
  //   // callback
  //   dispatch: PropTypes.func.isRequired,
  // }
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
        {chosen === 'hot' ?
          <NewsCards
            wordList={fromJS(cardData[chosen]).get('keywords')}
            newsList={fromJS(cardData[chosen]).get('newsList')}
          /> : null}
        {chosen === 'trend' ?
          <BrandTrendCards
            comments={fromJS(cardData[chosen]).get('comments')}
            emotion={fromJS(cardData[chosen]).get('emotion')}
            trendData={fromJS(cardData[chosen]).get('trend')}
          /> : null}
        {chosen === 'related' ? <RelatedBrandCards brandList={fromJS(cardData[chosen])} /> : null}
        {chosen === 'knowledge' ?
          <BrandKnowledgeTab
            cards={fromJS(cardData[chosen]).get('cards')}
            lists={fromJS(cardData[chosen]).get('lists')}
          /> : null}
      </div>
    )
  }
}
