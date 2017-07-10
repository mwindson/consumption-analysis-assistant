import React from 'react'
import 'style/KnowledgeGraph.styl'
import {drawGraph} from 'components/graph/drawGraph'

export default class KnowledgeGraph extends React.Component {
  componentDidMount() {
    drawGraph()
  }

  render() {
    return (
      <div className="knowledge-graph">
        <div className="diagram">
          <svg className="graph-svg" style={{width: '100%', height: '100%'}}>
            <defs>
              <linearGradient id="brandGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#4AF7FF"/>
              </linearGradient>
              <linearGradient id="storeTypeGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#FFFFFF"/>
              </linearGradient>
              <linearGradient id="newsGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#F1D237"/>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.43"/>
              </linearGradient>
              <linearGradient id="productGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D4C9C9" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#EA8484"/>
              </linearGradient>
              <linearGradient id="personGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#2095FF"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="tools">
          tool
        </div>
      </div>
    )
  }
}
