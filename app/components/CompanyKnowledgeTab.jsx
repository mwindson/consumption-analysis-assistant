import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.reducer.toObject()

@connect(mapStateToProps)
export default class CompanyKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    let info = List()
    const qixinInfoBox = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'qixin_info_box')
    const infoBox = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box')
    if (!qixinInfoBox.isEmpty() && !qixinInfoBox.first().get('value').isEmpty()) {
      info = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'qixin_info_box').first().get('value')
    } else if (!infoBox.isEmpty() && !fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box').first().get('value').isEmpty()) {
      info = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box').first().get('value')
    }

    let company = Map({
      title: '企业信息',
      imgUrl: cardData.get('image'),
      name: cardData.get('name'),
      desc: '',
    })
    let attr = Map()
    if (cardData.get('address')) {
      attr = attr.set('公司地址', cardData.get('address'))
    }
    if (cardData.get('officialWebsite')) {
      attr = attr.set('官网', cardData.get('officialWebsite'))
    }
    if (cardData.get('telephone')) {
      attr = attr.set('联系方式', cardData.get('telephone'))
    }
    if (cardData.get('email')) {
      attr = attr.set('邮箱', cardData.get('email'))
    }
    if (cardData.get('optional')) {
      cardData.get('optional').forEach((item) => {
        if (typeof item.get('value') === 'string') {
          attr = attr.set(item.get('key'), item.get('value'))
        }
      })
    }
    company = company.set('attr', attr)
    const companyAttr = Map({
      name: '企业资料',
      attr: info.isEmpty() ? null : info,
    })
    return (
      <div className="cards">
        <CommonCard
          imgUrl={company.get('imgUrl')}
          title={company.get('title')}
          name={company.get('name')}
          content={company.get('desc')}
          attr={company.get('attr')}
          hasExpand
          truncated={false}
        />
        {companyAttr.get('attr') ?
          <div className="person-cards">
            <div className="person-content">
              <div className="person-intro">
                <div className="person-name">{companyAttr.get('name')}</div>
              </div>
            </div>
            <div className="person-attr">
              {companyAttr.get('attr').map((item, index) =>
                <div key={index} className="attr">
                  <div className="key">{item.get('key')}</div>
                  <div className="value">{item.get('value')}</div>
                </div>)}
            </div>
          </div> : null}
      </div>
    )
  }
}
