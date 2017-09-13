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
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id: 'maigoo:brand:小米MI', resultType: 'Brand' })
  }

  componentWillReceiveProps(nextProps) {
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
                  {this.props.popupType === 'product' ? this.props.productDetail.entrySeq().map((attr, index) => {
                    if (attr[0] !== 'category' && attr[0] !== 'optional' && attr[1].length !== 0) {
                      return (<div key={index} className="attr">
                        <div className="key">{config.nameMap[attr[0]]}</div>
                        <div className="value">{attr[0] === 'url' ?
                          <a href={attr[1]} target="_blank">京东页面</a> : attr[1]} </div>
                      </div>)
                    } else if (attr[0] === 'category') {
                      return (<div key={index} className="attr">
                        <div className="key">类别</div>
                        <div className="value">{attr[1].join('、')}</div>
                      </div>)
                    } else if (attr[0] === 'optional' && attr[1].size !== 0) {
                      return (<div key={index} className="attr">
                        <div className="key">其他</div>
                        <div className="value">{attr[1].entrySeq().map((v, i) =>
                          <div key={i} className="other">{`${v[0]}: ${v[1]}`}</div>)}
                        </div>
                      </div>)
                    }
                  }) : null}
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
