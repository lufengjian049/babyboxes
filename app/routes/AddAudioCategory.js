import React, { Component } from 'react'

import { StyleSheet, View, TextInput } from 'react-native'

import { Actions } from 'react-native-router-flux'

import { connect } from 'dva/mobile'

import pageDecorator from '../hocs/PageDecorator'

import { window } from '../utils/constants'

@pageDecorator
@connect(({ audio }) => ({
  ...audio,
}))
class AddAudioCategory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputvalue: '',
    }
    this.changeTextHandle = this.changeTextHandle.bind(this)
    this.saveCategory = this.saveCategory.bind(this)
    this.saveCategoryComplete = this.saveCategoryComplete.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    console.log(`onleftSave-next-${nextProps.onleftSave}`)
    console.log(`onleftSave-this-${this.props.onleftSave}`)
    if (nextProps.onleftSave && nextProps.onleftSave !== this.props.onleftSave) {
      this.saveCategory()
    }
    if (!nextProps.fetching && nextProps.loaded && this.props.fetching !== nextProps.fetching && this.props.loaded !== nextProps.loaded){
      this.saveCategoryComplete()
    }
  }
  changeTextHandle(text) {
    this.setState({
      inputvalue: text,
    })
  }
  saveCategory() {
    if (!this.state.inputvalue) {
      this.props.alertmsg({
        msg: '请输入标题',
        okCallback: () => {
          Actions.addcategoryview()
          this.addcategoryinput.focus()
          // input focus
        },
      })
    } else {
      this.props.dispatch(this.props.createAction("audio/addcategory")({name:this.state.inputvalue}))
    }
  }
  saveCategoryComplete() {
    this.props.showToast("标题添加成功",()=>{
      Actions.pop()
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(ref) => { this.addcategoryinput = ref }}
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
