import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { configure } from 'mobx'
import { IntlProvider } from 'react-intl'
import { messages, currentLang } from './lang/index'

configure({ enforceActions: 'observed' })

async function run () {
  try {
    ReactDOM.render(
      <IntlProvider locale={currentLang} messages={messages[currentLang]}>
        <App />
      </IntlProvider>, document.getElementById('container')
    )
  } catch (e) {
    console.error('run is error', e)
  }
}

run()
