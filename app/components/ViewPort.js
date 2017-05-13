import React from 'react'
import { View, Platform } from 'react-native'
import { window } from '../utils/constants'

const ViewPort = (props) => {
  const navHeight = Platform.OS === 'ios' ? 64 : 54
  const curHeight = window.height - navHeight - (props.nobottom ? 0 : 50)
  return (
    <View
      {...props} style={[props.style, { width: window.width,
        height: curHeight,
        top: navHeight }]}
    >
      {props.children}
    </View>
  )
}

export default ViewPort
