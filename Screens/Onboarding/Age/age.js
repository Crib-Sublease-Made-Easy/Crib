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
  
import { HEIGHT, WIDTH, PRIMARYCOLOR, TEXTINPUTBORDERCOLOR } from '../../../sharedUtils';

import { AgeContainer, Header, ProgressBarContainer, SubtitleText, TitleText, ContinueButton, ContinueText, DatePlaceHolder } from './ageStyle';

export default function AgeScreen({navigation, route}){
    console.log("First Name : " + route.params.firstName)
    console.log("Last Name : " +route.params.lastName)
    const [age, setAge] = useState(new Date())
    const [datePickerModal, setDatePickerModal] = useState(false)

    function checkInput(){
        // if(age.getTime() >= new Date().getTime()){
        //     alert("Please enter a valid Date of birth.")
        // }
        // else{
        //     navigation.navigate('Gender')
        // }
        console.log("On Age Page");
        console.log("firstName " + route.params.firstName)
        console.log("lastName " + route.params.lastName)
        console.log("gender " + route.params.gender)
        console.log("school " +route.params.school)
        console.log("occupation " + route.params.occupation)
        console.log("email " + route.params.email)
       
        navigation.navigate('Gender',
        {
            firstName: route.params.firstName, 
            lastName: route.params.lastName,
            age: age.getTime()
        })
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}}>
                <Header>
                    <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                        {/* <FontAwesome name='arrow-left' size={25} /> */}
                        <Ionicons name='arrow-back-outline' size={25} />
                    </Pressable>
                </Header>
                
                <ProgressBarContainer>

                </ProgressBarContainer>
                <ScrollView>
                    <TitleText>How old are you?</TitleText>
                    <SubtitleText>We’ll get your age using your birthday below</SubtitleText>
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