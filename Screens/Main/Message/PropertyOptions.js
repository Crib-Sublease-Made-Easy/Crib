import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { User } from 'realm';

import Modal from  "react-native-modal";


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { RowContainer, RowName } from './PropertyOptionStyle';

import { WIDTH, HEIGHT, HeaderContainer, Header, BackButtonContainer, NameContainer, PRIMARYCOLOR, MEDIUMGREY, DARKGREY,  } from '../../../sharedUtils';
export default function PropertyOptionsModal({navigation,close, visible ,viewProp, leaveChat}){
    return(
        <SafeAreaView>
            <Modal backdropTransitionInTiming={300} animationOutTiming={700} 
            backdropTransitionOutTiming={0} hideModalContentWhileAnimating
            isVisible={visible} style={{padding:0, margin: 0, justifyContent:'flex-end', }}>
                <View style={{width: WIDTH, height: HEIGHT*0.3, backgroundColor:'white', borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
                <HeaderContainer>
                    <BackButtonContainer>
                        <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} hitSlop={WIDTH*0.05} onPress={()=> close()}>
                            <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                        </Pressable>
                    </BackButtonContainer>
                    <NameContainer>
                        <Header>Options</Header>
                    </NameContainer>
                   
                </HeaderContainer>
                <RowContainer hitSlop={WIDTH*0.05} onPress={()=> {close(), viewProp()}}>
                    <Ionicons name='home' size={25}  style={{paddingLeft: WIDTH*0.05}} color={PRIMARYCOLOR}/>
                    <RowName>View Property</RowName>
                </RowContainer>
                {/* <RowContainer>
                    <Ionicons name='hand-left' size={25}  style={{paddingLeft: WIDTH*0.05}} color={DARKGREY}/>
                    <RowName>Report Property</RowName>
                   
                </RowContainer> */}
                <RowContainer hitSlop={WIDTH*0.05} onPress={leaveChat}>
                    <Ionicons name='close' size={25}  style={{paddingLeft: WIDTH*0.05}} color='red'/>
                    <RowName>Delete Conversation</RowName>
                </RowContainer>
                

                

                </View>
            </Modal>
        </SafeAreaView>
    )
}

