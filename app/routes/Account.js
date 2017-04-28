import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'

class Account extends Component {
  static navigationOptions = {
    title: 'Detail',
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>账号</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Account
