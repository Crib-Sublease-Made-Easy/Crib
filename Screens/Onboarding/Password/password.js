import * as React  from 'react';
import { useState, useContext, createContext } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Pressable
} from 'react-native';

import { Header, ProgressBarContainer, TitleText, GeneralTextInput, ContinueButton, ContinueText,
    TextInputContainer } from './passwordStyle';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HEIGHT, WIDTH } from '../../../sharedUtils';

export default function PasswordScreen({navigation,route}){
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    function checkInput(){
        // if(password.length < 8){
        //     alert("Password length must be greater than 8.")
        // }
        // else if(password != confirmPassword){
        //     alert("Passwords do not match.")
        // }
        // else{
        //     navigation.navigate('PhoneNumber')
        // }
        navigation.navigate("PhoneNumber",
        {
            fistName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            email: route.params.email,
            password: password
        })
    }


    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} >
           
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
            
            <ProgressBarContainer>

            </ProgressBarContainer>
            <ScrollView>
          
            <TitleText>Set your password</TitleText>
            <TextInputContainer>
                <GeneralTextInput secureTextEntry={true} value={password} onChangeText={(value)=> setPassword(value)} placeholder="Password"  />
                <GeneralTextInput secureTextEntry={true} value={confirmPassword} onChangeText={(value)=> setConfirmPassword(value)} placeholder="Confirm Password"  />
            </TextInputContainer>
           
            </ScrollView>
            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
           
        </SafeAreaView>
    )
}