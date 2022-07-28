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
    KeyboardAvoidingView
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import {Picker} from '@react-native-picker/picker';

import { HEIGHT, WIDTH, DARKGREY } from '../../../sharedUtils';

import {Header, ProgressBarContainer, SubtitleText, TitleText, ContinueText, ContinueButton,
    GeneralTextInput, TextInputContainer, FollowUpContainer, FollowUpText} from './occupationStyle';

export default function OccupationScreen({navigation, route}){
    const [occupation, setOccupation] = useState("")
    const [showPicker, setShowPicker] = useState('')


    function checkInput(){
        
        navigation.navigate("Email",
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            occupation: occupation
        })
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
           
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
                
            <ProgressBarContainer>

            </ProgressBarContainer>
            <ScrollView scrollEnabled={false}>
                <TitleText>Occupation (Optional)</TitleText>
                <SubtitleText>Choose your latest occupation</SubtitleText>
                <TextInputContainer >
                    <GeneralTextInput value={occupation} onChangeText={(value)=> setOccupation(value)} placeholder="Ex: Plummer"  />
                </TextInputContainer>

                <FollowUpContainer>
                    <Pressable onPress={() => setShowPicker(!showPicker)}>
                        <Ionicons size={20} name={showPicker ? 'checkbox' : 'checkbox-outline'} color={DARKGREY} style={{ paddingVertical: HEIGHT * 0.01 }} />
                    </Pressable>
                    <FollowUpText>Show selection</FollowUpText>
                </FollowUpContainer>
            </ScrollView>


            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
        </SafeAreaView>
    )
}