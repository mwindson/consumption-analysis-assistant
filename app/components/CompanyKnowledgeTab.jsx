import React from 'react'
import { List, Map, fromJS } from 'immutable'
import { connect } from 'react-redux'
import CommonCard from 'components/cards/CommonCard'
import 'style/PersonKnowledgeTab.styl'

const mapStateToProps = state => state.toObject()

@connect(mapStateToProps)
export default class CompanyKnowledgeTab extends React.Component {

  render() {
    const { cardData } = this.props
    if (cardData.isEmpty()) {
      return null
    }
    let infoBox = null
    if (!fromJS(cardData.get('optional')).filter(x => x.get('key') === 'qixin_info_box').first().get('value').isEmpty()) {
      infoBox = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'qixin_info_box').first().get('value')
    } else if (!fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box').first().get('value').isEmpty()) {
      infoBox = fromJS(cardData.get('optional')).filter(x => x.get('key') === 'info_box').first().get('value')
    }

    let company = Map({
      title: '企业信息',
      imgUrl: 'app/static/image/company.png',
      name: cardData.get('name'),
      desc: '',
      attr: Map({
        '公司地址': cardData.get('address'),
        '官网': cardData.get('officialWebsite'),
        '联系方式': cardData.get('telephone'),
        '邮箱': cardData.get('email'),
      }),
    })
    if (cardData.get('optional')) {
      cardData.get('optional').forEach((item) => {
        if (typeof item.get('value') === 'string') {
          company = company.set('attr', company.get('attr').set(item.get('key'), item.get('value')))
        }
      })
    }
    const companyAttr = Map({
      name: '企业资料',
      attr: infoBox.isEmpty() ? null : infoBox,
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
