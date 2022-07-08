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
    const [profilePic, setProfilePic] = useState('')

    function checkInput(){
        if(profilePic == ""){
            alert("User must upload profile picture.")
        }
        else{
            navigation.navigate("School",
            {
                fistName: route.params.firstName, 
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