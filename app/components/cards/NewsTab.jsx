import React from 'react'
import classNames from 'classnames'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { ArrowRight } from 'components/Icons'
import 'style/NewsCards.styl'

export default class NewsCards extends React.Component {
  static propTypes = {
    wordList: ImmutablePropTypes.list.isRequired,
    newsList: ImmutablePropTypes.list.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedKeyword: '',
    }
  }

  handleWordClick = (word) => {
    this.setState({ selectedKeyword: this.state.selectedKeyword === word ? '' : word })
  }

  render() {
    const { wordList, newsList } = this.props
    const { selectedKeyword } = this.state
    const currentNewsList = selectedKeyword === '' ? newsList : newsList.filter(x => x.get('keywords').includes(selectedKeyword))
    return (
      <div className="cards">
        <div className="news-card">
          <div className="title">更多关键词</div>
          <div className="content">
            {wordList.toArray().map((word, i) =>
              (<div
                key={i}
                className={classNames('keyword', { selected: selectedKeyword === word })}
                onClick={() => this.handleWordClick(word)}
              >
                {word}
              </div>))
            }
          </div>
        </div>
        {currentNewsList.toArray().map((news, i) => (
          <div className="news-card" key={i}>
            <div className="title">{news.get('title')}</div>
            <div className="content">
              <img src={news.get('img')} alt="图片" />
              <div className="news-text">{news.get('content')}</div>
            </div>
            <a className="news-link" href={news.get('url')} target="_blank"><ArrowRight />阅读全文</a>
          </div>
        ))}
      </div>
    )
  }
}
