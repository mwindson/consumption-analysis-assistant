import React from 'react'
import { connect } from 'react-redux'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import { is } from 'immutable'
import * as A from 'actions'
import { LogoIcon, SearchIcon } from 'components/Icons'
import ceMap from 'utils/ceMap'
import 'style/HomePage.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class HomePage extends React.Component {
  state = {
    editing: false,
    inputValue: '',
  }

  componentDidMount() {
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id: 'maigoo:brand:美的Midea', resultType: 'Brand' })
  }

  componentWillReceiveProps(nextProps) {
    const { searchResult } = this.props
    if (!is(nextProps.searchResult, searchResult)) {
      this.handleResult(nextProps.searchResult.first().get('id'), nextProps.searchResult.first().get('type'))
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
    }
  }
  handleResult = (id, resultType) => {
    this.props.dispatch({ type: A.FETCH_NODES_AND_LINKS_DATA, id, resultType })
    this.props.dispatch({ type: A.CHANGE_TAB, tab: 'knowledge' })
  }

  render() {
    const { editing, inputValue } = this.state
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
              />
              {!editing && inputValue === '' ? <SearchIcon /> : null}
              {this.props.noResult ?
                <div className="no-result">暂无对应搜索结果</div> :
                <div className="search-result">
                  {this.props.searchResult.toArray().map((item, i) => (
                    <div
                      key={i}
                      className="search-item"
                      onClick={() => this.handleResult(item.get('id'), item.get('type'))}
                    >
                      {`${item.get('name')}（${ceMap[item.get('type')]}）`}
                    </div>
                  ))}
                </div>
              }
            </div>
          </div>
          <div className="graph">
            <KnowledgeGraph />
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards />
        </div>
      </div>
    )
  }
}
