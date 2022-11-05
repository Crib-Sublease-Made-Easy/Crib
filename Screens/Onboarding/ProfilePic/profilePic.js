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
    KeyboardAvoidingView,
    Image
} from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
  
const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

const PRIMARYCOLOR = '#8559E3'
const PRIMARYGREY = '#D9D9D9'
const TEXTINPUTBORDERCOLOR = '#989898'

import { Header, TitleText, SubtitleText, ProgressBarContainer, ProfilePicContainer, } from './profilePicStyle';

import { ContinueButton, ContinueText, DARKGREY, GetFAIconWithColor, ProgressText, SignUpHeader } from '../../../sharedUtils';
import ImagePicker from 'react-native-image-crop-picker';

export default function ProfilePicScreen({navigation, route}){
   
    const [profilePic, setProfilePic] = useState('')

    function checkInput(){
       
        if(profilePic == ""){
            alert("User must upload profile picture.")
        }
        else{
            navigation.navigate("School",
            {
                firstName: route.params.firstName, 
                lastName: route.params.lastName,
                age: route.params.age,
                gender: route.params.gender,
                profilePic: profilePic
            })
        }

    }

    function SelectProfilePic(){
        try{
            ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping:true,
                compressImageQuality: 0.3
            }).then(image => {
            
                setProfilePic(image.path)
            }).catch(e=>{
                console.log("Cancelled")
            })
        }
        catch{
            console.log("Cancelled")
        }
    }
    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <SignUpHeader>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    {GetFAIconWithColor("ArrowLeft", "black")}
                </Pressable>
            </SignUpHeader>
            <ProgressBarContainer>
                <ProgressText>Step  4 / 9</ProgressText>
            </ProgressBarContainer>
            <ScrollView scrollEnabled={false}>
                <TitleText>Select your profile picture ...</TitleText>
                <SubtitleText>Press icon to select</SubtitleText>
                <ProfilePicContainer onPress={SelectProfilePic}>
                    <Ionicons name='image-outline' size={50} color={PRIMARYGREY}/>
                    {profilePic != "" &&
                        <Image source={{uri : profilePic}} 
                        style={{position:'absolute', width:WIDTH*0.5, height: WIDTH*0.5, borderRadius: WIDTH*0.25}}/>
                    }
                </ProfilePicContainer>
                
            </ScrollView>

            <ContinueButton onPress={()=> checkInput()}>
                <ContinueText>Continue</ContinueText>
            </ContinueButton>
            
        </SafeAreaView>
    )
}