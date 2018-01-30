import React from 'react'
import popUpHoc from 'hoc/popUpHoc'
import 'style/NodeRelation.styl'

@popUpHoc
export default class NodeRelation extends React.Component {
  render() {
    const { relations } = this.props
    if (!relations) {
      return null
    }
    return (
      <div className="node-relation">
        <h3 className="title"><span>{relations.source}</span>与<span>{relations.target}</span></h3>
        {relations.relation ? <div>{relations.relation.map((r, i) => (<p>{`${i + 1}. ${r.description}`}</p>))}</div> : null}
      </div>
    )
  }
}

