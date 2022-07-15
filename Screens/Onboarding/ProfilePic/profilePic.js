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


import { Header, TitleText, SubtitleText, ProgressBarContainer, ProfilePicContainer, 
    ContinueButton, ContinueText } from './profilePicStyle';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function ProfilePicScreen({navigation, route}){
    console.log("==========When Load=========")
    console.log("First Name : " + route.params.firstName)
    console.log("Last Name : " +route.params.lastName)
    console.log("Age: " + route.params.age)
    console.log("Gender: " + route.params.gender)
    console.log("==========When Load=========")
    const [profilePic, setProfilePic] = useState('')

    function checkInput(){
        console.log("hello")
        console.log(route.params.firstName)
        console.log(route.params.lastName)
        console.log(route.params.gender)
        console.log(route.params.school)
        console.log(route.params.occupation)
        console.log(route.params.email)
        console.log(route.params.profilePic)
       
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

    async function SelectProfilePic(){
        const result = await launchImageLibrary();
        if(!result.didCancel){
            console.log(result.assets[0].uri)
            setProfilePic(result.assets[0].uri)
        }
    }
    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'white', height:HEIGHT, width:WIDTH}} >
            <Header>
                <Pressable style={{height:'50%', width:'50%'}} onPress={()=> navigation.goBack() }>
                    {/* <FontAwesome name='arrow-left' size={25} /> */}
                    <Ionicons name='arrow-back-outline' size={25} />
                </Pressable>
            </Header>
            <ProgressBarContainer>

            </ProgressBarContainer>
            <ScrollView>
                <TitleText>Show others who you are ...</TitleText>
                <SubtitleText>Choose your profile picture</SubtitleText>
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