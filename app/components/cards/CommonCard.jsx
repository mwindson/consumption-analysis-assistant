import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { fromJS, Map } from 'immutable'
import { ArrowTop, ArrowBottom } from 'components/Icons'
import 'style/CommonCard.styl'

export default class CommonCard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    hasExpand: PropTypes.bool.isRequired,
    truncated: PropTypes.bool.isRequired,
    attr: ImmutablePropTypes.map.isRequired,
    imgUrl: PropTypes.string,
  }
  static defaultProps = {
    imgUrl: 'app/static/image/no_picture.jpg',
  }


  state = {
    expand: !this.props.truncated,
  }

  handleExpand = () => {
    this.setState({ expand: !this.state.expand })
  }

  render() {
    const { title, imgUrl, name, content, hasExpand, truncated, attr } = this.props
    const { expand } = this.state
    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="content">
          <div className="image"><img src={imgUrl || 'app/static/image/no_picture.jpg'} alt="" /></div>
          <div className="intro">
            <div className="name">{name}</div>
            {attr.size === 0 ?
              <div className={classNames('text', { truncated: expand })}>
                {fromJS(content.split('\u2764')).map((d, i) => (<div key={i}>{d}</div>))}
              </div> :
              <div className={classNames('text', { truncated: expand })}>
                {attr.entrySeq().map((v, k) => {
                  if (!Map.isMap(v[1]) && v[0] && v[1]) {
                    return v[0] !== '官网' ?
                      <div key={k}>{`${v[0]}: ${v[1]}`}</div> :
                      <div key={k}>{`${v[0]}: `}<a href={v[1]} target="_blank">{v[1]}</a></div>
                  } else {
                    return null
                  }
                })}
              </div>}
          </div>
        </div>
        {hasExpand && truncated ?
          <div className="expand" onClick={this.handleExpand}>
            {expand ? <div><ArrowTop />收起</div> : <div><ArrowBottom />展开</div>}
          </div> : null}
      </div>
    )
  }
}
