import React from 'react'
import popUpHoc from 'hoc/popUpHoc'
import 'style/NodeRelation.styl'

@popUpHoc
export default class NodeRelation extends React.Component {
  state = {
    isDesc: false,
  }
  render() {
    const { relations } = this.props
    if (!relations) {
      return null
    }
    const getSourceName = (source) => {
      if (source === 'hudong') return '互'
      if (source === 'maigoo') return '买'
      return '百'
    }
    return (
      <div className="node-relation">
        <h3 className="title">
          <span>{relations.source}</span>与<span>{relations.target}</span>
          <button onClick={() => this.setState({ isDesc: !this.state.isDesc })} style={{ float: 'left' }}>
            切换成{!this.state.isDesc ? '短句' : '段落'}
          </button>
        </h3>
        {relations.relation ? (
          <div className="relation">
            {relations.relation.map((r, i) => (
              <p>
                {i + 1}
                <span className="source">{getSourceName(r.source)}</span>
                {this.state.isDesc ? r.description : r.para}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}
