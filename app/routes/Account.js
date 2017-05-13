import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'

import ViewPort from '../components/ViewPort'

class Account extends Component {
  static navigationOptions = {
    title: 'Detail',
  }
  render() {
    return (
      <ViewPort style={styles.container}>
        <Text>账号</Text>
      </ViewPort>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Account
