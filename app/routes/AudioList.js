import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { connect } from 'dva/mobile'

import {
  List, ListItem,
} from 'react-native-elements'

import { createAction } from '../utils'

const list = [
  {
    title: '本地音乐',
    icon: 'ios-musical-notes-outline',
  },
  {
    title: '最近播放',
    icon: 'ios-time-outline',
  },
  {
    title: '我的收藏',
    icon: 'ios-heart-outline',
  },
]

// const list2 = [
//   {
//     name: '歌单1',
//     avatar_url: 'https://http://princekin.vicp.io:90/statics/imgs/collect_default_cover.jpg',
//     subtitle: '0首',
//   },
//   {
//     name: 'test歌单2',
//     avatar_url: 'https://http://princekin.vicp.io:90/statics/imgs/collect_default_cover.jpg',
//     subtitle: '8首',
//   },
// ]

class AudioList extends Component {
  componentDidMount() {
    this.props.dispatch(createAction('audio/loadcategory')())
  }
  render() {
    return (
      <View>
        <List>
          {
            list.map((item, i) => (
              <ListItem
                key={`ddd${i}`}
                title={item.title}
                leftIcon={{ name: item.icon, type: 'ionicon' }}
              />
            ))
          }
        </List>
        <View style={styles.playlistheader}>
          <Text>+创建的歌单</Text>
        </View>
        <List>
          {
            this.props.list.map((item, i) => (
              <ListItem
                key={i}
                title={item.name}
                subtitle={item.subtitle}
                avatar={{ uri: item.avatar_url }}
              />
            ))
          }
        </List>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  playlistheader: {
    backgroundColor: '#ccc',
    paddingLeft: 4,
    height: 30,
    justifyContent: 'center',
  },
})

export default connect(({ audio }) => ({
  ...audio,
}))(AudioList)
