// 页面Decorator
import React, { Component } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

const pageDecorator = WrappedComponent => {
  class PageDecorator extends Component {
    // constructor(props) {
    //   super(props)
    //   this.state = {
    //     isRefreshing: false,
    //   }
    //   this.onRefresh = this.onRefresh.bind(this)
    //   this.refreshCallBack = this.refreshCallBack.bind(this)
    // }
    // onRefresh() {
    //   this.setState({ isRefreshing: true })
    //   console.log('refreshing')
    // }
    // refreshCallBack() {
    //   this.setState({isRefreshing: false })
    // }
    render() {
      console.log('page decorator')
      return (
        <View style={styles.container}>
          <WrappedComponent {...this.props} />
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
