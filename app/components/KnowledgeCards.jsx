import React from 'react'
import 'style/KnowledgeCards.styl'
import classNames from 'classnames'
import Card from 'components/Card'

export default class KnowledgeCards extends React.Component {
  state = {
    chosen: "knowledge"
  }
  handleClick = (tab) => {
    this.setState({chosen: tab})
  }

  render() {
    const data = {
      hot: [{title: '新闻摘要', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
        {title: '新闻热度', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
        {title: '重大事件', type: 'intro', content: [{url: 'static/image/logo.png', text: 'text'}]},
      ],
      knowledge: [{title: '品牌信息', type: 'intro', content: [{url: 'static/image/logo.png', text: '品牌信息介绍'}]},
        {title: '企业信息', type: 'intro', content: [{url: 'static/image/company.png', text: '企业信息介绍'}]},
        {title: '业态', type: 'intro', content: [{url: 'static/image/store_type.png', text: '经营业态介绍'}]},
        {
          title: '相关人物',
          type: 'person',
          content: [
            {url: 'static/image/person1.png', text: '创始人'},
            {url: 'static/image/person2.png', text: 'CEO'},
            {url: 'static/image/person3.png', text: '首席设计师'},
            {url: 'static/image/person4.png', text: '代言人'},
            {url: 'static/image/person5.png', text: '明星'},
          ]
        },
        {
          title: '门店信息',
          type: 'store',
          content: [
            {url: 'static/image/shop1.png', text: '1号店'},
            {url: 'static/image/shop2.png', text: '2号店'},
            {url: 'static/image/shop3.png', text: '3号店'}]
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
    const {chosen} = this.state
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
        <div className="card">
          {data[chosen].map((d, i) => (
            <Card d key={i} title={d.title} type={d.type} content={d.content}/>
          ))}
        </div>
      </div>
    )
  }
}
