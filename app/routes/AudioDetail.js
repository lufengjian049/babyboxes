import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity,
    Slider,
    FlatList, Animated } from 'react-native'
import Modal from 'react-native-modalbox'
import Spinner from 'react-native-loading-spinner-overlay'
import { Audio } from 'expo'
import { FontAwesome } from '@expo/vector-icons'
import { connect } from 'dva/mobile'
import RNFS from 'react-native-fs'
import { staticsDomin, window } from '../utils/constants'
import pageDecorator from '../hocs/PageDecorator'
import LoadingSpinner from '../components/LoadingSpinner'
import ViewPort from '../components/ViewPort'

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

const LOOPING_TYPE_ALL = 0
const LOOPING_TYPE_ONE = 1
const LOOPING_TYPE_RANDOM = 2
const LOOPING_ARRAY = [LOOPING_TYPE_ALL, LOOPING_TYPE_ONE, LOOPING_TYPE_RANDOM]
const LOOPING_TYPE_ICONS = { 0: 'bars', 1: 'repeat', 2: 'random' }

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

const color = '#FFDB42'

@pageDecorator
@connect(({ audio }) => ({
  ...audio,
}))
class AudioDetail extends Component {
  constructor(props) {
    super(props)
    this.PlayList = []
    this.audios = []
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
    console.log(RNFS.CachesDirectoryPath)
    console.log(RNFS.DocumentDirectoryPath)
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
      this.audios = audios
      this.updateAudioForIndex()
    }
  }
  componentWillUnmount() {
    this.emptySound()
  }
  advanceIndex(forward) {
    if (this.state.looptype === LOOPING_TYPE_RANDOM) {
      this.randomIndex()
    } else {
      this.index =
        (this.index + (forward ? 1 : this.PlayList.length - 1)) % this.PlayList.length
    }
  }
  randomIndex() {
    this.index = Math.ceil(Math.random() * (this.PlayList.length - 1))
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
      const curaudio = this.PlayList[this.index]
      this.props.actions.refresh({ title: curaudio.name || 'Error' })
      this.setState({
        isloading: false,
        soundname: curaudio.name,
        duration: curaudio.duration,
      })
    }
  }
  updateStatus = (status) => {
    if (status.isLoaded) {
      this.setState({
        position: status.positionMillis,
        isplaying: status.isPlaying,
        // looptype
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
      this.updateAudioForIndex(this.state.isplaying)
    }
  }
  backPress = () => {
    if (this.sound != null) {
      this.advanceIndex(false)
      this.updateAudioForIndex(this.state.isplaying)
    }
  }
  getSlidePosition() {
    if (this.sound && this.state.position && this.state.duration) {
      return this.state.position / this.state.duration
    }
    return 0
  }
  onSeekSliderValueChange = () => {
    if (this.sound && !this.isSeeking) {
      this.isSeeking = true
      this.shouldPlayAtEndOfSeek = this.state.isplaying
      this.sound.pauseAsync()
    }
  }
  onSeekSliderSlidingComplete = async value => {
    if (this.sound) {
      this.isSeeking = false
      await this.sound.setPositionAsync(value * this.state.duration)
      if (this.shouldPlayAtEndOfSeek) {
        this.sound.playAsync()
      }
    }
  }
  getNextLoop() {
    const curloopindex = LOOPING_ARRAY.indexOf(this.state.looptype)
    return LOOPING_ARRAY[(curloopindex + 1) % LOOPING_ARRAY.length]
  }
  loopPress = () => {
    const nextLoop = this.getNextLoop()
    this.sound.setIsLoopingAsync(nextLoop === LOOPING_TYPE_ONE)
    this.setState({
      looptype: nextLoop,
    })
  }
  getCategoryName() {
    return this.props.list.find((item) => item.id === this.props.id).name
  }
  itemPressToPlay = (index) => {
    this.index = index
    this.updateAudioForIndex(true)
  }
  async emptySound() {
    if (this.sound) {
      await this.sound.unloadAsync()
      this.sound.setCallback(null)
    }
  }
  //
  async updateAudioForIndex(playing) {
    if (this.sound) {
      await this.sound.unloadAsync()
      this.sound.setCallback(null)
    }
    this.sound = null
    this.updateAudioLoading(true)
    const sound = await this.PlayList[this.index].getLoadedSound()
    await sound.setIsLoopingAsync(this.state.loopingType === LOOPING_TYPE_ONE)
    await sound.setVolumeAsync(1)
    sound.setCallbackPollingMillis(1000)
    sound.setCallback(this.updateStatus)
    this.sound = sound

    if (playing) {
      await this.sound.playAsync()
    } else {
      await this.sound.getStatusAsync()
    }
    this.updateAudioLoading(false)
  }
  render() {
    if (this.props.fetching) {
      return <LoadingSpinner animating />
    }
    if (!this.props.fetching && this.props.loaded) {
      return (
        <ViewPort nobottom>
          <View style={styles.wordsWrapper}>
            <Text style={{ fontSize: 18 }}>
              {this.PlayList.length && this.PlayList[this.index].words || '还没有歌词哦，还是快快添加...'}
            </Text>
          </View>
          <View style={styles.toolsWrapper}>
            <FontAwesome name="heart-o" size={30} />
            <FontAwesome name="arrow-circle-o-down" size={30} />
          </View>
          <View style={styles.slideWrapper}>
            <Text>{this.getMMSSFromMillis(this.state.position)}</Text>
            <Slider
              style={styles.slideStyle}
              value={this.getSlidePosition()}
              onValueChange={this.onSeekSliderValueChange}
              onSlidingComplete={this.onSeekSliderSlidingComplete}
              disabled={this.state.isloading}
              minimumTrackTintColor={color}
            />
            <Text>{this.getMMSSFromMillis(this.state.duration)}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <IconBtn name={LOOPING_TYPE_ICONS[this.state.looptype]} color={color} btnpress={this.loopPress} />
            </View>
            <View style={{ flex: 3, flexDirection: 'row', justifyContent: 'center' }}>
              <IconBtn
                name="step-backward" color={color} size={50} iconstyle={{ flex: 1, alignItems: 'center' }}
                btnpress={this.backPress}
              />
              <IconBtn
                name={this.state.isplaying ? 'play-circle' : 'pause-circle'} color={color} size={50}
                btnpress={this.palyPauseAudio} iconstyle={{ flex: 1, alignItems: 'center' }}
              />
              <IconBtn
                name="step-forward" color={color} size={50} iconstyle={{ flex: 1, alignItems: 'center' }}
                btnpress={this.forwardPress}
              />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <IconBtn name="list" color="#ffdb42" btnpress={() => this.modallist.open()} />
            </View>
          </View>
          <Modal style={styles.modal} position={'bottom'} ref={(ref) => { this.modallist = ref }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalFont}>{this.getCategoryName()}</Text>
            </View>
            <AnimatedFlatList
              key={'modalflatlist'} data={this.audios} renderItem={
                ({ item, index }) => <ListItem
                  isplaying={(index === this.index) && this.state.isplaying}
                  itemPressToPlay={this.itemPressToPlay} {...item} index={index}
                />
              }
              style={styles.modalflatlist} keyExtractor={(item) => item.id}
            />
            <TouchableOpacity style={styles.modalBottom} onPress={() => this.modallist.close()} activeOpacity={1}>
              <View>
                <Text style={styles.modalFont}>关闭</Text>
              </View>
            </TouchableOpacity>
          </Modal>
          <Spinner visible={this.state.isloading} textContent={'加载音乐ing...'} textStyle={color} />
        </ViewPort>
      )
    }
    return null
  }
}

const ListItem = (props) => (
  <TouchableOpacity style={styles.modalitem} onPress={() => props.itemPressToPlay(props.index)}>
    <View style={styles.itemWrapper}>
      <FontAwesome name="music" size={16} style={[{ marginRight: 4 }, props.isplaying ? { color } : null]} />
      <Text style={[props.isplaying ? { color } : null]}>{props.name}</Text>
      {
        props.isplaying ? <FontAwesome name="play" style={styles.rightItemIcon} size={16} /> : null
      }
    </View>
  </TouchableOpacity>
)

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
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordsWrapper: {
    flexGrow: 1, flexBasis: 180, borderBottomWidth: 1, borderBottomColor: '#ccc', justifyContent: 'center', alignItems: 'center',
  },
  toolsWrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  slideWrapper: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  slideStyle: {
    flex: 1, marginLeft: 4, marginRight: 4,
  },
  modal: {
    height: 400,
    paddingBottom: 50,
    opacity: 0.9,
    position: 'relative',
  },
  modalFont: {
    fontSize: 16,
  },
  modalBottom: {
    flex: 1,
    width: window.width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  modalHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalflatlist: {
    height: 300,
  },
  modalitem: {
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemWrapper: {
    flexDirection: 'row',
    position: 'relative',
  },
  rightItemIcon: {
    position: 'absolute',
    right: 10,
    color,
  },
})

export default AudioDetail
