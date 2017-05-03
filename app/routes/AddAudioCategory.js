import React, { Component } from 'react'

import { StyleSheet, View, TextInput } from 'react-native'

import pageDecorator from '../hocs/PageDecorator'

import { window } from '../utils/constants'

@pageDecorator
class AddAudioCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputvalue: '',
    }
    this.changeTextHandle = this.changeTextHandle.bind(this)
  }
  changeTextHandle(text) {
    this.setState({
      inputvalue: text,
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoFocus style={styles.textInputStyle}
          placeholder="歌单标题"
          value={this.state.inputvalue}
          onChangeText={this.changeTextHandle}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textInputStyle: {
    height: 40,
    marginTop: 8,
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  container: {
    backgroundColor: '#EDEDED',
    height: window.height,
  },
})

export default AddAudioCategory
