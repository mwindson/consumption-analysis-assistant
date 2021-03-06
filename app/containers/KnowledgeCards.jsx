import React from 'react'
import { fromJS, Range, Map } from 'immutable'
import { connect } from 'react-redux'
import classNames from 'classnames'
import querystring from 'querystring'
import * as A from 'actions'
import 'style/KnowledgeCards.styl'
import NewsTab from 'components/NewsTab'
import BrandTrendTab from 'components/BrandTrendTab'
import RelatedBrandTab from 'components/RelatedBrandTab'
import PersonKnowledgeTab from 'components/PersonKnowledgeTab'
import BrandKnowledgeTab from 'components/BrandKnowledgeTab'
import ProductDetailTab from 'components/ProductDetailTab'
import ProductSpecTab from 'components/ProductSpecTab'
import StoryCard from 'components/cards/StoryCard'
import BrandInfoBox from 'components/BrandInfoBox'
import config from 'utils/config.yaml'
import WeiboCard from 'components/WeiboCard'

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

const mapStateToProps = state => Object.assign({}, state.cards.toObject(), state.routing)

@connect(mapStateToProps)
export default class KnowledgeCards extends React.Component {
  // static propTypes = {
  //   tab: PropTypes.string.isRequired,
  //   centerId: PropTypes.string.isRequired,
  //   // callback
  //   dispatch: PropTypes.func.isRequired,
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const { id, type } = querystring.parse(nextProps.location.search.substring(1))
      this.props.dispatch({ type: A.UPDATE_CARD_DATA, cardData: Map(), tab: config[type][0].key })
      this.props.dispatch({
        type: A.FETCH_CARD_DATA,
        tab: config[type][0].key,
        id,
        cardType: type,
      })
    }
  }

  handleClick = (tab) => {
    const { id, type } = querystring.parse(this.props.location.search.substring(1))
    this.props.dispatch({
      type: A.FETCH_CARD_DATA, tab, id, cardType: type,
    })
  }

  render() {
    const { tab: chosen } = this.props
    const centerType = this.props.location.search === '' ? 'Brand' :
      querystring.parse(this.props.location.search.substring(1)).type
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
          <div
            className="tab-flag-bar"
            style={{
              left: `${(config[centerType].findIndex(item => item.key === chosen) / config[centerType].length) * 100}%`,
              width: `${100 / config[centerType].length}%`,
            }}
          />
        </div>
        <div className="cards">
          {chosen === 'hot' ?
            <NewsTab
              wordList={fromJS(data[chosen]).get('keywords')}
              newsList={fromJS(data[chosen]).get('newsList')}
            /> : null}
          {chosen === 'comments' && centerType === 'Brand' ? <BrandTrendTab /> : null}
          {chosen === 'relatedBrands' ? <RelatedBrandTab /> : null}
          {chosen === 'infoBox' && centerType === 'Brand' ? <BrandInfoBox /> : null}
          {chosen === 'detail' && centerType === 'Brand' ? <StoryCard /> : null}
          {chosen === 'knowledge' && centerType === 'Brand' ? <BrandKnowledgeTab /> : null}
          {chosen === 'detail' && centerType === 'Person' ? <PersonKnowledgeTab /> : null}
          {chosen === 'story' && centerType === 'Person' ? <StoryCard /> : null}
          {chosen === 'weibo' && centerType === 'Person' ? <WeiboCard /> : null}
          {chosen === 'detail' && centerType === 'Product' ? <ProductDetailTab /> : null}
          {chosen === 'spec' && centerType === 'Product' ? <ProductSpecTab /> : null}
        </div>
      </div>
    )
  }
}
