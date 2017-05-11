import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Slider } from 'react-native'
import pageDecorator from '../hocs/PageDecorator'
import LoadingSpinner from '../components/LoadingSpinner'
import ViewPort from '../components/ViewPort'
import { Audio } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { connect } from 'dva/mobile'
import { staticsDomin } from '../utils/constants'

class PlayItem {
  constructor(item) {
    this.name = item.name
    this.source = `${staticsDomin}${item.path}`
    this.words = item.words
    this.duration = item.duration
    this.sound = null
  }

  async getLoadedSound() {
    console.log(this.source)
    if (this.sound == null) {
      this.sound = new Audio.Sound({ source: this.source })
    }
    await this.sound.loadAsync()
    return this.sound
  }
}

const DISABLEDOPACITY = 0.5
const LOOPING_TYPE_ALL = 0
const LOOPING_TYPE_ONE = 1
const LOOPING_TYPE_RANDOM = 2
const LOOPING_TYPE_ICONS = { 0: 'bars', 1: 'repeat', 2: 'random' }

@pageDecorator
@connect(({ audio }) => ({
  ...audio,
}))
class AudioDetail extends Component {
  constructor(props) {
    super(props)
    this.PlayList = []
    this.index = 0
    this.sound = null
    this.isSeeking = false
    this.shouldPlayAtEndOfSeek = false
    this.state = {
      sliderValue: 0,
      isloading: false,
      soundname: '',
      duration: null,
      position: null,
      isplaying: false,
      looptype: LOOPING_TYPE_ALL,
    }
    this.palyPauseAudio = this.palyPauseAudio.bind(this)
  }
  componentDidMount() {
    // 获取当前分类下数据
    this.props.dispatch(this.props.createAction('audio/getAudioById')({ id: this.props.id }))
    // 基础设置
    Audio.setIsEnabledAsync(true)
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.fetching !== this.props.fetching && !nextProps.fetching) { // 数据已经请求结束
      const audios = nextProps.audios[this.props.id] || []
      this.PlayList = audios.map((audio) => new PlayItem(audio))

      this.updateAudioForIndex()
    }
  }
  async updateAudioForIndex(playing) {
    if (this.sound) {
      await this.sound.unloadAsync()
      this.sound.setCallback(null)
    }
    this.sound = null
    this.updateAudioLoading(true)
    const sound = await this.PlayList[this.index].getLoadedSound()
    // await sound.setIsLoopingAsync(this.state.loopingType === LOOPING_TYPE_ONE);
    // await sound.setVolumeAsync(this.state.volume);
    await sound.setVolumeAsync(1)
    sound.setCallbackPollingMillis(1000)
    sound.setCallback(this.updateStatus)
    this.sound = sound

    if (playing) {
      await this.sound.playAsync() // Will call callback to update the screen.
    } else {
      await this.sound.getStatusAsync() // Will call callback to update the screen.
    }
    this.updateAudioLoading(false)
  }
  advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : this.PlayList.length - 1)) % this.PlayList.length
  }
  updateAudioLoading(loading) {
    if (loading) {
      this.setState({
        isloading: true,
        soundname: 'loading....',
        duration: null,
        position: null,
        isplaying: false,
      })
    } else {
      var curaudio = this.PlayList[this.index]
      this.props.actions.refresh({ title: curaudio.name || 'Error' })
      this.setState({
        isloading: false,
        soundname: curaudio.name,
        duration: curaudio.duration,
      })
    }
  }
  updateStatus = (status) => {
    // console.log(JSON.stringify(status))
    if (status.isLoaded) {
      this.setState({
        // duration: status.durationMillis,
        position: status.positionMillis,
        isplaying: status.isPlaying,
      })
      if (status.didJustFinish) {
        this.advanceIndex(true)
        this.updateAudioForIndex(true)
      }
    }
  }
  getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000
    const seconds = Math.floor(totalSeconds % 60)
    const minutes = Math.floor(totalSeconds / 60)

    const padWithZero = number => {
      const string = number.toString()
      if (number < 10) {
        return `0${string}`
      }
      return string
    }
    return `${padWithZero(minutes)}:${padWithZero(seconds)}`
  }
  palyPauseAudio() {
    if (this.sound) {
      if (this.state.isplaying) {
        this.sound.pauseAsync()
      } else {
        this.sound.playAsync()
      }
    }
  }
  forwardPress = () => {
    if (this.sound != null) {
      this.advanceIndex(true)
      console.log(this.state.isplaying)
      this.updateAudioForIndex(this.state.isplaying)
    }
  }
  backPress = () => {
    if (this.sound != null) {
      this.advanceIndex(false)
      this.updateAudioForIndex(this.state.isplaying)
    }
  }
  getSlidePosition(){
      if(this.sound && this.state.position && this.state.duration){
          return this.state.position / this.state.duration
      }
      return 0
  }
  onSeekSliderValueChange = (value) =>{
    if(this.sound && !this.isSeeking){
        this.isSeeking = true
        this.shouldPlayAtEndOfSeek = this.state.isplaying
        this.sound.pauseAsync()
    }
  }
  onSeekSliderSlidingComplete = async value =>{
      if(this.sound){
          this.isSeeking = false
          await this.sound.setPositionAsync(value * this.state.duration)
          if(this.shouldPlayAtEndOfSeek){
              this.sound.playAsync()
          }
      }
  }
  loopPress = () => {
      
  }
  // {this.PlayList[this.index].words}
  render() {
    if (this.props.fetching) {
      return <LoadingSpinner animating />
    }
    if (!this.props.fetching && this.props.loaded) {
      return (
        <ViewPort nobottom>
          <View style={{ flexGrow: 1, flexBasis: 180, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center', alignItems:'center' }}>
            <Text style={{fontSize:18}}>{this.PlayList.length && this.PlayList[this.index].words}</Text>
          </View>
          <View
            style={{ height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderBottomWidth: 1,
              borderBottomColor: '#ccc' }}
          >
            <FontAwesome name="heart-o" size={30} />
            <FontAwesome name="arrow-circle-o-down" size={30} />
          </View>
          <View
            style={{ height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 5,
              paddingRight: 5,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              opacity: this.state.isloading ? DISABLEDOPACITY : 1 }}
          >
            <Text>{this.getMMSSFromMillis(this.state.position)}</Text>
            <Slider
              style={{ flex: 1, marginLeft: 4, marginRight: 4 }}
              value={this.getSlidePosition()}
              onValueChange={this.onSeekSliderValueChange}
              onSlidingComplete={this.onSeekSliderSlidingComplete}
              disabled={this.state.isloading}
              minimumTrackTintColor="#FFDB42"
            />
            <Text>{this.getMMSSFromMillis(this.state.duration)}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <IconBtn name={LOOPING_TYPE_ICONS[this.state.looptype]} color="#ffdb42" btnpress={this.loopPress} />
            </View>
            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center' }}>
              <IconBtn name="step-backward" color="#ffdb42" size={50} iconstyle={{ flex: 1, alignItems: 'center' }} btnpress={this.backPress} />
              <IconBtn name={this.state.isplaying ? 'play-circle' : 'pause-circle'} color="#ffdb42" size={50} btnpress={this.palyPauseAudio} iconstyle={{ flex: 1, alignItems: 'center' }} />
              <IconBtn name="step-forward" color="#ffdb42" size={50} iconstyle={{ flex: 1, alignItems: 'center' }} btnpress={this.forwardPress} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <IconBtn name="list" color="#ffdb42" />
            </View>
          </View>
        </ViewPort>
      )
    }
  }
}
// (value) => {
                // this.refs.video.seek(value / 1000)
                // // 判断是否处于播放状态
                // if (this.state.playButton === 'pause-circle') this.setState({videoPause: false})
                // }
            //     onValueChange={}
            // onSlidingComplete={}
// this.setState({
//     videoPause: true,
//     current: this._formatTime(Math.floor(value / 1000))
//     })
// }

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

/* const BottomOperateArea = (props) => (
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
)*/
// onPress={() => props.btnpress} 不行
const IconBtn = (props) => (
  <TouchableOpacity onPress={props.btnpress} style={props.iconstyle}>
    <FontAwesome name={props.name} size={props.size || 30} color={props.color} />
  </TouchableOpacity>
)
// react-native-audio-streaming
// react-native-sound
// react-native-fs

const styles = StyleSheet.create({
  bottomContainer: {
    // bottom: 0 ,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    // paddingBottom: 10,
    // backgroundColor: '#ccc',
    alignItems: 'center',
  },
})

export default AudioDetail
