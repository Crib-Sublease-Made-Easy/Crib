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
    Image,
    Linking,
    Alert
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
import { ContinueButton, ContinueText, HEIGHT, SignUpBackButtonPressable, SignUpHeader, WIDTH } from '../../../sharedUtils';
import { ContentText, NotRightNowText, TitleText } from './notificationPromptStyle';
import Lottie from 'lottie-react-native';


export default function NotificationPromptScreen({navigation, route}){

    async function enableNotificaiton(){
        await Linking.openSettings();
        navigation.navigate("School",
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic
        })
    }

    async function Continue(){
        Alert.alert(
            "Are you sure?",
            "You will be missing out on messages from other users",
            [
              {text: 'No', onPress: () => {}, style: 'cancel'},
              {text: 'Yes', onPress: () => {ContinueToSchool()}, style: 'destructive'},
            ],
            { 
              cancelable: true 
            }
          );
    }

    function ContinueToSchool(){
        navigation.navigate("School",
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic
        })
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
        <KeyboardAvoidingView behavior='padding' style={{flex: 1}}>
                <SignUpHeader>
                    <SignUpBackButtonPressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack() }>
                        {/* <FontAwesome name='arrow-left' size={25} /> */}
                        <Ionicons name='arrow-back-outline' size={25} />
                    </SignUpBackButtonPressable>
                </SignUpHeader>
                <TitleText>Don't miss a message</TitleText>

                <ContentText>Users on Crib are genuine in finding and posting subleases. Don't miss out on the one message that can save you thousands a month!</ContentText>

                <Lottie source={require('../../../assets/signupNotificaiton.json')} autoPlay loop={false} style={{width:WIDTH, height: WIDTH*0.8,alignSelf:'center'}}/>
                <Pressable onPress={Continue}>
                    <NotRightNowText>Not right now</NotRightNowText>
                </Pressable>
                <ContinueButton style={{marginTop: HEIGHT*0.03}} onPress={enableNotificaiton}>
                    <ContinueText>Keep me updated</ContinueText>
                </ContinueButton>
                
                </KeyboardAvoidingView>
            </SafeAreaView>
    )
}