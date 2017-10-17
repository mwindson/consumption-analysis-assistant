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
import { push } from 'react-router-redux'
import * as A from 'actions'
import { LogoIcon, SearchIcon, ErrorIcon, ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/HomePage.styl'
import config from '../utils/config.yaml'

const mapStateToProps = state => Object.assign({}, state.reducer.toObject(), state.routing)

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
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
    console.log(this.props.location)
    if (this.props.location.search === "") {
      this.props.dispatch(push(`?${querystring.stringify({
        type: 'Brand',
        id: 'maigoo:brand:米家MIJIA',
      })}`, { type: 'Brand', id: 'maigoo:brand:米家MIJIA' }))
      this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id: 'maigoo:brand:米家MIJIA', resultType: 'Brand' })
    } else {
      const { type, id } = querystring.parse(this.props.location.search.substring(1))
      this.props.dispatch(push(`?${querystring.stringify({ type, id })}`, { type, id }))
    }
    // 品牌条目和产品条目统计展示
    this.props.dispatch({ type: A.FETCH_COUNT_DATA })
  }

  componentWillReceiveProps(nextProps) {
    const { searchResult, location } = this.props
    if (!is(nextProps.searchResult, searchResult)) {
      this.handleResult(nextProps.searchResult.first().get('id'), nextProps.searchResult.first().get('type'))
      setTimeout(() => this.setState({ searchBarExpand: false }), 5000)
    }
    if (nextProps.noResult) {
      setTimeout(() => this.setState({ searchState: 'error', inputValue: '' }), 1000)
    } else {
      setTimeout(() => this.setState({ searchState: 'none' }), 1000)
    }
    if (nextProps.location !== location) {
      const { type, id } = nextProps.location.state
      this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type })
    }
  }

  handleFocus = () => {
    this.setState({ editing: true })
  }

  handleBlur = () => {
    this.setState({ editing: false })
  }

  handleChange = (event) => {
    this.setState({ inputValue: event.target.value })
  }
  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.props.dispatch({ type: A.FETCH_SEARCH_RESULT, keyword: this.state.inputValue })
      this.setState({ searchState: 'searching', overflow: false })
    }
  }
  handleResult = (id, resultType) => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'none', id: '' })
    this.setState({ listExpand: false })
    this.props.dispatch(push(`?${querystring.stringify({ type: resultType, id })}`, { type: resultType, id }))
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
    const { editing, inputValue, searchState, searchBarExpand, feedbackExpand } = this.state
    const { count, footprint, centerName, centerId } = this.props
    const isExpand = this.props.popupType !== 'none'
    return (
      <div className="main">
        <div className="left-part">
          <div className="top">
            <div className="logo">
              <LogoIcon />
            </div>
            <div className="title" style={{ whiteSpace: 'nowrap' }}>Relationship diagram</div>
            <div id="history" className="history">
              <CollapseButton contentList={footprint} itemClick={this.handleResult} />
            </div>
          </div>
          <div className="top">
            <div
              className="statistic"
            >当前已收录品牌
              <span style={{ color: 'red', fontWeight: 'bold' }}>{count.get('brand') ? count.get('brand') : '0'}</span>个，
              人物<span style={{
                color: 'red',
                fontWeight: 'bold',
              }}>{count.get('person') ? count.get('person') : '0'}</span>个，
              公司<span style={{
                color: 'red',
                fontWeight: 'bold',
              }}>{count.get('company') ? count.get('company') : '0'}</span>个，
              产品<span style={{
                color: 'red',
                fontWeight: 'bold',
              }}>{count.get('product') ? count.get('product') : '0'}</span>个
            </div>
            <button className="feedback-button" onClick={() => this.openFeedback()}>我要反馈</button>
          </div>
          <div className={classNames('search', { expand: searchBarExpand })}>
            <div className="input">
              <input
                type="text"
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                onKeyDown={this.handleSearch}
                value={inputValue}
              />
              {!editing && inputValue === '' ? <SearchIcon /> : null}
              {searchState === 'searching' ?
                <div className="searching">
                  <div className="searching-animation">
                    <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                  </div>
                  正在搜索
                </div> : null
              }
              {searchState === 'error' ? <div className="no-result"><ErrorIcon />暂无相关内容</div> : null}
              <div className="search-result">
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
          <div
            onClick={() => this.setState({ searchBarExpand: !searchBarExpand })}
            className="search-bar-button"
          >{searchBarExpand ? <ArrowTop fill={'white'} /> : <ArrowBottom fill={'white'} />}</div>
          <div className="graph">
            {this.props.graphLoading ?
              <div className="mask">
                <div className="loading">
                  <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                </div>
              </div> : null}
            <KnowledgeGraph />
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards />
        </div>
        <Feedback name={centerName} id={centerId} expand={feedbackExpand} closeFunc={this.closeFeedback} />
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
      </div>
    )
  }
}
