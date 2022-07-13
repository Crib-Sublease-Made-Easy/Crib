import React, {useState, useContext} from 'react';
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
import { UserContext } from '../../UserContext';

import { Container, LoginForm, Heading, StandardInputStyle, StandardButtonStyle, ButtonText, Divider, 
         DividerLineStyle, DividerTextStyle, SignupContainer, GoogleLoginButtonStyle } from './loginStyle';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#4050B5'


export default function LoginScreen({navigation}){

    //Sets the user context 
    const {user, login} = useContext(UserContext);

    //Usestate varaible for storing email and password for login 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState(''
    )
    function userLogin(){
        fetch('https://sublease-app.herokuapp.com/users/login', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then(e=>{
            if(e.status == 401){
                alert("Incorrect Email or Password.")
            }
            else if(e.status == 200 || e.status == 201){
                login(email);
            }
        })
    }

    return(
       
        <SafeAreaView style={{backgroundColor:'white'}}>
            <KeyboardAvoidingView behavior="position">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Image source={require('../../assets/20945146.jpg')} style={{height: HEIGHT*0.35, width: HEIGHT*0.35, alignSelf: 'center'}}/>
                    <LoginForm>
                        <Heading>Login</Heading>
                        <TextInput value={email} onChangeText={(value)=> setEmail(value)} style={StandardInputStyle} placeholder='Email'></TextInput>
                        <TextInput value={password} onChangeText={(value)=> setPassword(value)} style={StandardInputStyle} placeholder='Password'></TextInput>
                        
                        <TouchableOpacity onPress={userLogin} style={StandardButtonStyle}> 
                            <ButtonText>Login</ButtonText>
                        </TouchableOpacity>
                        <Divider>
                            <View style={DividerLineStyle}></View>
                            <Text style={DividerTextStyle}>or</Text>
                            <View style={DividerLineStyle}></View>
                        </Divider>

                        <TouchableOpacity style={GoogleLoginButtonStyle}>
                            <ButtonText >Login With Google</ButtonText>
                        </TouchableOpacity>
                        <SignupContainer>
                            <Text style={{color:'#7E7E7E', fontWeight:'500'}}>New to Interzzz?</Text>
                            <TouchableOpacity style={{padding:6}} onPress={()=>navigation.navigate('FirstLastName')}>
                                <Text style={{color:PRIMARYCOLOR, fontWeight: '700'}}>Signup</Text>
                            </TouchableOpacity>
                        </SignupContainer>
                    </LoginForm>
                </Container>
            </TouchableWithoutFeedback>   
            </KeyboardAvoidingView>
        </SafeAreaView>
       
    )
}