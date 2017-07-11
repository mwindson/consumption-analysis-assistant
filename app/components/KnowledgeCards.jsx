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
      hot: [{title: '新闻摘要', type: 'intro'},
        {title: '新闻热度', type: 'intro'},
        {title: '重大事件', type: 'intro'},
      ],
      knowledge: [{title: '品牌信息', type: 'intro'},
        {title: '企业信息', type: 'intro'},
        {title: '业态', type: 'intro'},
        {title: '相关人物', type: 'person'},
        {title: '门店信息', type: 'store'},
        {title: '热门商品', type: 'product'}
      ],
      stock: [{title: '股票信息', type: 'intro'},
        {title: '股票数据', type: 'intro'},
        {title: '股票统计', type: 'intro'},
      ],
      analysis: [{title: '评价情感', type: 'intro'},
        {title: '高级分析', type: 'intro'},
        {title: '业态', type: 'intro'},
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
            <Card d key={i} title={d.title} type={d.type}/>
          ))}
        </div>
      </div>
    )
  }
}
