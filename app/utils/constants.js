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

const themeColor = {
  theme1: '#ffdb42',
}

export {
    window,
    alertTitle,
    themeColor,
}
