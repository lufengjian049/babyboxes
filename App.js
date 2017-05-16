// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import Router from './app/Router'

// export default class App extends React.Component{
//   render() {
//     return (
//       <Router />
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React from 'react'
// import { AppRegistry } from 'react-native'
import dva from 'dva/mobile'

import { registerModels } from './app/models'
import Router from './app/Router'

const timeMiddleware = () => next => action => {
  console.log(action.type)
  let start = Date.now()
  const result = next(action)
  let end = Date.now()
  console.log(action.type + " take =" + (end - start))

  return result
}
const app = dva({
  initialState: {},
  onError(e) {
    console.log('onError', e)
  },
  onAction: timeMiddleware
})
registerModels(app)
app.router(() => <Router />)
const App = app.start()

export default App
