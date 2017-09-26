import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'
import KnowledgeCards from 'containers/KnowledgeCards'
import KnowledgeGraph from 'containers/KnowledgeGraph'
import { is } from 'immutable'
import * as A from 'actions'
import { LogoIcon, SearchIcon, ErrorIcon } from 'components/Icons'
import 'style/HomePage.styl'
import config from '../utils/config.yaml'

const mapStateToProps = state => state.reducer.toObject()

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
    editing: false, // 是否正在输入
    inputValue: '', // 搜索框输入内容
    searchState: 'none', // none | searching | error
    overflow: false, // 判断搜索结果是否溢出
    listExpand: false, // 搜索结果显示更多
  }

  componentDidMount() {
    // todo 品牌条目和产品条目统计展示
    const searchResult = document.getElementsByClassName('search-result')[0]
    searchResult.addEventListener('overflow', () => this.setState({ overflow: true }))
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id: 'maigoo:brand:小米MI', resultType: 'Brand' })
  }

  componentWillReceiveProps(nextProps) {
    // todo 浏览历史记录展示
    const { searchResult } = this.props
    if (!is(nextProps.searchResult, searchResult)) {
      this.handleResult(nextProps.searchResult.first().get('id'), nextProps.searchResult.first().get('type'))
    }
    if (nextProps.noResult) {
      setTimeout(() => this.setState({ searchState: 'error', inputValue: '' }), 1000)
    } else {
      setTimeout(() => this.setState({ searchState: 'none' }), 1000)
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
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType })
  }
  popupSearchResult = () => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'searchResult', id: '' })
  }
  closePopup = () => {
    this.props.dispatch({ type: A.UPDATE_POPUP_TYPE, contentType: 'none', id: '' })
  }

  render() {
    const { editing, inputValue, searchState } = this.state
    const isExpand = this.props.popupType !== 'none'
    return (
      <div className="main">
        <div className="left-part">
          <div className="top">
            <div className="logo">
              <LogoIcon />
            </div>
            <div className="title">Relationship diagram</div>
          </div>
          <div className="search">
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
                </div>
              )
            }
          </Motion>
        </div>
      </div>
    )
  }
}
