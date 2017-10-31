import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'
import KnowledgeCards from 'containers/KnowledgeCards'
import KnowledgeGraph from 'containers/KnowledgeGraph'
import CollapseButton from 'components/CollapseButton'
import Feedback from 'components/Feedback'
import { is } from 'immutable'
import querystring from 'querystring'
import { replace, push } from 'react-router-redux'
import * as A from 'actions'
import { LogoIcon, SearchIcon, ErrorIcon, ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/HomePage.styl'
import config from '../utils/config.yaml'

const mapStateToProps = state => Object.assign({}, state.cards.toObject(), state.main.toObject(), state.graph.toObject(), state.routing)

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
    searching: this.props.location.search !== '', // 是否正在搜索
    editing: false, // 是否正在输入
    inputValue: '', // 搜索框输入内容
    searchState: 'none', // none | searching | error
    overflow: false, // 判断搜索结果是否溢出
    listExpand: false, // 搜索结果显示更多
    historyExpand: false, // 历史记录展开
    searchBarExpand: true, // 搜索框是否展开
    feedbackExpand: false, // 反馈展开
  }

  componentDidMount() {
    const searchResult = document.getElementsByClassName('search-result')[0]
    searchResult.addEventListener('overflow', () => this.setState({ overflow: true }))
    // url的参数非空
    if (this.props.location.search !== '') {
      const { type, id } = querystring.parse(this.props.location.search.substring(1))
      this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
    } else {
      // 品牌条目和产品条目统计数据查询
      this.props.dispatch({ type: A.FETCH_COUNT_DATA })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchResult, location } = this.props
    if (!is(nextProps.searchResult, searchResult)) {
      this.handleResult(nextProps.searchResult.first().get('id'),
        nextProps.searchResult.first().get('type'))
    }
    if (nextProps.noResult) {
      setTimeout(() => this.setState({ searchState: 'error', inputValue: '' }), 1000)
    } else {
      setTimeout(() => this.setState({ searchState: 'none' }), 1000)
    }
    if (nextProps.location !== location) {
      const { type, id } = querystring.parse(nextProps.location.search.substring(1))
      this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type })
    }
  }

  handleFocus = () => {
    this.setState({ editing: true })
  }

  handleBlur = () => {
    if (this.state.inputValue === '') this.setState({ editing: false })
  }

  handleChange = (event) => {
    if (!this.state.searching) this.setState({ searching: true })
    this.setState({ inputValue: event.target.value })
  }
  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.props.dispatch({ type: A.FETCH_SEARCH_RESULT, keyword: this.state.inputValue })
      this.setState({ searchState: 'searching', overflow: false })
    }
  }
  handleResult = (id, type) => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'none', id: '' })
    this.setState({ listExpand: false })
    this.props.dispatch(push(`?${querystring.stringify({ type, id })}`))
  }
  popupSearchResult = () => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'searchResult', id: '' })
  }
  closePopup = () => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'none', id: '' })
  }
  openFeedback = () => {
    this.setState({ feedbackExpand: true })
  }
  closeFeedback = () => {
    this.setState({ feedbackExpand: false })
  }

  render() {
    const { editing, inputValue, searchState, searchBarExpand, feedbackExpand, searching } = this.state
    const { count, footprint, center } = this.props
    const isExpand = this.props.popupType !== 'none'
    return (
      <div className="main">
        <div className={classNames('left-part', { searching })}>
          <div className="top">
            <div className="logo">
              <LogoIcon />
            </div>
            <div className="title">Relationship diagram</div>
            {searching ? <div id="history" className="history">
              <CollapseButton contentList={footprint} itemClick={this.handleResult} />
              <button className="feedback-button" onClick={() => this.openFeedback()}>我要反馈</button>
            </div> : null}
          </div>
          <div className={classNames('search', { expand: searchBarExpand && searching, searching })}>
            <div className={classNames('input', { searching })} >
              <input
                type="text"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleSearch}
                value={inputValue}
              />
              {!editing ? <SearchIcon /> : null}
              {searchState === 'searching' ?
                <div className="searching-logo">
                  <div className="searching-animation">
                    <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                  </div>
                  正在搜索
                </div> : null
              }
              {searchState === 'error' ? <div className="no-result"><ErrorIcon />暂无相关内容</div> : null}
              <div className={classNames('search-result', { searching })}>
                {this.props.searchResult.slice(0, 6).toArray().map((item, i) => (
                  <div
                    key={i}
                    title={`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                    className="search-item"
                    onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                  >
                    {`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                  </div>
                ))}
                {this.props.searchResult.size > 6 ?
                  <div className="more-result" onClick={() => this.popupSearchResult()}>更多</div> : null}
              </div>
            </div>
          </div>
          {!searching ?
            <div className="statistic"> 当前已收录品牌
              <span>{count.get('brand') ? count.get('brand') : '0'}</span>个，人物
              <span>{count.get('person') ? count.get('person') : '0'}</span>个，公司
              <span>{count.get('company') ? count.get('company') : '0'}</span>个，产品
              <span>{count.get('product') ? count.get('product') : '0'}</span>个
            </div> : null
          }
          {
            searching ? <div
              onClick={() => this.setState({ searchBarExpand: !searchBarExpand })}
              className="search-bar-button"
            >{searchBarExpand ? <ArrowTop fill={'white'} /> : <ArrowBottom fill={'white'} />}</div> : null
          }
          {
            searching ? <div className="graph">
              {this.props.graphLoading ?
                <div className="mask">
                  <div className="loading">
                    <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                  </div>
                </div> : null}
              <KnowledgeGraph />
            </div> : null
          }
        </div >
        {searching ? <div className="right-part">
          <KnowledgeCards />
        </div > : null
        }
        <Feedback name={center.get('name')} id={center.get('id')} expand={feedbackExpand} closeFunc={this.closeFeedback} type={center.get('type')} />
        <div className={classNames('popup', { listExpand: isExpand })}>
          <div className="mask" />
          <Motion style={{ y: spring(isExpand ? 100 : 0), opacity: spring(isExpand ? 1 : 0.5) }}>
            {({ y, opacity }) =>
              (<div className="search-result-list" style={{ transform: `translate(0,${y}px)`, opacity }}>
                <div className="close" onClick={() => this.closePopup()}>关闭</div>
                <div className="list">
                  {this.props.popupType === 'searchResult' ? this.props.searchResult.toArray().map((item, i) => (
                    <div
                      key={i}
                      title={`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                      className="search-item"
                      onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                    >
                      {`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                    </div>
                  )) : null}
                </div>
              </div>)
            }
          </Motion>
        </div>
      </div >
    )
  }
}
