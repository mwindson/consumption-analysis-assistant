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

const data = {
  knowledge: {
    cards: [{
      title: '品牌信息',
      type: 'intro',
      name: 'CHANEL',
      imgUrl: 'static/image/logo.png',
      text: '品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍品牌信息介绍'
    },
      { title: '企业信息', type: 'company', name: 'COMPANY', imgUrl: 'static/image/company.png', text: '企业信息介绍' },
      { title: '业态', type: 'store_type', name: 'LUXURUY', imgUrl: 'static/image/store_type.png', text: '经营业态介绍' }],
    lists: [{
      title: '相关人物',
      type: 'Person',
      list: [
        { url: 'static/image/person1.png', text: '创始人' },
        { url: 'static/image/person2.png', text: 'CEO' },
        { url: 'static/image/person3.png', text: '首席设计师' },
        { url: 'static/image/person4.png', text: '代言人' },
        { url: 'static/image/person5.png', text: '明星' },
        { url: 'static/image/person1.png', text: '创始人' },
        { url: 'static/image/person2.png', text: 'CEO' },
        { url: 'static/image/person3.png', text: '首席设计师' },
        { url: 'static/image/person4.png', text: '代言人' },
      ],
    },
      {
        title: '门店信息',
        type: 'store',
        list: [
          { url: 'static/image/shop1.png', text: '1号店' },
          { url: 'static/image/shop2.png', text: '2号店' },
          { url: 'static/image/shop3.png', text: '3号店' },
          { url: 'static/image/shop3.png', text: '4号店' },
          { url: 'static/image/shop3.png', text: '5号店' },
          { url: 'static/image/shop3.png', text: '6号店' },
        ],
      },
      {
        title: '热门商品',
        type: 'product',
        list: [
          { url: 'static/image/product1.png', text: '包' },
          { url: 'static/image/product2.png', text: '化妆品' },
          { url: 'static/image/product3.png', text: '香水' }],
      },
    ],
  },
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
  related: [
    {
      name: 'Dior',
      type: 'intro',
      imgUrl: 'static/image/logo.png',
      content: '这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本这里是介绍文本'
    },
    { name: 'HERMES', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
    { name: '香奈儿', type: 'brand', imgUrl: 'static/image/logo.png', content: 'text' },
  ],
}

const mapStateToProps = state => state.toJS()

@connect(mapStateToProps)
export default class KnowledgeCards extends React.Component {
  // todo react-redux 有bug
  // static propTypes = {
  //   cardData: PropTypes.object.isRequired,
  //   // callback
  //   dispatch: PropTypes.func.isRequired,
  // }

  componentDidMount() {
    const { tab, centerId } = this.props
    this.props.dispatch({ type: A.FETCH_CARD_DATA, tab, brandId: centerId })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tab !== this.props.tab || nextProps.centerId !== this.props.centerId) {
      this.props.dispatch({ type: A.CLEAR_CARD_DATA })
      this.props.dispatch({ type: A.FETCH_CARD_DATA, tab: nextProps.tab, brandId: nextProps.centerId })
    }
  }

  handleClick = (tab) => {
    this.props.dispatch({ type: A.CHANGE_TAB, tab })
  }

  render() {
    const { cardData, tab: chosen } = this.props
    return (
      <div className="knowledge-cards">
        <div className="tabs-part">
          <div
            className={classNames('tab', { chosen: chosen === 'knowledge' })}
            onClick={() => this.handleClick('knowledge')}
          >
            品牌知识
          </div>
          <div className={classNames('tab', { chosen: chosen === 'hot' })} onClick={() => this.handleClick('hot')}>
            热点聚焦
          </div>
          <div className={classNames('tab', { chosen: chosen === 'trend' })} onClick={() => this.handleClick('trend')}>
            品牌动态
          </div>
          <div
            className={classNames('tab', { chosen: chosen === 'relatedBrands' })}
            onClick={() => this.handleClick('relatedBrands')}
          >
            相关品牌
          </div>
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
        {chosen === 'relatedBrands' ? <RelatedBrandCards brandList={fromJS(data[chosen])} /> : null}
        {chosen === 'knowledge' ? <BrandKnowledgeTab /> : null}
      </div>
    )
  }
}
