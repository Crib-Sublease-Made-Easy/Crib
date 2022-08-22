import { faHouse, faKey, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Pressable,
    Animated,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

  
const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { PRIMARYCOLOR,  } from '../../../sharedUtils';

import { TopContainer, BottomContainer, HeadingText, SubHeadingText, JoinButton, LoginText, JoinText,
        TopLeftText } from './landingStyle';



export default function LandingScreen({navigation}){


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:PRIMARYCOLOR, height:HEIGHT, width:WIDTH}} >
            <TopContainer>
                <TopLeftText>Crib </TopLeftText>
                <SubHeadingText>Sublease easier and simpler</SubHeadingText>
            </TopContainer>
            <BottomContainer>
            
                
                
            </BottomContainer>
            <View style={{position:'absolute', bottom:HEIGHT*0.1, width:WIDTH*0.9, alignItems:'center', alignSelf:'center'}}>
            <JoinButton onPress={()=>navigation.navigate('FirstLastName')}>
                {/* <FontAwesomeIcon icon={faHouse} size={15} color='white' /> */}
                <JoinText>Sign up</JoinText>
            </JoinButton>
            <JoinButton onPress={()=>navigation.navigate("Login")}>
                {/* <FontAwesomeIcon icon={faLockOpen} size={15} color='white' /> */}
                <JoinText>Login</JoinText>
            </JoinButton>
            
            </View>
        </SafeAreaView>
    )
}