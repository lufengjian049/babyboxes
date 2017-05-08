import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import pageDecorator from '../hocs/PageDecorator'
import LoadingSpinner from '../components/LoadingSpinner'
import { Grid, Col } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons'
import { connect } from 'dva/mobile'
import ViewPort from '../components/ViewPort'

@pageDecorator
@connect(({ audio }) => ({
  ...audio,
}))
class AudioDetail extends Component {
  // constructor(props) {
  //   super(props)
  // }
  componentDidMount() {
    this.props.dispatch(this.props.createAction('audio/getAudioById')({ id: this.props.id }))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching !== this.props.fetching && !nextProps.fetching) {
      const audios = nextProps.audios[this.props.id] || []
      this.setState({
        audios,
      })
      this.props.actions.refresh({ title: audios[0] && audios[0].name || 'Error' })
    }
  }

  render() {
    if (this.props.fetching) {
      return <LoadingSpinner animating />
    }
    return (
      <ViewPort nobottom>
        <View style={{flexGrow:1,flexBasis:180}}>
          <Text>背景 歌词区</Text>
        </View>
        <View style={{height:60}}>
           <Text>按钮区：收藏 下载 </Text>
        </View>
        <View style={{height:50}}>
           <Text>时间进度条区: 当前时间- 进度条 - 总时长</Text>
        </View>
        <BottomOperateArea />
      </ViewPort>
    )
  }
}
// <Text>歌曲操作区： 随机/单曲、顺序 上一首 暂停/开始 下一首 列表</Text>
//     <FontAwesome name="heart" size={20} color="red" />
//     <FontAwesome name="download" size={20} />
//     <FontAwesome name="random" size={20} />
//     <FontAwesome name="bars" size={20} />
//     <FontAwesome name="repeat" size={20} />
//     <FontAwesome name="step-backward" size={20} />
//     <FontAwesome name="play-circle" size={20} />
//     <FontAwesome name="pause-circle" size={20} />
//     <FontAwesome name="step-forward" size={20} />
//     <FontAwesome name="list" size={20} />

const BottomOperateArea = (props) => (
  <View style={styles.bottomContainer}>
    <View style={{ flex: 1, alignItems: 'center' }}>
      <IconBtn name="bars" color="#ffdb42" />
    </View>
    <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center' }}>
      <IconBtn name="step-backward" color="#ffdb42" size={50} iconstyle={{ flex: 1, alignItems: 'center' }} />
      <IconBtn name="play-circle" color="#ffdb42" size={50} iconstyle={{ flex: 1, alignItems: 'center' }} />
      <IconBtn name="step-forward" color="#ffdb42" size={50} iconstyle={{ flex: 1, alignItems: 'center' }} />
    </View>
    <View style={{ flex: 1, alignItems: 'center' }}>
      <IconBtn name="list" color="#ffdb42" />
    </View>
  </View>
)

const IconBtn = (props) => (
  <TouchableOpacity onPress={() => props.btnpress} style={props.iconstyle}>
    <FontAwesome name={props.name} size={props.size || 30} color={props.color} />
  </TouchableOpacity>
)
// react-native-audio-streaming
// react-native-sound
// react-native-fs

const styles = StyleSheet.create({
  bottomContainer: {
    // bottom: 0 ,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
})

export default AudioDetail
