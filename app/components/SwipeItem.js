// 滑动组件
// https://github.com/yzsolo/react-native-swipe-left/blob/master/index.js
import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, PanResponder, Animated, TouchableHighlight, Text } from 'react-native'

export default class SwipeItem extends Component {
  static propTypes = {
    duration: PropTypes.number,
  }
  static defaultProps = {
    duration: 150,
  }
  constructor(props) {
    super()
    this.state = {
      itemTranslateX: new Animated.Value(0),
      btnTranslateX: new Animated.Value(0),
      isopen: false,
      height: 0,
    }
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 0,
      // onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dx) > 0,
      onPanResponderMove: (evt, gestureState) => {
        this._onPanResponderMove(evt, gestureState)
      },
      onPanResponderRelease: (evt, gestureState) => {
        this._onPanResponderRelease(evt, gestureState)
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this._onPanResponderTerminate(evt, gestureState)
      },
    })
  }
  _getBtnBoxWidth() {
    return 80
  }
  // 处理 父级组件 中 有scrollview的情况 禁止滚动 和 允许滚动
  toggleScroll(status) {
    const root = this.props.root
    root.setState({
      scrollEnable: status,
    })
  }
  // 移动处理函数
  _onPanResponderMove(evt, gestureState) {
    let dx
    const _width = this._getBtnBoxWidth()
    const right = -_width

    if (Math.abs(gestureState.dx) > 5) {
      this.toggleScroll(false)
    }

    if (this.state.isopen) {
      dx = right + gestureState.dx
      if (dx < 50) {
        this.setState({
          itemTranslateX: new Animated.Value(dx),
        })
      }
    } else {
      dx = gestureState.dx
      if (dx < -10) {
        dx += 10
        if (dx >= right) {
          this.setState({
            btnTranslateX: new Animated.Value(dx),
          })
        } else {
          this.setState({
            btnTranslateX: new Animated.Value(right),
          })
        }
        if (dx < 50) {
          this.setState({
            itemTranslateX: new Animated.Value(dx),
          })
        }
      }
    }
  }

  // 动作结束(抬起手指)
  _onPanResponderRelease(evt, gestureState) {
    const btnBoxWidth = this._getBtnBoxWidth()
    const range = -(btnBoxWidth / 2)
    const dx = gestureState.dx
    let toValue
    let isopen
    if (dx < range && dx !== range) { // 全部打开
      toValue = -btnBoxWidth
      isopen = true
      this.toggleScroll(false)
    } else {
      toValue = 0
      isopen = false
      this.toggleScroll(true)
    }
    this.setState({
      isopen,
    })
    this.moveAnimate(this.state.itemTranslateX, toValue)
    this.moveAnimate(this.state.btnTranslateX, toValue)
    console.log(gestureState.dx)
  }
  // 响应者权力已经交出
  _onPanResponderTerminate(evt, gestureState) {

  }
  moveAnimate(animatedValue, toValue) {
    Animated.spring(animatedValue, {
      toValue,
      duration: 150,
    }).start()
  }
  render() {
    const _width = this._getBtnBoxWidth()
    return (
      <View onLayout={(e) => { this.setState({ height: e.nativeEvent.layout.height }) }}>
        <View style={styles.container}>
          <Animated.View
            {...this._panResponder.panHandlers}
            style={[styles.animateContainer, {
              transform: [{ translateX: this.state.itemTranslateX }],
            }]}
          >
            {this.props.children}
          </Animated.View>
          <Animated.View
            style={[
              styles.btnBox, {
                width: _width,
                right: -_width,
                height: this.state.height,
                transform: [{ translateX: this.state.btnTranslateX }],
              },
            ]}
          >
            <TouchableHighlight style={[styles.btnitem, { backgroundColor: 'red', width: _width, height: this.state.height }]} onPress={this.props.deleteHandle}>
              <Text>Delete</Text>
            </TouchableHighlight>
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  animateContainer: {
    flex: 1,
  },
  btnBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  btnitem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
