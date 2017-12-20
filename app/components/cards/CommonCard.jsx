import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import classNames from 'classnames'
import { fromJS } from 'immutable'
import { ArrowTop, ArrowBottom, SkipIcon } from 'components/Icons'
import 'style/CommonCard.styl'

export default class CommonCard extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    hasExpand: PropTypes.bool.isRequired,
    truncated: PropTypes.bool,
    attr: ImmutablePropTypes.list,
    imgUrl: PropTypes.string,
  }
  static defaultProps = {
    title: '',
    imgUrl: 'app/static/image/no_picture.jpg',
    truncated: false,
    attr: fromJS([]),
  }


  state = {
    expand: !this.props.truncated,
  }

  handleExpand = () => {
    this.setState({ expand: !this.state.expand })
  }

  render() {
    const {
      title, imgUrl, name, content, hasExpand, truncated, attr,
    } = this.props
    const { expand } = this.state
    return (
      <div className={classNames('common-card', { expand })}>
        <div className={classNames('title', { exist: title !== '' })}>{title}</div>
        <div className="content">
          <div className="image"><img src={imgUrl || 'app/static/image/no_picture.jpg'} alt="" /></div>
          <div className="intro">
            <div className="name">{name}</div>
            <div className={classNames('text', { truncated: expand })}>
              {fromJS(content.split('\u2764')).map((d, i) => (<div key={i}>{d}</div>))}
              {attr.map((v, i) => {
                if (!v.get('value')) {
                  return null
                } else if (typeof v.get('value') === 'string' && v.get('value').match(/(http:\/\/[\s]*|https:\/\/[\s]*)/)) {
                  return (
                    <div className="url" key={`attr-${i}`}>
                      <a href={v.get('value')} target="about_blank"><SkipIcon /></a>
                    </div>
                  )
                } else {
                  return (<div key={`attr-${i}`}>{`${v.get('key')}：${v.get('value')}`}</div>)
                }
              })}
            </div>
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
