import { Dimensions, PixelRatio } from 'react-native'

const window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  onePR: 1 / PixelRatio.get(),
}

export {
    window,
}
