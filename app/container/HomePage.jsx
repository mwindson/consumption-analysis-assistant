import React from 'react'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import {LogoIcon, SearchIcon} from 'components/Icons'
import 'style/HomePage.styl'

export default class HomePage extends React.Component {
  state = {
    editing: false,
    inputValue: "",
  }

  handleFocus = () => {
    this.setState({editing: true})
  }

  handleBlur = () => {
    this.setState({editing: false})
  }

  handleChange = (event) => {
    this.setState({inputValue: event.target.value})
  }

  render() {
    const {editing, inputValue} = this.state
    return (
      <div className="main">
        <div className="left-part">
          <div className="top">
            <div className="logo">
              <LogoIcon/>
            </div>
            <div className="title">Relationship diagram</div>
          </div>
          <div className="search">
            <div className="input">
              <input type="text" onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange}/>
              {!editing && inputValue === "" ? <SearchIcon/> : null}
            </div>
          </div>
          <div className="graph">
            <KnowledgeGraph/>
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards/>
        </div>
      </div>
    )
  }
}
