import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  TouchableOpacity,
  Alert
} from 'react-native';
import { UserContext } from '../../../../UserContext';

import SecureStorage from 'react-native-secure-storage'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../sharedUtils';

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
      await SecureStorage.removeItem("accessToken")
      await SecureStorage.removeItem("refreshToken")
      await AsyncStorage.clear()
      await login(null)
      navigation.reset(
        {index: 0 , routes: [{ name: 'ProfileTabs'}]}
    )
    }

    const disconnectSendbird = async () =>{
      const UID = await SecureStorage.getItem("userId");
      if (UID != undefined) {
        await sb.disconnect()
        console.log("Sendbird Disconnected")
      }
    }

    const toggleNotification = async () => {

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
      const accessToken = await SecureStorage.getItem("accessToken");

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
      <HeaderContainer>
            <BackButtonContainer>
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}} />
                </Pressable>
            </BackButtonContainer>
            <NameContainer>
                <Header>Settings</Header>
            </NameContainer>
          
        </HeaderContainer>

        
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
            thumbColor={ notificationsEnabled ? 'white': "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={()=> toggleNotification()}
            value={notificationsEnabled}
          />
        </RowContainer>
      

        <CategoryContainer>
          <CategoryName>General</CategoryName>
        </CategoryContainer>
        
        <RowContainer  onPress={() => navigation.navigate('TermsAndService')}>
          <RowName>Terms and Services</RowName>
          <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
        </RowContainer>
        <RowContainer onPress={() => navigation.navigate('Privacy')}>
          <RowName>Privacy</RowName>
          <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
        </RowContainer>
        <RowContainer onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}>
          <RowName>Contact Us</RowName>
          <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
        </RowContainer>
        
        <CategoryContainer>
          <TouchableOpacity onPress={logoutAlert}>
          <CategoryName style={{color:'red'}}>Logout</CategoryName>
          </TouchableOpacity>
        </CategoryContainer>
  
    </SafeAreaView>
  )
}