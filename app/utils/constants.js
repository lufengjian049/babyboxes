import { Dimensions, PixelRatio } from 'react-native'

const window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePR: 1 / PixelRatio.get(),
}

const alertTitle = {
  warning: '提示信息',
  error: '错误',
  confirm: '确认',
}

export {
    window,
    alertTitle,
}
