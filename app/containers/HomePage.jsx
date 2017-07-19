import React from 'react'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import { LogoIcon, SearchIcon } from 'components/Icons'
import 'style/HomePage.styl'

export default class HomePage extends React.Component {
  state = {
    editing: false,
    inputValue: '',
    lineId: 0,
    relation_type: 'center',
    hasResult: true,
  }

  componentWillMount() {
    this.setState({ currentName: 0 })
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
  handleDataChange = (data) => {
    this.setState({ data })
  }
  handleLineClick = (id, type) => {
    this.setState({ lineId: id, relation_type: type })
  }

  handleSearch = (event) => {
    if (event.keyCode === 13) {
      // todo 修改成与现有数据格式匹配
      this.setState({ hasResult: false })
    }
  }

  render() {
    const { editing, inputValue, hasResult, relation_type, lineId } = this.state
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
              {!hasResult ? <div className="no-result">暂无对应搜索结果</div> : null}
            </div>
          </div>
          <div className="graph">
            <KnowledgeGraph lineClick={this.handleLineClick} />
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards lineId={lineId} relation_type={relation_type} lineReset={this.handleLineClick} />
        </div>
      </div>
    )
  }
}
