import React, {useState, useRef, useEffect, useContext} from 'react'
import {
SafeAreaView,
Image,
Pressable,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


import Ionicons from 'react-native-vector-icons/Ionicons';


import ImagePicker from 'react-native-image-crop-picker';

import { UserContext } from '../../../UserContext';

import {WIDTH, EXTRALIGHT } from '../../../sharedUtils';

import {
HeaderContainer, 
Header, 
BackButtonContainer, 
NameContainer,
TopContainer, 
ImageContainer,
NameJobContainer,
RowContainer, 
CategoryName, 
RowName,
ChangeProfilePicText,
NameText
} from './profileEditStyle';
import { faJpy } from '@fortawesome/free-solid-svg-icons';

export default function ProfileEditScreen({navigation, route}){
    
    const {sb, USERID} = useContext(UserContext);
    const [userAPIData, setUserAPIData] = useState(route.params.userData)
    const [profilePic, setProfilePic] = useState(route.params.userData == undefined ? null : route.params.userData.profilePic)
    const [school, setSchool] = useState(route.params.userData == undefined ? null : route.params.userData.school)
    const [occupation, setOccupation] =  useState(route.params.userData == undefined ? null : route.params.userData.occupation)
   
    useEffect(()=>{
        
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });
        return unsubscribe;       
    },[navigation])
    
    // Get user inforamtion 
    async function getTokens(){
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined){
                fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
                    method: 'GET',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    }
                }) 
                .then(res => res.json()).then(async userData =>{
                    setUserAPIData(userData)
                    //set the profilePic state varaible 
                    const cachedProfilePic = await AsyncStorage.getItem("profilePic")
                    if(school == null || userData.school != school){
                        // console.log("UPDATE --- API --- school")
                        
                        setSchool(userData.school)
                    }
                    else{
                        // console.log("UPDATE --- PARAMS --- school")
                    }
                    if(occupation == null || userData.occupation != occupation){
                        // console.log("UPDATE --- API --- school")
                        setOccupation(userData.occupation)
                    }
                    else{
                        // console.log("UPDATE --- PARAMS --- occupation")
                    }

                    // This is to set the profile pic 
                    if(cachedProfilePic == null && (userData.profilePic != route.params.userData.profilePic)){
                        // console.log("UPDATE --- API --- profilePic")
                        setProfilePic(userData.profilePic)
                        try{
                            if(userData.profilePic != undefined){
                                await AsyncStorage.setItem("profilePic", userData.profilePic)
                            }
                        }
                        catch{
                            e=>{
                                console.log("ERROR --- PROFILEEDIT --- GETTOKEN")
                                console.log(e)
                            }
                        }
                    }
                    else if(profilePic == null){
                        // console.log("UPDATE --- CACHE --- profilePic")
                        setProfilePic(cachedProfilePic)
                    }
                    else{
                        // console.log("UPDATE --- PARAMS --- profilePic")
                    }
                })
                .catch(e=>{
                    // console.log("ERROR --- PROFILEEDIT --- GETTOKEN")
                    alert(e)
                })
            }
        }
        catch{
            console.log("ERROR --- GETTOKEN")
        }
        
    }

    //Function cahnge profile pic
    async function SelectProfilePic(){
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined && USERID != undefined && USERID != null){
                ImagePicker.openPicker({
                    width: 300,
                    height: 300,
                    cropping:true,
                    compressImageQuality: 0.8
                }).then(image => {
            
                    const formData = new FormData();
                
                    var array = image.path.split(".");      
                    formData.append("userImage", {
                        uri: image.path,
                        type: 'image/' + array[1],
                        name: 'someName',
                    }); 
    
                    fetch('https://crib-llc.herokuapp.com/users/profileImages/' + USERID, {
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
                            console.log("SET --- CACHE --- profilePic")
                            setProfilePic(data.profilePic)
                            try{
                                await AsyncStorage.setItem("profilePic", data.profilePic)
                                let firstName = await EncryptedStorage.getItem("firstName")
                                const ll = await sb.updateCurrentUserInfo(firstName,data.profilePic)
                            }
                            catch{e=>{
                                console.log(e)
                            }}
                        }
                    })
                    .catch((error) => {
                        if (error.code === 'E_PICKER_CANCELLED') { // here the solution
                        return false;
                        }
                    });
                }).catch(e=>{
                    console.log(e)
                })
            }
           
        }
        catch{
            console.log("ERROR in selectrproficpic")
        }
    }   

    return(
        
        <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
            <ScrollView>
                {/* Header EditProfile */}
                <HeaderContainer>
                    <BackButtonContainer>
                        <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                            <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                        </Pressable>
                    </BackButtonContainer>
                    <NameContainer>
                        <Header>Edit Profile</Header>
                    </NameContainer> 
                </HeaderContainer>
                
                {/* This is for select profile pic and tap */}
                <TopContainer>
                        <ImageContainer onPress={SelectProfilePic}>
                            <Image source={{uri: profilePic}} style={{width: WIDTH*0.35, height:WIDTH*0.35, borderRadius:WIDTH*0.175, backgroundColor: EXTRALIGHT}}/>
                            <Pressable onPress={SelectProfilePic}>
                                <ChangeProfilePicText>Tap to change</ChangeProfilePicText>
                            </Pressable>
                        </ImageContainer>
                        <NameJobContainer>
                            <NameText>{userAPIData.firstName}  {userAPIData.lastName}</NameText>
                            {/* <AgeText style={{color:DARKGREY}}>{userAge} years old</AgeText> */}
                        </NameJobContainer>
                </TopContainer>
                
                {/* Change Education */}
                <CategoryName>Education</CategoryName>
                <RowContainer onPress={()=> navigation.navigate("EditEducation", {uid: USERID })}>
                    <RowName>{school}</RowName>
                    <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
                </RowContainer>

                {/* Change Occupation*/}
                <CategoryName>Occupation</CategoryName>
                <RowContainer onPress={()=> navigation.navigate("EditOccupation")}>
                    {occupation == null ?
                    <RowName></RowName>
                    :
                    <RowName>{occupation ==  undefined ? "Hidden" : occupation}</RowName>
                    }
                    <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
                </RowContainer>
            </ScrollView>
        </SafeAreaView>
    )
}