import React from 'react'
import { View, Text } from 'react-native'
import { Scene, Router } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import AudioList from './routes/AudioList'
import Account from './routes/Account'

const TabIcon = (props) => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Icon name={props.tabIcon} size={20} color={props.selected ? '#FFDB42' : '#BBB'} />
    <Text style={{ color: props.selected ? '#FFDB42' : '#BBB', marginTop: 5, fontSize: 12 }}>{props.title}</Text>
  </View>
    )

const RouterComponent = () => (
  <Router sceneStyle={{ paddingTop: 40 }}>
    <Scene key="main" hideNavBar>
      <Scene key="tabbar" tabs tabBarStyle={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#BBB' }}>
        <Scene key="audiolist" initial title="Music" icon={TabIcon} tabIcon="home" navigationBarStyle={{ backgroundColor: '#ffdb42' }}>
          <Scene key="article" component={AudioList} title="歌曲列表" />
        </Scene>
        <Scene key="account" title="account" icon={TabIcon} tabIcon="circle-o" navigationBarStyle={{ backgroundColor: '#ffdb42' }}>
          <Scene key="ooxx" component={Account} title="账号" />
        </Scene>
      </Scene>
    </Scene>
  </Router>
  )

export default RouterComponent
