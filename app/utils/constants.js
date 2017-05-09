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

const domain = 'http://princekin.vicp.io:90'

const staticsDomin = `${domain}/statics/`

export {
    window,
    alertTitle,
    themeColor,
    domain,
    staticsDomin,
}
