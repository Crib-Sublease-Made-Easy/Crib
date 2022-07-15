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

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HEIGHT, WIDTH } from '../../../sharedUtils';

export default function PasswordScreen({navigation,route}){
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userId, setUserId] = useState('')

    function navigate(){
        console.log("==========When Load=========")
        console.log("First Name : " + route.params.firstName)
        console.log("Last Name : " +route.params.lastName)
        console.log("Age: " + route.params.age)
        console.log("Gender: " + route.params.gender)
        console.log("==========When Load=========")
        console.log("navigating to otp")
        navigation.navigate("PhoneNumber",
        {
            fistName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            email: route.params.email,
            password: password,
        })
    }

    async function signup(){
        // console.log("hello")
        // console.log(route.params.firstName)
        // console.log(route.params.lastName)
        // console.log(route.params.gender)
        // console.log(route.params.school)
        // console.log(route.params.occupation)
        // console.log(route.params.email)
        // console.log(route.params.profilePic)
        // console.log(password)
        
        const formData = new FormData();

        formData.append("firstName", route.params.firstName);                     
        formData.append("lastName", route.params.lastName);  
        formData.append("dob", route.params.age);      
        formData.append("gender", route.params.gender);                       
        formData.append("occupation", route.params.occupation)
        formData.append("school", route.params.school);                       
        formData.append("email", route.params.email);                     
        formData.append("password", password);                       
        var array = route.params.profilePic.split(".");
        formData.append("userImage", {
            uri: route.params.profilePic,
            type: 'image/' + array[1],
            name: 'someName',
        });
       
        console.log("Tryin to sign up.")
        if(route.params.email != ""){
            console.log("Inside Signup")
            const res =  await fetch('https://sublease-app.herokuapp.com/users/signup', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: formData
            }).then(res => res.json()).then(async data =>{
                console.log("User ID");
               await SecureStorage.setItem("userId", data.createdUser._id)
                navigate()
              
            }).catch(e=>
                console.log(e)
            )
        }
        else{
            console.log("Something is missing.")
        }

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
            <ContinueButton onPress={signup}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
            </KeyboardAvoidingView>
           
        </SafeAreaView>
    )
}