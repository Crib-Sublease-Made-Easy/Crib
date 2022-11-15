import React, { useState } from 'react';

import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import { Container, Heading, SignupForm, ButtonText, StandardButtonStyle, StandardInputStyle, HeadingImageContainer} from './emailPasswordStyle';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#4050B5'


export default function EmailPasswordScreen({navigation, route}){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    function otp(){
        let data = route.params;
        if(password == confirmPassword && email != "" && password != ""){
            navigation.navigate('otp', {firstName: data.firstName, lastName: data.lastName, age: data.age, gender: data.gender, 
                                        email: email, password: password, confirmPassword: confirmPassword})
        }
        else{
            if(password != confirmPassword){
                alert("Passwords do not match")
            }
            else if(email == ""){
                alert("Please enter email")
            }
            else if(password == ""){
                alert("Password must be more than 8 characters")
            }  
        }
    }
   
    return(
    <SafeAreaView style={{backgroundColor:'white'}}>
        <ScrollView keyboardShouldPersistTaps= 'always'>
            <Container>
            <SignupForm>
                <HeadingImageContainer>
                    <Heading>Sign up</Heading>
                    <Image source={require('../../assets/passwordPic.jpg')} style={{ height: HEIGHT*0.2, width: HEIGHT*0.2, alignSelf: 'center'}}/>
                </HeadingImageContainer>
                <TextInput value={email} onChangeText={value => setEmail(value)} style={StandardInputStyle} placeholder='Email'></TextInput>
                <TextInput value={password} onChangeText={value => setPassword(value)} style={StandardInputStyle} placeholder='Password'></TextInput>
                <TextInput value={confirmPassword} onChangeText={value=> setconfirmPassword(value)} style={StandardInputStyle} placeholder='Confirm Password'></TextInput>
                <TouchableOpacity onPress={otp} style={StandardButtonStyle}> 
                    <ButtonText>Sign Up</ButtonText>
                </TouchableOpacity>
            </SignupForm>
            </Container>
        </ScrollView>
    </SafeAreaView>
    )
}