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
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { UserContext } from '../../UserContext';

import Lottie from 'lottie-react-native';

import { Container, LoginForm, Heading, StandardInputStyle, StandardButtonStyle, ButtonText, Divider, 
         DividerLineStyle, DividerTextStyle, SignupContainer, GoogleLoginButtonStyle, StandardButton } from './loginStyle';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { DARKGREY, PRIMARYCOLOR } from '../../sharedUtils';



export default function LoginScreen({navigation}){

    //Sets the user context 
    const {user, login} = useContext(UserContext);



    //Usestate varaible for storing email and password for login 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

  
    function userLogin(){
        setLoading(true)
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
            setTimeout(() =>  
            {
                setLoading(false)
                if(e.status == 401){
                    alert("Incorrect Email or Password.")
                }
                else if(e.status == 200 || e.status == 201){
                    login(email);
                }
            }
            , 2000);
           
        })
        
       
    }

    return(
       
        <SafeAreaView style={{backgroundColor:'white', flex:1}}>
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} >  
                <ScrollView scrollEnabled={false}>
                    <Image source={require('../../assets/20945146.jpg')} style={{height: HEIGHT*0.2, width: HEIGHT*0.25, alignSelf: 'center'}}/>
                    <View >
                        <Heading>Login</Heading>
                        <TextInput value={email} onChangeText={(value)=> setEmail(value)} style={StandardInputStyle} placeholder='Email' placeholderTextColor={DARKGREY}/>
                        <TextInput value={password} onChangeText={(value)=> setPassword(value)} style={StandardInputStyle} placeholder='Password' placeholderTextColor={DARKGREY}/>

                    </View>
                </ScrollView>
                <View >
                    <StandardButton onPress={userLogin} loading={loading} disabled={loading}> 
                    {loading ?
                        <Lottie source={require('../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
                    :
                        <ButtonText> Login </ButtonText>
                    }
                    </StandardButton>
                    <SignupContainer>
                        <Text style={{color: DARKGREY, fontWeight:'500'}}>New to Interzzz?</Text>
                        <TouchableOpacity style={{paddingHorizontal:6}} onPress={()=>navigation.navigate('FirstLastName')}>
                            
                            <Text style={{color:PRIMARYCOLOR, fontWeight: '700'}}>Signup</Text>
                            
                        </TouchableOpacity>
                    </SignupContainer>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
       
    )
}