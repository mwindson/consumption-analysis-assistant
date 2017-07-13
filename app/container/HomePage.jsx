import React from 'react'
import KnowledgeCards from 'components/KnowledgeCards'
import KnowledgeGraph from 'components/KnowledgeGraph'
import {LogoIcon, SearchIcon} from 'components/Icons'
import 'style/HomePage.styl'

let graphData = {
  "nodes": [
    {
      "id": 0,
      "name": "小米",
      "type": 'center',
      "value": 0
    },
    {
      "id": 1,
      "name": "所属公司",
      "type": 'news',
      "value": 1
    },
    {
      "id": 2,
      "name": "新闻列表",
      "type": 'news',
      "value": 1
    },
    {
      "id": 3,
      "name": "手机",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 4,
      "name": "笔记本",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 5,
      "name": "家用电器",
      "type": 'store_type',
      "value": 2
    },
    {
      "id": 6,
      "name": "华为",
      "type": 'related_brand',
      "value": 3
    },
    {
      "id": 7,
      "name": "魅族",
      "type": 'related_brand',
      "value": 3,
    },
    {
      "id": 8,
      "name": "雷军",
      "type": 'person',
      "value": 4,
    },
    {
      "id": 9,
      "name": "小米4",
      "type": 'product',
      "value": 5,
    },
    {
      "id": 10,
      "name": "小米NOTE",
      "type": 'product',
      "value": 5,
    },
    {
      "id": 11,
      "name": "林斌",
      "type": 'person',
      "value": 4,
    }
  ],
  "links": [
    {
      "source": 0,
      "target": 1,
      "type": 'news',
      "strength": 1,
    },
    {
      "source": 0,
      "target": 2,
      "type": 'news',
      "strength": 1,

    },
    {
      "source": 0,
      "target": 3,
      "type": 'store_type',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 4,
      "type": 'store_type',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 5,
      "type": 'store_type',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 6,
      "type": 'related_brand',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 7,
      "type": 'related_brand',
      "strength": 4,
    },
    {
      "source": 0,
      "target": 8,
      "type": 'person',
      "strength": 4,
    },
    {
      "source": 0,
      "target": 9,
      "type": 'product',
      "strength": 5,
    },
    {
      "source": 0,
      "target": 10,
      "type": 'product',
      "strength": 5,
    },
    {
      "source": 0,
      "target": 11,
      "type": 'person',
      "strength": 5,
    }
  ]
}
export default class HomePage extends React.Component {
  state = {
    editing: false,
    inputValue: "",
    data: {},
    lineId: 0,
    relation_type: 'center',
  }

  componentWillMount() {
    this.setState({data: graphData})
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
  handleDataChange = (data) => {
    this.setState({data})
  }
  handleLineClick = (id, type) => {
    this.setState({lineId: id, relation_type: type})
  }

  render() {
    const {editing, inputValue, data} = this.state
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
            <KnowledgeGraph data={data} handleLineClick={this.handleLineClick}/>
          </div>
        </div>
        <div className="right-part">
          <KnowledgeCards changeData={this.handleDataChange} data={this.state.data} lineId={this.state.lineId}
                          relation_type={this.state.relation_type} lineReset={this.handleLineClick}/>
        </div>
      </div>
    )
  }
}
