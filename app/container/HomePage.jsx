import React from 'react'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import {LogoIcon, SearchIcon} from 'components/Icons'
import 'style/HomePage.styl'

export default class HomePage extends React.Component {
  render() {
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
            <SearchIcon/>
            <input />
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
