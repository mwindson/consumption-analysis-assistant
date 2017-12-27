import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import KnowledgeCards from 'containers/KnowledgeCards'
import KnowledgeGraph from 'containers/KnowledgeGraph'
import Feedback from 'components/Feedback'
import FloatLayer from 'components/FloatLayer'
import { is, List } from 'immutable'
import querystring from 'querystring'
import { replace } from 'react-router-redux'
import * as A from 'actions'
import { LogoIcon, SearchIcon, ErrorIcon, ArrowTop, ArrowBottom, FeedBackIcon } from 'components/Icons'
import 'style/HomePage.styl'
import config from '../utils/config.yaml'

const mapStateToProps = state => Object.assign({}, state.main.toObject(), state.routing)

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
    searching: this.props.location.search !== '', // 位于主页/正在搜索
    editing: false, // 是否正在输入
    inputValue: '', // 搜索框输入内容
    searchState: 'none', // none | searching | error
    searchBarExpand: true, // 搜索框是否展开
    feedbackExpand: false, // 反馈展开
  }

  componentDidMount() {
    // url的参数非空
    if (this.props.location.search !== '') {
      const { type, id } = querystring.parse(this.props.location.search.substring(1))
      this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
      this.props.dispatch({
        type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: true,
      })
    } else {
      // 品牌条目和产品条目统计数据查询
      this.props.dispatch({ type: A.FETCH_COUNT_DATA })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchResult } = this.props
    if (nextProps.searchResult.size > 0) {
      if (!is(nextProps.searchResult, searchResult)) {
        this.handleResult(
          nextProps.searchResult.first().get('id'),
          nextProps.searchResult.first().get('type'),
        )
      }
    }
    if (nextProps.noResult) {
      setTimeout(() => this.setState({ searchState: 'error', inputValue: '' }), 300)
    } else {
      setTimeout(() => this.setState({ searchState: 'none' }), 300)
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
      if (this.state.inputValue !== this.props.keyword) {
        this.props.dispatch({ type: A.FETCH_SEARCH_RESULT, keyword: this.state.inputValue })
        this.setState({ searchState: 'searching' })
      } else {
        this.handleResult(
          this.props.searchResult.first().get('id'),
          this.props.searchResult.first().get('type'),
        )
      }
    }
  }
  handleResult = (id, type) => {
    this.props.dispatch(replace(`?${querystring.stringify({ type, id })}`))
    this.props.dispatch({
      type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType: type, updateFootprint: true,
    })
  }
  moreResult = () => {
    this.props.dispatch({ type: A.CHANGE_OPEN_TYPE, contentType: 'moreResult' })
    this.props.dispatch({ type: A.FLOAT_LAYER_OPEN, isOpen: true })
  }
  openFeedback = () => {
    this.setState({ feedbackExpand: true })
  }
  closeFeedback = () => {
    this.setState({ feedbackExpand: false })
  }

  sliceIndex = (array) => {
    let i = 0
    let totalLength = 0
    const textLength = (text) => {
      const cnLen = text.match(/[^\x00-\xff]/ig).length
      const enLen = text.length - cnLen
      return (cnLen * 13.33) + (enLen * 9.4)
    }
    if (!array.isEmpty()) {
      array.toArray().forEach((item) => {
        const name = `${item.get('name')}（${config.nameMap[item.get('type')]}）`
        totalLength += textLength(name)
        if (totalLength < 500) {
          i += 1
        }
      })
      return i
    }
    return array.size
  }

  render() {
    const {
      editing, inputValue, searchState, searchBarExpand, feedbackExpand, searching,
    } = this.state
    const {
      count, footprint, center, searchResult, contentType,
    } = this.props
    const floatData = (type) => {
      if (type === 'history') {
        return footprint
      } else if (type === 'moreResult') {
        return searchResult.slice(this.sliceIndex(searchResult), searchResult.size - 1)
      }
      return List()
    }
    return (
      <div className="main">
        <div className={classNames('left-part', { searching })} id="left-part">
          <div className="top">
            <div className="logo">
              <LogoIcon />
            </div>
            <div className="title">Relationship diagram</div>
            {searching ?
              <div id="history" className="history">
                <div className="feedback-button" onClick={() => this.openFeedback()}><FeedBackIcon />反馈</div>
              </div> : null}
            {searching ? <FloatLayer data={floatData(contentType)} /> : null}
          </div>
          <div className={classNames('search', { expand: searchBarExpand && searching, searching })}>
            <div className={classNames('input', { searching })}>
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
                </div> : null}
              {searchState === 'error' ? <div className="no-result"><ErrorIcon />暂无相关内容</div> : null}
              <div className={classNames('search-result', { searching })}>
                {searchResult.slice(0, this.sliceIndex(searchResult)).toArray().map((item, i) => (
                  <div
                    key={i}
                    className="search-item"
                    onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                  >
                    {`${item.get('name')}（${config.nameMap[item.get('type')]}）`}
                  </div>))}
                {searchResult.size > this.sliceIndex(searchResult) ?
                  <div className="more-result" onClick={() => this.moreResult()}>更多</div> : null}
              </div>
            </div>
          </div>
          {!searching ?
            <div className="statistic"> 当前已收录品牌
              <span>{count.get('brand') ? count.get('brand') : '0'}</span>个，人物
              <span>{count.get('person') ? count.get('person') : '0'}</span>个，产品
              <span>{count.get('product') ? count.get('product') : '0'}</span>个
            </div> : null}
          {searching ?
            <div
              onClick={() => this.setState({ searchBarExpand: !searchBarExpand })}
              className="search-bar-button"
            >{searchBarExpand ? <ArrowTop fill="white" /> : <ArrowBottom fill="white" />}
            </div> : null}
          {searching ?
            <div className="graph">
              <KnowledgeGraph />
            </div> : null}
        </div>
        {searching ?
          <div className="right-part">
            <KnowledgeCards />
          </div> : null}
        <Feedback
          name={center.get('name')}
          id={center.get('id')}
          expand={feedbackExpand}
          closeFunc={this.closeFeedback}
          type={center.get('type')}
        />
      </div>
    )
  }
}
