import React, {useState, useEffect} from 'react';

import {
    SafeAreaView,
    ScrollView,
    Dimensions,
    Pressable,
    Animated,
    KeyboardAvoidingView
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import DatePicker from 'react-native-date-picker'
  
import { HEIGHT, WIDTH, ContinueButton, ContinueText, ProgressText, SignUpHeader, GetFAIconWithColor } from '../../../sharedUtils';

import { AgeContainer, Header, ProgressBarContainer, SubtitleText, TitleText, DatePlaceHolder } from './ageStyle';

export default function AgeScreen({navigation, route}){
   
    const [age, setAge] = useState(new Date())
    const [datePickerModal, setDatePickerModal] = useState(false)

    function checkInput(){
        let diff = (new Date().getTime() - age.getTime())/1000;
        let mins = diff / 60;
        let hours = mins / 60 
        let days = hours/24
        let years = days/365
        console.log(years)
        
        if(age.getTime() >= new Date().getTime()){
            alert("Please enter a valid Date of birth.")
           
        }
        else if(years < 16){
            alert("You have to be 16 to signup.")
        }
        else if(years > 100){
            alert("You have to be under 100 to signup.")
        }
        else{
            navigation.navigate('Gender',
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: age.getTime()
            })
        }

    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
                <SignUpHeader>
                    <Pressable onPress={()=> navigation.goBack() }>
                        {/* <FontAwesome name='arrow-left' size={25} /> */}
                        {GetFAIconWithColor("ArrowLeft", "black")}
                    </Pressable>
                </SignUpHeader>
                
                <ProgressBarContainer>
                    <ProgressText>Step  2 / 9</ProgressText>
                </ProgressBarContainer>
                <ScrollView>
                    <TitleText>How old are you?</TitleText>
                    <SubtitleText>You must be over 16 to signup</SubtitleText>
                    <AgeContainer onPress={()=>setDatePickerModal(true)}>
                        <DatePlaceHolder> {(age.getMonth() % 13) + 1} / {age.getDate()} / {age.getFullYear()} </DatePlaceHolder>
                    </AgeContainer>
                    <DatePicker
                        modal
                        mode='date'
                        open={datePickerModal}
                        date={age}
                        onConfirm={(date) => {
                            setAge(date)
                            setDatePickerModal(false)
                        }}
                        onCancel={() => {
                            setDatePickerModal(false)
                        }}
                    />  
                </ScrollView>

                <ContinueButton onPress={()=> checkInput()}>
                    <ContinueText>Continue</ContinueText>
                </ContinueButton>
            </KeyboardAvoidingView>
        </SafeAreaView>
        
    )
}