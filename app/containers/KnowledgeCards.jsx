import React from 'react'
import PropTypes from 'prop-types'
import { fromJS, Map, Range } from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import NewsCards from 'components/NewsTab'
import BrandTrendCards from 'components/BrandTrendTab'
import RelatedBrandCards from 'components/RelatedBrandTab'
import PersonKnowledgeTab from 'components/PersonKnowledgeTab'
import * as A from 'actions'
import 'style/KnowledgeCards.styl'
import BrandKnowledgeTab from 'components/BrandKnowledgeTab'
import ProductDetailTab from 'components/ProductDetailTab'
import config from '../utils/config.yaml'

const data = {
  hot: {
    keywords: ['关键词1', '关键词2', '关键词3', '关键词4', '关键词5', '关键词6', '关键词7', '关键词8', '关键词9'],
    newsList: [
      {
        title: '香奈儿最新事件',
        content: '当时,老佛爷Karl Lagerfeld把香奈儿2016年早春度假系列的96款服装发布第一次放到了首尔。同期宣... 香奈儿韩国市场权志龙朴信惠 香奈儿2016/17“巴黎大都会”高级..',
        img: '.',
        url: 'http://www.baidu.com',
        keywords: ['关键词1'],
      },
      {
        title: 'channel news 最新时尚资讯1',
        content: '在首尔举办的Mademoiselle Privé展览上,呈现了嘉柏丽尔·香奈儿于1932年创作的“Bijoux de Diamants”钻石珠宝系列。当年,她在系列首次展出的媒体宣传稿中写道: “对...',
        img: '.',
        url: 'http://www.baidu.com',
        keywords: ['关键词1', '关键词2'],
      },
      {
        title: 'channel news 最新时尚资讯2',
        content: '在首尔举办的Mademoiselle Privé展览上,呈现了嘉柏丽尔·香奈儿于1932年创作的“Bijoux de Diamants”钻石珠宝系列。当年,她在系列首次展出的媒体宣传稿中写道: “对...',
        img: '.',
        url: 'http://www.baidu.com',
        keywords: ['关键词3'],
      },
    ],
  },
  trend: {
    trend: [
      { name: '星期一', s1: 4000, s2: 2400 },
      { name: '星期二', s1: 3000, s2: 1398 },
      { name: '星期三', s1: 2000, s2: 9800 },
      { name: '星期四', s1: 2780, s2: 3908 },
      { name: '星期五', s1: 1890, s2: 4800 },
      { name: '星期六', s1: 2390, s2: 3800 },
      { name: '星期日', s1: 3490, s2: 4300 },
    ],
    emotion: 0.3,
    comments: [
      { headImg: '.', nickname: 'Leo 金融业 32岁', content: '这里是评论这里是评论这里是评论这里是评论这里是评论这里是评论' },
      { headImg: '.', nickname: 'Kevin 自由业 25岁', content: '这里是评论这里是评论这里是评论这里是评论这里是评论这里是评论' },
      { headImg: '.', nickname: 'Aaron IT业 29岁', content: '这里是评论这里是评论这里是评论这里是评论这里是评论这里是评论' },
      { headImg: '.', nickname: 'Kate 学生 32岁', content: '这里是评论这里是评论这里是评论这里是评论这里是评论这里是评论' },
    ],
  },
}

const mapStateToProps = state => state.toJS()

@connect(mapStateToProps)
export default class KnowledgeCards extends React.Component {
  // todo react-redux 有bug
  // static propTypes = {
  //   tab: PropTypes.string.isRequired,
  //   centerId: PropTypes.string.isRequired,
  //   // callback
  //   dispatch: PropTypes.func.isRequired,
  // }

  componentDidMount() {
    // const { tab, centerId, centerType } = this.props
    // this.props.dispatch({ type: A.FETCH_CARD_DATA, tab, id: centerId, cardType: centerType })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tab !== this.props.tab || nextProps.centerId !== this.props.centerId) {
      this.props.dispatch({ type: A.CLEAR_CARD_DATA })
      this.props.dispatch({
        type: A.FETCH_CARD_DATA,
        tab: nextProps.tab,
        id: nextProps.centerId,
        cardType: nextProps.centerType,
      })
    }
  }

  handleClick = (tab) => {
    this.props.dispatch({ type: A.CHANGE_TAB, tab })
  }

  render() {
    const { tab: chosen, centerType } = this.props
    return (
      <div className="knowledge-cards">
        <div className="tabs-part">
          {Range(0, config[centerType].length).map(i => (
            <div
              key={i}
              className={classNames('tab', { chosen: chosen === config[centerType][i].key })}
              onClick={() => this.handleClick(config[centerType][i].key)}
            >
              {config[centerType][i].name}
            </div>
          ))}
        </div>
        {chosen === 'hot' ?
          <NewsCards
            wordList={fromJS(data[chosen]).get('keywords')}
            newsList={fromJS(data[chosen]).get('newsList')}
          /> : null}
        {chosen === 'trend' ?
          <BrandTrendCards
            comments={fromJS(data[chosen]).get('comments')}
            emotion={fromJS(data[chosen]).get('emotion')}
            trendData={fromJS(data[chosen]).get('trend')}
          /> : null}
        {chosen === 'relatedBrands' ? <RelatedBrandCards /> : null}
        {chosen === 'knowledge' ? <BrandKnowledgeTab /> : null}
        {chosen === 'detail' && centerType === 'Person' ? <PersonKnowledgeTab /> : null}
        {chosen === 'detail' && centerType === 'Product' ? <ProductDetailTab /> : null}
      </div>
    )
  }
}
