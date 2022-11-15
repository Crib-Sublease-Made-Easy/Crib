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
import {Header, CategoryContainer, CategoryName,
      RowContainer, RowName, RowValueContainer, RowValueText, UpgradeContainer, UpgradeContainerLeft, UpgradeContainerRight, UpgradeContainerHeader, UpgradeContainerSubheader } from './settingStyle';
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
      <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
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

      <UpgradeContainer>
        <UpgradeContainerLeft>
          <Ionicons name='cog-outline' size={40} color='black'/>
        </UpgradeContainerLeft>
        <UpgradeContainerRight>
            <UpgradeContainerHeader>Upgrade to premium</UpgradeContainerHeader>
            <UpgradeContainerSubheader>
              Post more than
              one property and use advanced filtered!
            </UpgradeContainerSubheader>
        </UpgradeContainerRight>
      </UpgradeContainer>

      


        
        {/* Phone number press to change */}
        <RowContainer>
          <Ionicons name='share' size={22} color='black'/>
          <RowName>Share Crib</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}}>
          <Ionicons name='home' size={22} color='black'/>
          <RowName>List property</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}}>
          <Ionicons name='search' size={22} color='black'/>
          <RowName>View posted property</RowName>
        </RowContainer>
        <RowContainer>
          <Ionicons name='heart' size={22} color='black'/>
          <RowName>Favorite property</RowName>
        </RowContainer>
        <RowContainer>
          <Ionicons name='person' size={22} color='black'/>
          <RowName>My profile</RowName>
        </RowContainer>
        <RowContainer>
          <Ionicons name='newspaper' size={22} color='black'/>
          <RowName>Notification</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}}  onPress={() => navigation.navigate('TermsAndService')}>
          <Ionicons name='bookmarks' size={22} color='black'/>
          <RowName>Terms and services</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}} onPress={() => navigation.navigate('Privacy')}>
          <Ionicons name='shield' size={22} color='black'/>
          <RowName>Terms and services</RowName>
        </RowContainer>
        <RowContainer>
          <Ionicons name='mail' size={22} color='black' onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}/>
          <RowName>Contact us</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}} onPress={logoutAlert}>
          <Ionicons name='ellipsis-vertical' size={22} color='black'/>
          <RowName>Logout</RowName>
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
      
    </SafeAreaView>
  )
}