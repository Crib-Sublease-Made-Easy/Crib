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

import { PRIMARYCOLOR, FONTFAMILY } from '../../../sharedUtils';

import { TopContainer, BottomContainer, HeadingText, SubHeadingText, JoinButton, LoginText, JoinText, JoinPressableText } from './landingStyle';



export default function LandingScreen({navigation}){


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:PRIMARYCOLOR, height:HEIGHT, width:WIDTH}} >
            <TopContainer>

            </TopContainer>
            <BottomContainer>
                <HeadingText>Find your Crib</HeadingText>
                <SubHeadingText>Sublease made easy.</SubHeadingText>
                <JoinButton onPress={()=>navigation.navigate('FirstLastName')}>
                    <JoinText>Join Now</JoinText>
                </JoinButton>
            </BottomContainer>
            <Pressable onPress={()=>navigation.navigate("Login")}>
                <LoginText>Already a member?  <Text style={{fontFamily: FONTFAMILY, fontWeight: '500'}}>Login </Text> </LoginText>
            </Pressable>
        </SafeAreaView>
    )
}