import React from 'react'
import 'style/KnowledgeCards.styl'
import classNames from 'classnames'
import Card from 'components/Card'

export default class KnowledgeCards extends React.Component {
  render() {
    const data = [
      {title: '品牌信息', type: 'intro'},
      {title: '企业信息', type: 'intro'},
      {title: '业态', type: 'intro'},
      {title: '相关人物', type: 'person'},
      {title: '门店信息', type: 'store'},
      {title: '热门商品', type: 'product'}
    ]
    return (
      <div className="cards">
        <div className="tabs-part">
          <div className="tab">热点聚焦</div>
          <div className={classNames('tab', {chosen: true})}>品牌知识</div>
          <div className="tab">股票信息</div>
          <div className="tab">情感分析</div>
        </div>
        <div className="card">
          {data.map((d, i) => (
            <Card key={i} title={d.title} type={d.type}/>
          ))}
        </div>
      </div>
    )
  }
}
