// 页面Decorator
import React, { Component } from 'react'
import { View, StyleSheet, Platform } from 'react-native'

const pageDecorator = WrappedComponent => {
  class PageDecorator extends Component {
    render() {
      console.log("page decorator")
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
