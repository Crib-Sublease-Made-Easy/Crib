import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  TouchableOpacity,
  Alert
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../../UserContext';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../sharedUtils';

import OneSignal from 'react-native-onesignal';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header,ResetButtonContainer, CategoryContainer, CategoryName,
      RowContainer, RowName, RowValueContainer, RowValueText } from './settingStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
FontAwesome.loadFont()

OneSignal.setAppId("440ad232-b229-4ea1-963b-5037d3ac9413");

export default function SettingScreen({navigation, route}){
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [userData, setUserData] = useState("")
    const {user, login} = useContext(UserContext);

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
      console.log("DEVICE STATE", deviceState)
    }

    const logout =  async() => {
      await SecureStorage.removeItem("accessToken")
      await SecureStorage.removeItem("refreshToken")
      await AsyncStorage.clear()
      await login(null)
      navigation.reset(
        {index: 0 , routes: [{ name: 'ProfileTabs'}]}
    )
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
     //console.log("Access Token " + accessToken)

      const UID = await SecureStorage.getItem("userId");

    //  console.log("UID " + UID)
      fetch('https://crib-llc.herokuapp.com/users/' + UID, {
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
                thumbColor={ notificationsEnabled ? 'white': "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=> toggleNotification()}
                value={notificationsEnabled}
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
            <RowContainer  onPress={() => navigation.navigate('TermsAndService')}>
              <RowName>Terms of services</RowName>
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
            {/* <RowContainer>
              <RowName>Career</RowName>
              <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer> */}
            
            <CategoryContainer>
              <TouchableOpacity onPress={logoutAlert}>
              <CategoryName style={{color:'red'}}>Logout</CategoryName>
              </TouchableOpacity>
            </CategoryContainer>
           
            
        </SafeAreaView>
    )
}