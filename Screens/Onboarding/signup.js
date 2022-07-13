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
  Button,
  TextInput,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Container, SignupForm, Heading, profileImagePlacerStyle, StandardInputStyle, AgeInputContainer, 
    PhoneInputStyle, TermsAndServicesContainer, StandardButtonStyle, ButtonText, LoginContainer} from './signupStyle';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#4050B5'

export default function SignupScreen({navigation, route}){
    
    const [date, setDate] = React.useState(new Date(1598051730000));
    const [firstName, setfirstName] = React.useState('')
    const [lastName, setlastName] = React.useState('');
    const [gender, setGender] = React.useState('male');    
    
    function signup (){ 
        if(firstName != "" && lastName != "" && gender != "" &&  /^[a-zA-Z]+$/.test(firstName) &&  /^[a-zA-Z]+$/.test(lastName)){  

            navigation.navigate('EmailPassword',{firstName:firstName, lastName:lastName, age: date.getTime(), gender:gender})
        }
        else{
            if(firstName == "" && lastName == "" && gender == ""){
                alert("Information Incomplete.")
            }
            else if( /^[a-zA-Z]+$/.test(firstName) == false){
                alert("First name can only consist of characters." )
            }
            else if( /^[a-zA-Z]+$/.test(lastName) == false){
                alert("Last name can only consist of characters." )
            }
        }

    }

    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            <KeyboardAvoidingView behavior="position">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <SignupForm>
                        <Heading>Sign up</Heading>
                        <TouchableOpacity style={profileImagePlacerStyle}>
                        </TouchableOpacity>
                        <TextInput value={firstName} onChangeText={value => setfirstName(value)} style={StandardInputStyle} placeholder='First Name'></TextInput>
                        <TextInput value={lastName} onChangeText={value=> setlastName(value)} style={StandardInputStyle} placeholder='Last Name'></TextInput>
                        <AgeInputContainer>
                            <View style={{ width: WIDTH*0.3}}>
                            <Text>Date of Birth</Text>
                            <DateTimePicker
                                style={{width:WIDTH*0.2,justifyContent:'center',}}
                                value={date}
                                onChange={(event,value)=>setDate(new Date(value))}
                            />
                            </View>
                           
                        </AgeInputContainer>
                        <TermsAndServicesContainer>
                            <Text style={{width:WIDTH*0.8}}>By clicking continue, you agree to our 
                            <Text style={{color:'#4285f4'}}>Terms & Services </Text>
                            and 
                            <Text style={{color:'#4285f4'}}> Privacy Policy</Text>
                            </Text>
                        </TermsAndServicesContainer>

                        <TouchableOpacity onPress={()=>signup()} style={StandardButtonStyle}> 
                            <ButtonText>Continue</ButtonText>
                        </TouchableOpacity>
                        <LoginContainer>
                            <Text style={{color:'#7E7E7E', fontWeight:'500'}}>New to Interzzz?</Text>
                            <TouchableOpacity style={{padding:6}} onPress={()=>navigation.navigate('Login')}>
                                <Text style={{color:PRIMARYCOLOR, fontWeight: '700'}}>Login</Text>
                            </TouchableOpacity>
                        </LoginContainer>
                    </SignupForm>
                </Container>
            </TouchableWithoutFeedback>   
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}