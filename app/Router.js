import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
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

const styles = StyleSheet.create({
  navigationBarStyle: {
    backgroundColor: '#ffdb42',
  },
  navBarButtonTextStyle: {
    color: '#FCFCFC',
  },
  navBarButtonStyle: {
    paddingTop: 14,
    paddingLeft: 10,
  },
})

// const getSceneStyle = (props, computedProps) => {
//   const style = {
//     flex: 1,
//     backgroundColor: '#fff',
//     shadowColor: null,
//     shadowOffset: null,
//     shadowOpacity: null,
//     shadowRadius: null,

//   }
//   if (computedProps.isActive) {
//     style.marginTop = computedProps.hideNavBar ? 0 : 64;
//     style.marginBottom = computedProps.hideTabBar ? 0 : 50;
//   }
//   return style
// }

const RouterComponent = () => (
  <Router>
    <Scene key="modal" component={Modal} >
      <Scene key="main" hideNavBar>
        <Scene key="popAddPage" direction="vertical">
          <Scene
            key="addaudiocategory" component={AddAudioCategory} title="新增歌单" panHandlers={null}
            navigationBarStyle={styles.navigationBarStyle} leftTitle="取消" onLeft={Actions.pop}
            leftButtonTextStyle={styles.navBarButtonTextStyle} leftButtonStyle={styles.navBarButtonStyle}
            rightTitle="完成" onRight={() => alert('complete...')}
            rightButtonTextStyle={styles.navBarButtonTextStyle} rightButtonStyle={styles.navBarButtonStyle}
          />
        </Scene>
        <Scene key="tabbar" initial tabs tabBarStyle={{ backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#BBB' }}>
          <Scene key="audiolist" initial title="Music" icon={TabIcon} tabIcon="home" navigationBarStyle={styles.navigationBarStyle}>
            <Scene
              key="article" component={AudioList} title="歌单" leftTitle="更多" leftButtonTextStyle={styles.navBarButtonTextStyle}
              leftButtonStyle={styles.navBarButtonStyle} onLeft={() => Actions.popAddPage()}
            />
          </Scene>
          <Scene key="account" title="account" icon={TabIcon} tabIcon="circle-o" navigationBarStyle={styles.navigationBarStyle}>
            <Scene key="ooxx" component={Account} title="账号" />
          </Scene>
        </Scene>
      </Scene>
    </Scene>
  </Router>
  )

export default RouterComponent
