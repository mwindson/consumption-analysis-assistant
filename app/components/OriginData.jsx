import React from 'react'
import { fromJS, Map, List } from 'immutable'
import { connect } from 'react-redux'
import popUpHoc from 'hoc/popUpHoc'
import 'style/OriginData.styl'

const mapStateToProps = state => state.cards.toObject()

@connect(mapStateToProps)
@popUpHoc
export default class OriginData extends React.Component {
  render() {
    const { originData } = this.props
    const dataShow = (data) => {
      if (!data) return null
      if (List.isList(data)) {
        return (data.map((d, i) => (
          <div>{dataShow(d)}</div>
        )))
      } else if (Map.isMap(data)) {
        return (<div>{data.get('key')}{dataShow(data.get('value'))}</div>)
      } else {
        return fromJS(data.split('\u2764')).map((d, i) => (<div className="origin-data_text">{d}</div>))
      }
    }
    return (
      <div className="origin-data">
        {originData
          .filterNot((v, k) => k === 'image' || k === 'type')
          .valueSeq()
          .map((value, key) => dataShow(value))}
      </div>
    )
  }
}
