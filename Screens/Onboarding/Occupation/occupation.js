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

  
import { HEIGHT, WIDTH } from '../../../sharedUtils';

import {Header, ProgressBarContainer, SubtitleText, TitleText, ContinueText, ContinueButton,
    GeneralTextInput, TextInputContainer} from './occupationStyle';

export default function OccupationScreen({navigation, route}){
    const [occupation, setOccupation] = useState("")

    function checkInput(){
        navigation.navigate("Email",
        {
            fistName: route.params.firstName, 
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
            <ScrollView>
                <TitleText>Occupation (Optional)</TitleText>
                <SubtitleText>Choose your latest occupation</SubtitleText>
                <TextInputContainer value={occupation} onChangeText={(value)=> setOccupation(value)}>
                    <GeneralTextInput  placeholder="Ex: Plummer"  />
                </TextInputContainer>
            </ScrollView>

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
        </SafeAreaView>
    )
}