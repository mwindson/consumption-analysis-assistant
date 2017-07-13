import React from 'react'
import PropTypes from 'prop-types'
import 'style/KnowledgeCards.styl'
import {fromJS, Map} from 'immutable'
import classNames from 'classnames'
import Card from 'components/Card'

const data = {
  hot: [{title: '新闻摘要', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '新闻热度', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '重大事件', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
  ],
  knowledge: [{title: '品牌信息', type: 'intro', content: [{url: 'static/image/logo.png', text: '品牌信息介绍'}]},
    {title: '企业信息', type: 'company', content: [{url: 'static/image/company.png', text: '企业信息介绍'}]},
    {title: '业态', type: 'store_type', content: [{url: 'static/image/store_type.png', text: '经营业态介绍'}]},
    {
      title: '相关人物',
      type: 'person',
      content: [
        {url: 'static/image/person1.png', text: '创始人'},
        {url: 'static/image/person2.png', text: 'CEO'},
        {url: 'static/image/person3.png', text: '首席设计师'},
        {url: 'static/image/person4.png', text: '代言人'},
        {url: 'static/image/person5.png', text: '明星'},
        {url: 'static/image/person1.png', text: '创始人'},
        {url: 'static/image/person2.png', text: 'CEO'},
        {url: 'static/image/person3.png', text: '首席设计师'},
        {url: 'static/image/person4.png', text: '代言人'},
      ]
    },
    {
      title: '门店信息',
      type: 'store',
      content: [
        {url: 'static/image/shop1.png', text: '1号店'},
        {url: 'static/image/shop2.png', text: '2号店'},
        {url: 'static/image/shop3.png', text: '3号店'},
        {url: 'static/image/shop3.png', text: '4号店'},
        {url: 'static/image/shop3.png', text: '5号店'},
        {url: 'static/image/shop3.png', text: '6号店'},
      ]
    },
    {
      title: '热门商品',
      type: 'product',
      content: [
        {url: 'static/image/product1.png', text: '包'},
        {url: 'static/image/product2.png', text: '化妆品'},
        {url: 'static/image/product3.png', text: '香水'}]
    }
  ],
  stock: [{title: '股票信息', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '股票数据', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '股票统计', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
  ],
  analysis: [{title: '评价情感', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '高级分析', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
    {title: '业态', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
  ],
}
let newGraphData = {
  "nodes": [
    {
      "id": 0,
      "name": "小米",
      "type": 'center',
      "value": 0
    },
    {
      "id": 1,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 2,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 3,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 4,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 5,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 6,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
    {
      "id": 7,
      "name": "相关人物",
      "type": 'person',
      "value": 1
    },
  ],
  "links": [
    {
      "source": 0,
      "target": 1,
      "type": 'person',
      "strength": 1,
    },
    {
      "source": 0,
      "target": 2,
      "type": 'person',
      "strength": 1,

    },
    {
      "source": 0,
      "target": 3,
      "type": 'person',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 4,
      "type": 'person',
      "strength": 2,
    },
    {
      "source": 0,
      "target": 5,
      "type": 'person',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 6,
      "type": 'person',
      "strength": 3,
    },
    {
      "source": 0,
      "target": 7,
      "type": 'person',
      "strength": 4,
    }
  ]
}
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
export default class KnowledgeCards extends React.Component {
  static propTypes = {
    changeData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }
  state = {
    chosen: "knowledge",
    expand: Map({hot: "", knowledge: "", stock: "", analysis: ""}),
    type: "",
    cardData: {},
  }
  handleClick = (tab) => {
    const {expand, cardData, chosen} = this.state
    if (expand.get(tab) === "" & expand.get(chosen) !== "" || expand.get(tab) !== "" & expand.get(chosen) === "") {
      this.setState({cardData: this.props.data})
      this.props.changeData(cardData)
    }
    this.setState({chosen: tab})
  }
  handleMoreLink = (type) => {
    const {expand, chosen} = this.state
    this.setState({expand: expand.set(chosen, type)})
    this.setState({type: type})
    this.setState({cardData: this.props.data})
    this.props.changeData(newGraphData)
  }
  backClick = () => {
    const {expand, chosen, cardData} = this.state
    this.setState({expand: expand.set(chosen, "")})
    this.setState({type: ""})
    this.setState({cardData: this.props.data})
    this.props.changeData(cardData)
  }

  renderExpandCard() {
    const {chosen, type} = this.state
    const expandData = fromJS(data[chosen]).find(d => d.get('type') === type).get('content')
    return (
      <div className="item-list">
        {expandData.map((item, i) => (
          <div key={i} className="item">
            <div className={classNames("img", type)}>
              <img src={item.get('url')}/>
            </div>
            <div className="text">
              {item.get('text')}
            </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    const {chosen, expand} = this.state
    return (
      <div className="cards">
        <div className="tabs-part">
          <div className={classNames('tab', {chosen: chosen === 'hot'})} onClick={() => this.handleClick('hot')}>热点聚焦
          </div>
          <div
            className={classNames('tab', {chosen: chosen === 'knowledge'})}
            onClick={() => this.handleClick('knowledge')}>品牌知识
          </div>
          <div className={classNames('tab', {chosen: chosen === 'stock'})} onClick={() => this.handleClick('stock')}>
            股票信息
          </div>
          <div className={classNames('tab', {chosen: chosen === 'analysis'})}
               onClick={() => this.handleClick('analysis')}>
            情感分析
          </div>
        </div>
        {expand.get(chosen) !== "" ? (
          <div className="expand-card">
            <div className="back" onClick={this.backClick}>返回</div>
            {this.renderExpandCard()}
          </div>
        ) : (
          <div className="card">
            {data[chosen].map((d, i) => (
              <Card key={i} title={d.title} type={d.type} content={d.content} moreLink={this.handleMoreLink}/>
            ))}
          </div>)
        }
      </div>
    )
  }
}
