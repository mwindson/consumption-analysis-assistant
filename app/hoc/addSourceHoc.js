import React from 'react'
import classNames from 'classnames'
import * as A from 'actions'
import OriginData from 'components/OriginData'
import 'style/ComponentWithSource.styl'

export default function addSourceHoc(Component) {
  return class ComponentWithSource extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        show: false,
      }
    }

    close = () => {
      this.setState({ show: false })
    }
    fetchOriginData = (id) => {
      this.props.dispatch({ type: A.FETCH_ORIGIN_DATA, id })
      this.setState({ show: true })
    }


    render() {
      const { cardData } = this.props
      const dataSource = cardData.get('outEntities')
      const getSourceName = (source) => {
        if (source === 'hudong') return '互动百科'
        if (source === 'wiki') return '中文维基'
        return '百度百科'
      }
      return (
        <div className="component-with-source">
          {dataSource ?
            <div className="source-buttons">
              <div className="text">数据来源：</div>
              <div className="buttons">
                {dataSource.map((s, i) => {
                  const source = s.get('id').split(':')[0]
                  return (
                    <div
                      key={`source-${i}`}
                      className={classNames('source-button', { hudong: source === 'hudong' }, { wiki: source === 'wiki' })}
                      onClick={() => this.fetchOriginData(s.get('id'))}
                      title={`${getSourceName(source)}:${s.get('name')}`}
                    >
                      {s.get('name')}
                    </div>
                  )
                })}
              </div>
            </div> : null}
          <Component {...this.props} />
          <OriginData show={this.state.show} onClose={this.close} />
        </div>
      )
    }
  }
}
