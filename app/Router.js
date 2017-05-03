import React from 'react'
import { View, Text } from 'react-native'
import { Scene, Router, Actions, Modal } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import AudioList from './routes/AudioList'
import Account from './routes/Account'
import AddAudioCategory from './routes/AddAudioCategory'

const TabIcon = (props) => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Icon name={props.tabIcon} size={20} color={props.selected ? '#FFDB42' : '#BBB'} />
    <Text style={{ color: props.selected ? '#FFDB42' : '#BBB', marginTop: 5, fontSize: 12 }}>{props.title}</Text>
  </View>
    )

const RouterComponent = () => (
  <Router>
    <Scene key="modal" component={Modal} >
      <Scene key="main" hideNavBar>
        <Scene key="popAddPage" direction="vertical">
          <Scene key="addaudiocategory" component={AddAudioCategory} title="新增歌单" navigationBarStyle={{ backgroundColor: '#ffdb42' }} />
        </Scene>
        <Scene key="tabbar" initial tabs tabBarStyle={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#BBB' }}>
          <Scene key="audiolist" initial title="Music" icon={TabIcon} tabIcon="home" navigationBarStyle={{ backgroundColor: '#ffdb42' }}>
            <Scene
              key="article" component={AudioList} title="歌单" leftTitle="更多" leftButtonTextStyle={{ color: '#fff' }}
              leftButtonStyle={{ paddingTop: 14, paddingLeft: 10 }} onLeft={() => Actions.popAddPage()}
            />
          </Scene>
          <Scene key="account" title="account" icon={TabIcon} tabIcon="circle-o" navigationBarStyle={{ backgroundColor: '#ffdb42' }}>
            <Scene key="ooxx" component={Account} title="账号" />
          </Scene>
        </Scene>
      </Scene>
    </Scene>
  </Router>
  )

export default RouterComponent
