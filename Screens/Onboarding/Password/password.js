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
    Pressable,
    Keyboard
} from 'react-native';

import { Header, ProgressBarContainer, TitleText, GeneralTextInput, ContinueButton, ContinueText,
    TextInputContainer, SubtitleText } from './passwordStyle';

    import EncryptedStorage from 'react-native-encrypted-storage';

import {UserContext} from '../../../UserContext'

import Lottie from 'lottie-react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HEIGHT, WIDTH } from '../../../sharedUtils';

export default function PasswordScreen({navigation,route}){
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [userId, setUserId] = useState('')
    const [loading, setLoading] = useState(false)
    const {sb} = useContext(UserContext);

    function checkInput(){
        Keyboard.dismiss()
        if(password == "" || confirmPassword == ""){
            alert("Passwords cannot be empty.")
        }
        else if(password != confirmPassword){
            alert("Passwords do not match.")
        }
        else if(password.length < 8){
            alert("Passmord length must be greater than 8.")
        }
        else if(password.length > 16){
            alert("Passmord length must be less than 16.")
        }
        else{
            setLoading(true)
            signup()
        }
    }

    async function signup(){
      
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
       
        if(route.params.email != ""){
            const res =  await fetch('https://crib-llc.herokuapp.com/users/signup', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                },
                body: formData
            }).then(res => res.json()).then(async data =>{
                // The USER_ID below should be unique to your Sendbird application.
                try {
                    console.log("connecting to sendbird")
                    sb.connect(data.createdUser._id, function(user, error) {
                        if (error) {
                            // Handle error.
                            console.log("sendbird error")
                            console.log(err)
                        }
                        else{
                            console.log("sendbird connected")
                            sb.updateCurrentUserInfo(data.createdUser.firstName, data.createdUser.profilePic, (user, err) => {
                                if (!err) {
                                    console.log("Successfully updated current user", err)
                                  } else {
                                    console.log("Error with updating current user", err)
                                  }
                            });
                        }
                        // The user is connected to Sendbird server.
                    });
                    // The user is connected to the Sendbird server.
                } catch (err) {
                    // Handle error.
                }
                try{
                    await EncryptedStorage.setItem("userId", data.createdUser._id)
                    await EncryptedStorage.setItem("profilePic", data.createdUser.profilePic)
                }
                catch{e=>{
                    console.log(e)
                }}
                
                //Create sendbird user here with userid
                //store user info in

                navigate()
                
                
              
            }).catch(e=>
                console.log(e)
            )
        }
       
        setTimeout(()=>{
            setLoading(false)
        },2000)
    }

    function navigate(){
        // console.log("==========When Load=========")
        // console.log("First Name : " + route.params.firstName)
        // console.log("Last Name : " +route.params.lastName)
        // console.log("Age: " + route.params.age)
        // console.log("Gender: " + route.params.gender)
        // console.log("==========When Load=========")
        // console.log("navigating to otp")
        navigation.reset(
            {index: 0 , routes: [{ name: 'PhoneNumber', 
            fistName: route.params.firstName, 
            lastName: route.params.lastName,
            age: route.params.age,
            gender: route.params.gender,
            profilePic: route.params.profilePic,
            school: route.params.school,
            email: route.params.email,
            password: password, }]}
            
        )
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <KeyboardAvoidingView behavior={'padding'} style={{flex:1}} >
           
            <Header>
                <Pressable disabled={loading} style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
            
            <ProgressBarContainer>

            </ProgressBarContainer>
            <ScrollView scrollEnabled={false}>
          
            <TitleText>Set your password</TitleText>
            <SubtitleText>Password must contain between 8 to 16 characters</SubtitleText>
            <TextInputContainer>
                <GeneralTextInput editable={!loading} secureTextEntry={true} value={password} onChangeText={(value)=> setPassword(value)} placeholder="Password"  />
                <GeneralTextInput editable={!loading} secureTextEntry={true} value={confirmPassword} onChangeText={(value)=> setConfirmPassword(value)} placeholder="Confirm Password"  />
            </TextInputContainer>
           
            </ScrollView>
            {/* <ContinueButton onPress={checkInput}> */}
            <ContinueButton disabled={loading} loading={loading} onPress={()=> checkInput()}>
            {loading ?
                <Lottie source={require('../../../loadingAnim.json')} autoPlay loop style={{width:WIDTH*0.2, height: WIDTH*0.2, }}/>
            :
                <ContinueText>Continue</ContinueText>
            }
            </ContinueButton>
            
            </KeyboardAvoidingView>
           
        </SafeAreaView>
    )
}