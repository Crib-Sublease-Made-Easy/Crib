import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  TouchableOpacity
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../../UserContext';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../sharedUtils';


import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header,ResetButtonContainer, CategoryContainer, CategoryName,
      RowContainer, RowName, RowValueContainer, RowValueText } from './settingStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
FontAwesome.loadFont()


export default function SettingScreen({navigation, route}){
    const [messageNotification, setMessageNotification] = useState(true)
    const [newPropNotification, setNewPropNotification] = useState(true)
    const [userData, setUserData] = useState("")
    const {user, login} = useContext(UserContext);

    useEffect(()=>{
      const unsubscribe = navigation.addListener('focus', () => {
        getTokens()
    
        });
    return unsubscribe; 
    },[navigation])

    const logout =  async() => {
      await SecureStorage.removeItem("studio.jpg");
      await SecureStorage.removeItem("accessToken");
      await SecureStorage.removeItem("firstName");
      await SecureStorage.removeItem("lastName");
      await SecureStorage.removeItem("email");
      await SecureStorage.removeItem("userId");
      await SecureStorage.removeItem("profilePic");
      await AsyncStorage.clear()
      login(null)
    }

    async function getTokens(){
      const accessToken = await SecureStorage.getItem("accessToken");
     //console.log("Access Token " + accessToken)

      const UID = await SecureStorage.getItem("userId");

    //  console.log("UID " + UID)
      fetch('https://sublease-app.herokuapp.com/users/' + UID, {
      method: 'GET',
      headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
      }
      }) 
      .then(res => res.json()).then(async userData =>{
          // console.log("userdata")
          setUserData(userData)
          console.log("userdata")
          console.log(userData)   
      //    console.log("data")
      //    console.log(userData)
          //console.log(userData.postedProperties.length)      
      })
      .catch(e=>{
          alert(e)
      })
  }

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}} />
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Settings</Header>
                </NameContainer>
                {/* <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}}>
                        <Ionicons name='checkmark-done' size={25} />
                    </Pressable>
                </ResetButtonContainer> */}
            </HeaderContainer>

            {/* <View style={{width:WIDTH, height: HEIGHT*0.025}}/> */}

            {/* General Account information */}
            <CategoryContainer>
              <CategoryName>Account Information</CategoryName>
            </CategoryContainer>
            {/* Phone number press to change */}
            <RowContainer>
              <RowName>Phone Number</RowName>
              <RowValueContainer>
                <RowValueText>+1 {userData.phoneNumber}</RowValueText>
                {/* <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/> */}
              </RowValueContainer>
            </RowContainer>
            <RowContainer>
              <RowName>Email</RowName>
              <RowValueContainer onPress={()=>navigation.navigate("ChangeEmail", {email: userData.email})}>
                <RowValueText>{userData.email}</RowValueText>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
              </RowValueContainer>
            </RowContainer>

            {/* Notification settings */}
            <CategoryContainer>
              <CategoryName>Notifications</CategoryName>
            </CategoryContainer>
            <RowContainer>
              <RowName>All Notifications</RowName>
              <Switch
                trackColor={{ false: "#767577", true: PRIMARYCOLOR }}
                thumbColor={ messageNotification ? 'white': "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> setMessageNotification(!messageNotification)}
                value={messageNotification}
              />
            </RowContainer>
            {/* <RowContainer>
              <RowName>New Properties</RowName>
              <Switch
                trackColor={{ false: "#767577", true: PRIMARYCOLOR }}
                thumbColor={ messageNotification ? 'white': "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> setNewPropNotification(!newPropNotification)}
                value={newPropNotification}
              />
            </RowContainer> */}

            <CategoryContainer>
              <CategoryName>General</CategoryName>
            </CategoryContainer>
            {/* <RowContainer>
              <RowName>Help</RowName>
              <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer> */}
            <RowContainer>
              <RowName>Privacy</RowName>
              <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <RowContainer onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}>
              <RowName>Contact Us</RowName>
              <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            {/* <RowContainer>
              <RowName>Career</RowName>
              <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer> */}
            
            <CategoryContainer>
              <TouchableOpacity onPress={() => logout()}>
              <CategoryName style={{color:'red'}}>Logout</CategoryName>
              </TouchableOpacity>
            </CategoryContainer>
           
            
        </SafeAreaView>
    )
}