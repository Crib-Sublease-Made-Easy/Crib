import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  TouchableOpacity,
  Alert
} from 'react-native';
import { UserContext } from '../../../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';

import {GetFAIconWithColor, EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../sharedUtils';

import OneSignal from 'react-native-onesignal';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont() 
import { HeaderContainer, BackButtonContainer, NameContainer, Header,ResetButtonContainer, CategoryContainer, CategoryName,
      RowContainer, RowName, RowValueContainer, RowValueText } from './settingStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
FontAwesome.loadFont()

export default function SettingScreen({navigation, route}){
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [userData, setUserData] = useState("")
    const {sb, USERID, login} = useContext(UserContext);

    useEffect( ()=>{
      getNotificationStatus()
      const unsubscribe = navigation.addListener('focus', () => {
        getTokens()
    
        });
    return unsubscribe; 
    },[navigation])

    const getNotificationStatus = async() => {
      const deviceState = await OneSignal.getDeviceState();
      if(deviceState.notificationPermissionStatus == 1 ||deviceState.isSubscribed == false){
        setNotificationsEnabled(false)
      } else {
        setNotificationsEnabled(true)
      }
      // setNotificationsEnabled(!notificationsEnabled)
      // console.log("DEVICE STATE", deviceState)
    }

    const logout =  async() => {
      disconnectSendbird()
      OneSignal.disablePush(true);
      await EncryptedStorage.removeItem("studio.jpg");
      await EncryptedStorage.removeItem("accessToken");
      await EncryptedStorage.removeItem("refreshToken")
      await EncryptedStorage.removeItem("firstName");
      await EncryptedStorage.removeItem("lastName");
      await EncryptedStorage.removeItem("email");
      await EncryptedStorage.removeItem("userId");
      await EncryptedStorage.removeItem("profilePic");
      await AsyncStorage.clear()
      await login(null)
      navigation.reset(
        {index: 0 , routes: [{ name: 'ProfileTabs'}]}
    )
    }

    const disconnectSendbird = async () =>{
      const UID = await EncryptedStorage.getItem("userId");
      if (UID != undefined) {
        await sb.disconnect()
        console.log("Sendbird Disconnected")
      }
    }

    const toggleNotification = async () => {
      console.log("hello")
      //Prompt for push on iOS
      if(!notificationsEnabled){
        OneSignal.disablePush(false);
        const deviceState = await OneSignal.getDeviceState();
        if(deviceState.notificationPermissionStatus == 1){
          alert("Unable to turn on notifications. Please go to settings and enable Notifications.")
        } else if(deviceState.notificationPermissionStatus == 2 || deviceState.isSubscribed == true){
          setNotificationsEnabled(true)
        }

      } else{
        OneSignal.disablePush(true);
        const deviceState = await OneSignal.getDeviceState();
        if(deviceState.notificationPermissionStatus == 1 || deviceState.isSubscribed == false){
          setNotificationsEnabled(false)
        }
    }
  }
  async function getTokens(){
      const accessToken = await EncryptedStorage.getItem("accessToken");

      fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
      }) 
      .then(res => res.json()).then(async userData =>{
          setUserData(userData)   
      })
      .catch(e=>{
          console.log("ERROR --- SETTING --- GETOTKEN")
          alert(e)
      })
  }
  async function logoutAlert(){
    Alert.alert(
        'Are you sure?',
        'Your account will be put on pause.',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {text: 'Yes', onPress: () => logout(), style: 'destructive'},
        ],
        { 
          cancelable: true 
        }
    );
  }

  return(
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <EditPagesHeaderContainer>
          <EditPageBackButtonContainer>
              <Pressable onPress={()=> navigation.goBack()} >
                  <Ionicons name='arrow-back-outline' size={25} color='black'/>
              </Pressable>
          </EditPageBackButtonContainer>
          <EditPageNameContainer>
              <Header>Settings</Header>
          </EditPageNameContainer> 
          <EditPageForwardButtonContainer>
              
          </EditPageForwardButtonContainer>
      </EditPagesHeaderContainer>

        
        <CategoryContainer>
          <CategoryName>Account Information</CategoryName>
        </CategoryContainer>
        {/* Phone number press to change */}
        <RowContainer>
          <RowName>Phone Number</RowName>
          <RowValueContainer>
            <RowValueText>+1 {userData.phoneNumber}</RowValueText>
          </RowValueContainer>
        </RowContainer>
        <RowContainer>
          <RowName>Email</RowName>
          <RowValueContainer onPress={()=>navigation.navigate("ChangeEmail", {email: userData.email})}>
            <RowValueText>{userData.email}</RowValueText>
            {/* {GetFAIconWithColor("ArrowRight", 'black')} */}
          </RowValueContainer>
        </RowContainer>

        {/* Notification settings */}
        {/* <CategoryContainer>
          <CategoryName>Notifications</CategoryName>
        </CategoryContainer> */}
        {/* <RowContainer>
          <RowName>All Notifications</RowName>
          <Pressable onPress={() => toggleNotification()} style={{padding: WIDTH*0.01, backgroundColor: notificationsEnabled ? PRIMARYCOLOR : MEDIUMGREY, borderRadius: 5}}>
            {GetFAIconWithColor("Check", "white")}
          </Pressable>
        </RowContainer> */}
      

        <CategoryContainer>
          <CategoryName>General</CategoryName>
        </CategoryContainer>
        
        <RowContainer  onPress={() => navigation.navigate('TermsAndService')}>
          <RowName>Terms and Services</RowName>
          {GetFAIconWithColor("ArrowRight", "black")}
        </RowContainer>
        <RowContainer onPress={() => navigation.navigate('Privacy')}>
          <RowName>Privacy</RowName>
          {GetFAIconWithColor("ArrowRight", "black")}
        </RowContainer>
        <RowContainer onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}>
          <RowName>Contact Us</RowName>
          {GetFAIconWithColor("ArrowRight", "black")}
        </RowContainer>
        
        <CategoryContainer>
          <TouchableOpacity onPress={logoutAlert}>
          <CategoryName style={{color:'red'}}>Logout</CategoryName>
          </TouchableOpacity>
        </CategoryContainer>
  
    </SafeAreaView>
  )
}