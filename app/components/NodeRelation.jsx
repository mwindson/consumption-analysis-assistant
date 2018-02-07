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
    const getSourceName = (source) => {
      if (source === 'hudong') return '互'
      if (source === 'maigoo') return '买'
      return '百'
    }
    const textHighLight = (text, keyword) => (
      <div className="content">{text.split(keyword).reduce((prev, current, i) => {
        if (i === 0) {
          return prev.concat(current)
        } else {
          return prev.concat(<span style={{ color: 'red' }}>{keyword}</span>).concat(current)
        }
      }, [])}
      </div>
    )

    return (
      <div className="node-relation">
        <h3 className="title">
          <span>{relations.source}</span>
          <span style={{ color: 'black' }}>——></span>
          <span>{relations.target}</span>
        </h3>
        {relations.relation ? (
          <div className="relation">
            {relations.relation.map((r, i) => (
              <p>
                <span className="level">{i + 1}.{r.level2}{r.level2 !== '' && r.level3 !== '' ? ' - ' : ''}{r.level3}
                  <span className="source">{getSourceName(r.source)}</span>
                </span>
                {textHighLight(r.para, r.linkWord)}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
}
