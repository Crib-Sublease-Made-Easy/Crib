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

import ImagePicker from 'react-native-image-crop-picker';


import { DARKGREY, HEIGHT, LIGHTGREY, MEDIUMGREY, PRIMARYCOLOR, WIDTH, EXTRALIGHT } from '../../../sharedUtils';

import {HeaderContainer, Header, BackButtonContainer, NameContainer, ResetButtonContainer, TopContainer, ImageContainer
        ,NameJobContainer, JobText, RowContainer, CategoryName, AboutMeInput, RowName, RowContainerCol, 
        TextInputPressable, ChangeProfilePicText, AgeText} from './profileEditStyle';

export default function ProfileEditScreen({navigation, route}){
    console.log(route.params.userData)
    const userData = route.params.userData
    const [userAPIData, setUserAPIData] = useState('')
    const [profilePic, setProfilePic] = useState(route.params.userData.profilePic)
    const [education, setEducation] = useState(route.params.userData.school)
    const [initialLoad, setInitialLoad] = useState(false)
   
    const userAge = Math.floor(route.params.userData.dob/(1000*60*60*24*365))
   
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });
        return unsubscribe;       
    },[navigation])
    
    async function getTokens(){
        console.log("In getTokens Function")
        console.log("USER DATA", route.params.userData)
        const accessToken = await SecureStorage.getItem("refreshToken");
        const UID = await SecureStorage.getItem("userId");
        
        if(route.params.userData.profilePic != null){
            console.log("LOADING -- Profile Pic from params")
            setProfilePic(route.params.userData.profilePic)
        }
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
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping:true,
            compressImageQuality: 0.3
          }).then(image => {
           
            console.log(route.params.userData._id)
            console.log(accessToken)
            const formData = new FormData();
            console.log(image.path)
            var array = image.path.split(".");      
            formData.append("userImage", {
                uri: image.path,
                type: 'image/' + array[1],
                name: 'someName',
            }); 
            fetch('https://sublease-app.herokuapp.com/users/profileImages/' + route.params.userData._id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: formData
            }).then(resp=>resp.json()).then(async data=>{
                if (data.msg != "profile pic successfully changed" ){
                    alert("Update unsuccessful.")
                }
                else{
                    setProfilePic(image.path)
                    await SecureStorage.setItem("profilePic", data.profilePic)
                }
                console.log(data)
                
            })
            .catch((error) => {
                if (error.code === 'E_PICKER_CANCELLED') { // here the solution
                  return false;
                }
            });
          });
        
        
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
                        <Pressable onPress={SelectProfilePic}>
                            <ChangeProfilePicText>Tap to change</ChangeProfilePicText>
                        </Pressable>
                    </ImageContainer>
                    <NameJobContainer>
                        <Header>{userData.firstName}  {userData.lastName}</Header>
                        <AgeText style={{color:DARKGREY}}>{userAge} years old</AgeText>
                    </NameJobContainer>
            </TopContainer>
            
            {/* <RowContainerCol>
                <CategoryName>About me</CategoryName>
                <TextInputPressable onPress={()=> navigation.navigate("EditAboutMe", {userData: userAPIData})} >
                    <Text style={{color:DARKGREY}}>
                    After informing the parties of your intent to make an introduction, 
                    state the name of the person you are introducing. In most situations, this is usually the younger person
                    </Text>
                </TextInputPressable>
            </RowContainerCol> */}
          
{/* 
            <CategoryName>Pronouns</CategoryName>
            <RowContainer>
                <RowName>{userAPIData.gender}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer> */}

            <CategoryName>Education</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditEducation", {uid: userAPIData._id })}>
                <RowName>{userAPIData.school}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>

            <CategoryName>Occupation</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditOccupation", {userData: userAPIData})}>
                <RowName>{userAPIData.occupation}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
        </ScrollView>
        </SafeAreaView>
       
    )
}