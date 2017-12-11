import React from 'react'
import { Portal } from 'react-portal'
import classNames from 'classnames'
import 'style/ComponentPopUp.styl'

export default function popUpHoc(Component) {
  return class PopUpComponent extends React.Component {
    onClose = () => {
      this.props.onClose()
    }

    render() {
      const { show } = this.props
      return (
        <Portal node={document && document.getElementById('container')}>
          <div className={classNames('component-pop-up', { show })}>
            <div className="inner">
              <div className="close-button" onClick={this.onClose}>
                关闭
              </div>
              <Component {...this.props} />
            </div>
          </div>
        </Portal>
      )
    }
  }
}
