import React,{Component} from 'React';

import {StyleSheet,Text,View} from 'react-native';
import pageDecorator from '../hocs/PageDecorator'
import { FontAwesome } from '@expo/vector-icons'

@pageDecorator
class AudioDetail extends Component{
    constructor(props) {
        super(props)
        
    }

    render(){
        return (
            <View>
                <Text>背景 歌词区</Text>
                <Text>按钮区：收藏 下载 </Text>
                <Text>时间进度条区: 当前时间- 进度条 - 总时长</Text>
                <Text>歌曲操作区： 随机/单曲、顺序 上一首 暂停/开始 下一首 列表</Text>
                <BottomOperateArea />
            </View>
        )
    }
}

const BottomOperateArea = (props) => {
    return (
        <View>
            <FontAwesome name="heart" size={20} color="red"/>
            <FontAwesome name="download" size={20}/>
            <FontAwesome name="random" size={20}/>
            <FontAwesome name="bars" size={20}/>
            <FontAwesome name="repeat" size={20}/>
            <FontAwesome name="step-backward" size={20}/>
            <FontAwesome name="play-circle" size={20}/>
            <FontAwesome name="pause-circle" size={20}/>
            <FontAwesome name="step-forward" size={20}/>
            <FontAwesome name="list" size={20}/>
        </View>
    )
}
//react-native-audio-streaming
//react-native-sound 
//react-native-fs

export default AudioDetail