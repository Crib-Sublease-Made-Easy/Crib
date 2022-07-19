import React, {useState, useRef, useEffect} from 'react'
import {
    SafeAreaView,
    Image,
    Pressable,
    Animated,
    Keyboard,
    Text
} from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { DARKGREY, HEIGHT, LIGHTGREY, MEDIUMGREY, PRIMARYCOLOR, WIDTH, EXTRALIGHT } from '../../../sharedUtils';

import {HeaderContainer, Header, BackButtonContainer, NameContainer, ResetButtonContainer, TopContainer, ImageContainer
        ,NameJobContainer, JobText, RowContainer, CategoryName, AboutMeInput, RowName, RowContainerCol, 
        TextInputPressable} from './profileEditStyle';

export default function ProfileEditScreen({navigation, route}){
    const userData = route.params.userData
    const [userAPIData, setUserAPIData] = useState('')
    const [profilePic, setProfilePic] = useState(route.params.userData.profilePic)
    const [education, setEducation] = useState(route.params.userData.school)
   
   
    useEffect(()=>{
       
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });
        return unsubscribe;       
    },[navigation])
    async function getTokens(){

        const accessToken = await SecureStorage.getItem("refreshToken");

        const UID = await SecureStorage.getItem("userId");


       
        fetch('https://sublease-app.herokuapp.com/users/' + route.params.userData._id, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
            setUserAPIData(userData)
            if(route.params.userData.profilePic == null){
                setProfilePic(userData.profilePic)
                await SecureStorage.removeItem("profilePic")
                await SecureStorage.setItem("ProfilePic", userData.profilePic)

            }
            
        })
        .catch(e=>{
            alert(e)
        })
    }

    async function SelectProfilePic(){
        const accessToken = await SecureStorage.getItem("refreshToken");
        const result = await launchImageLibrary();
        if(!result.didCancel){
            setProfilePic(result.assets[0].uri)
            fetch('https://sublease-app.herokuapp.com/users/' + route.params.userData._id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({
                    profilePic: result.assets[0].uri,
                })
            })
            .then((response) => response.json()).then(data => {
                
                console.log(data)
    
                
            })
            .catch(e => {
                console.log(e)
            })

        }
    }   

    

    return(
        
        <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
        <ScrollView>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.navigate("Profile")}>
                        <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Edit Profile</Header>
                </NameContainer>
               
            </HeaderContainer>

            
            <TopContainer>
                    <ImageContainer onPress={SelectProfilePic}>
                        <Image source={{uri: profilePic}} style={{width: WIDTH*0.35, height:WIDTH*0.35, borderRadius:WIDTH*0.175, backgroundColor: EXTRALIGHT}}/>
                    </ImageContainer>
                    <NameJobContainer>
                        <Header>{userData.firstName}  {userData.lastName}</Header>
                        <JobText style={{color:DARKGREY}}>Joined May 2021</JobText>
                    </NameJobContainer>
            </TopContainer>
            
            <RowContainerCol>
                <CategoryName>About me</CategoryName>
                <TextInputPressable onPress={()=> navigation.navigate("EditAboutMe", {userData: userAPIData})} >
                    <Text style={{color:DARKGREY}}>
                    After informing the parties of your intent to make an introduction, 
                    state the name of the person you are introducing. In most situations, this is usually the younger person
                    </Text>
                </TextInputPressable>
            </RowContainerCol>
          

            <CategoryName>Pronouns</CategoryName>
            <RowContainer>
                <RowName>{userAPIData.gender}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>

            <CategoryName>Education</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditEducation", {userData: route.params.userData})}>
                <RowName>{userAPIData.school}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>

            <CategoryName>Occupation</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditOccupation", {userData: route.params.userData})}>
                <RowName>{userAPIData.occupation}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
        </ScrollView>
        </SafeAreaView>
       
    )
}