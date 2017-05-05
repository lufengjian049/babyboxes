// 页面Decorator
import React, { Component } from 'react'
import Toast from 'react-native-root-toast'
import { View, StyleSheet, Platform, Alert } from 'react-native'
import { alertTitle } from '../utils/constants'
import { createAction } from '../utils'

const pageDecorator = WrappedComponent => {
  class PageDecorator extends Component {
    constructor(props) {
      super(props)
      this.alertMessage = this.alertMessage.bind(this)
    }
    // onRefresh() {
    //   this.setState({ isRefreshing: true })
    //   console.log('refreshing')
    // }
    // refreshCallBack() {
    //   this.setState({isRefreshing: false })
    // }
    alertMessage(options) {
      // type: warning error confirm
      options = options || {}
      options.type = options.type || 'error'
      const btnArr = [{ text: '确认', onPress: () => options.okCallback() || console.log('confirm callback') }]
      options.type === 'confirm' && btnArr.unshift({
        text: '取消', onPress: () => options.cancelCallback() || console.log('cancel callback'),
      })
      Alert.alert(options.title || alertTitle[options.type],
        options.msg,
        btnArr,
        { cancelable: false })
    }
    showToast(msg, hideCallback) {
      Toast.show(msg, {
        duration: 500,
        position: Toast.positions.CENTER,
        onHide: hideCallback,
      })
    }
    render() {
      console.log('page decorator')
      return (
        <View style={styles.container}>
          <WrappedComponent
            {...this.props} alertmsg={this.alertMessage}
            createAction={createAction} showToast={this.showToast}
          />
        </View>
      )
    }
  }
  return PageDecorator
}

export default pageDecorator

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 64 : 54,
    paddingBottom: 50,
  },
})
