import React, { Component } from 'react'

import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native'

import { connect } from 'dva/mobile'

import {
  List, ListItem,
} from 'react-native-elements'

import pageDecorator from '../hocs/PageDecorator'

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

@pageDecorator
@connect(({ audio }) => ({
  ...audio,
}))
class AudioList extends Component {
  constructor(props) {
    super(props)
    this.refreshData = this.refreshData.bind(this)
  }
  componentDidMount() {
    this.refreshData()
  }
  refreshData() {
    this.props.dispatch(this.props.createAction('audio/loadcategory')())
  }
  render() {
    let refreshTitle = '下拉刷新...'
    if (this.props.fetching) {
      refreshTitle = '加载中...'
    }
    return (
      <View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.fetching}
              onRefresh={this.refreshData}
              tintColor="#ff0000"
              title={refreshTitle}
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
                }
        >
          <List containerStyle={styles.topListContainer}>
            {
              list.map((item, i) => (
                <ListItem
                  key={`toplistitem${i}`}
                  title={item.title}
                  leftIcon={{ name: item.icon, type: 'ionicon' }}
                />
              ))
            }
          </List>
          <View style={styles.playlistheader}>
            <Text>已创建的歌单({this.props.list.length || ''})</Text>
          </View>
          <List containerStyle={styles.bottomListContainer}>
            {
              this.props.list.map((item, i) => (
                <ListItem
                  hideChevron
                  key={i}
                  title={item.name}
                  subtitle={item.subtitle || '0首歌'}
                  avatar={{ uri: item.avatar_url || 'http://princekin.vicp.io:90/statics/imgs/collect_default_cover.jpg' }}
                />
              ))
            }
          </List>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topListContainer: {
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  bottomListContainer: {
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  playlistheader: {
    backgroundColor: '#EDEDED',
    paddingLeft: 8,
    height: 30,
    justifyContent: 'center',
  },
})

export default AudioList

// export default connect(({ audio }) => ({
//   ...audio,
// }))(AudioList)
