import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { LineChart, Line, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from 'recharts'
import 'style/BrandTrendCards.styl'

const mapStateToProps = state => Object.assign({}, state.cards.toObject())

@connect(mapStateToProps)
export default class BrandTrendCards extends React.Component {
  render() {
    const { cardData } = this.props
    if (!cardData || cardData.isEmpty()) {
      return (
        <div className="product-card">暂无更多信息</div>
      )
    }
    const trendData = null
    const positive = cardData.get('posPercent')
    const posComments = cardData.get('pos')
    const negComments = cardData.get('neg')
    return [trendData ?
      <div className="trend-card">
        <div className="title">图表走势</div>
        <LineChart
          width={580}
          height={300}
          data={trendData.toJS()}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            padding={{ left: 30, right: 30 }}
            tickLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <CartesianGrid vertical={false} />
          <Tooltip />
          <Legend align="right" verticalAlign="top" iconType="rect" />
          <Line dataKey="s1" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line dataKey="s2" stroke="#82ca9d" />
        </LineChart>
      </div> : null,
      <div className="trend-card">
        <div className="title">正负情感值</div>
        <div className="emotion">
          正向
          <div className="bar">
            <div
              className="positive"
              style={{ width: `${((positive * 80) + 10).toFixed(2)}%` }}
            >
              {(positive * 100).toFixed(2)}%
            </div>
            <div
              className="negative"
              style={{ width: `${(((1 - positive) * 100) + 10).toFixed(2)}%` }}
            >
              {(100 - (positive * 100)).toFixed(2)}%
            </div>
          </div>
          负向
        </div>
      </div>,
      <div className="trend-card">
        <div className="title">评论</div>
        <div className="comments">
          <div className="comment-list">
            {posComments.toArray().map((c, i) => (
              <div key={i} className="comment">
                <div className="text">{c.get(0)}</div>
              </div>
            ))}
            {negComments.toArray().map((c, i) => (
              <div key={i} className="comment">
                <div className={classNames('text', 'negative')}> {c.get(0)}</div>
              </div>))}
          </div>
        </div>
      </div>,
    ]
  }
}
