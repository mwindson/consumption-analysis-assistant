import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { LineChart, Line, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from 'recharts'
import 'style/BrandTrendCards.styl'

export default class BrandTrendCards extends React.Component {
  static propTypes = {
    trendData: ImmutablePropTypes.list.isRequired,
    emotion: PropTypes.number.isRequired,
    comments: ImmutablePropTypes.list.isRequired,
  }

  render() {
    const { trendData, emotion, comments } = this.props
    return (
      <div className="cards">
        <div className="trend-card">
          <div className="title">图表走势</div>
          <LineChart
            width={600}
            height={300}
            data={trendData.toJS()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
        </div>
        <div className="trend-card">
          <div className="title">正负情感值</div>
          <div className="emotion">
            负向
            <div className="bar">
              <div className="negative" style={{ width: `${emotion * 100}%` }}>{emotion * 100}%</div>
              <div className="positive" style={{ width: `${100 - (emotion * 100)}%` }}>{100 - (emotion * 100)}%</div>
            </div>
            正向
          </div>
        </div>
        <div className="trend-card">
          <div className="title">热门评论</div>
          <div className="comments-list">
            {comments.toArray().map((c, i) =>
              (<div key={i} className="comment">
                <div className="person">
                  <img src={c.get('headImg')} alt="头像" />
                  <div className="intro">{c.get('nickname')}</div>
                </div>
                <div className="text">{c.get('content')}</div>
              </div>))}
          </div>
        </div>
      </div>
    )
  }
}
