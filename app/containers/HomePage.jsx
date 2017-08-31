import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import { is } from 'immutable'
import * as A from 'actions'
import { LogoIcon, SearchIcon, ErrorIcon } from 'components/Icons'
import ceMap from 'utils/ceMap'
import 'style/HomePage.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
    editing: false,
    inputValue: '',
    searchState: 'none', // none | searching | error
    overflow: false, // 判断搜索结果是否溢出
    listExpand: false,
  }

  componentDidMount() {
    const searchResult = document.getElementsByClassName('search-result')[0]
    searchResult.addEventListener('overflow', () => this.setState({ overflow: true }))
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id: 'maigoo:brand:美的Midea', resultType: 'Brand' })
  }

  componentWillReceiveProps(nextProps) {
    const { searchResult, noResult } = this.props
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
      // todo 修改成与现有数据格式匹配
      this.props.dispatch({ type: A.FETCH_SEARCH_RESULT, keyword: this.state.inputValue })
      this.setState({ searchState: 'searching', overflow: false })
    }
  }
  handleResult = (id, resultType) => {
    this.setState({ listExpand: false })
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType })
    this.props.dispatch({ type: A.CHANGE_TAB, tab: 'knowledge' })
  }

  render() {
    const { editing, inputValue, searchState, listExpand } = this.state
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
                    title={`${item.get('name')}（${ceMap[item.get('type')]}）`}
                    className="search-item"
                    onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                  >
                    {`${item.get('name')}（${ceMap[item.get('type')]}）`}
                  </div>
                ))}
                {this.props.searchResult.size > 6 ?
                  <div className="more-result" onClick={() => this.setState({ listExpand: true })}>更多</div> : null}
              </div>
            </div>
          </div>
          <div className="graph">
            <KnowledgeGraph />
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards />
        </div>
        <div className={classNames('popup', { listExpand })}>
          <div className="mask" />
          <Motion style={{ y: spring(listExpand ? 100 : 0), opacity: spring(listExpand ? 1 : 0.5) }}>
            {({ y, opacity }) =>
              (<div className="search-result-list" style={{ transform: `translate(0,${y}px)`, opacity }}>
                <div className="close" onClick={() => this.setState({ listExpand: false })}>关闭</div>
                <div className="list">
                  {this.props.searchResult.toArray().map((item, i) => (
                    <div
                      key={i}
                      title={`${item.get('name')}（${ceMap[item.get('type')]}）`}
                      className="search-item"
                      onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                    >
                      {`${item.get('name')}（${ceMap[item.get('type')]}）`}
                    </div>
                  ))}
                </div>
              </div>)}
          </Motion>
        </div>
      </div>
    )
  }
}
