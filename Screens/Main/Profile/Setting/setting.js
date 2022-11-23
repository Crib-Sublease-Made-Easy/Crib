import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  TouchableOpacity,
  Alert,
  Text,
  View,
  Share
} from 'react-native';
import { UserContext } from '../../../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, EditPageForwardButtonContainer} from '../../../../sharedUtils';

import OneSignal from 'react-native-onesignal';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont() 
import { HeaderContainer, BackButtonContainer, NameContainer, Header,ResetButtonContainer, CategoryContainer, CategoryName,
      RowContainer, RowName, RowValueContainer, RowValueText, UpgradeContainerLeft, UpgradeContainer, UpgradeContainerRight, UpgradeContainerHeader, UpgradeContainerSubheader } from './settingStyle';
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
      try{
        await EncryptedStorage.clear()
      }
      catch (err){
        console.log(err)
      }
      try{
        await AsyncStorage.clear()
      }
      catch (err) {
        console.log(err)
      }
      await login(null)
      navigation.reset(
        {index: 0 , routes: [{ name: 'ProfileTabs'}]}
    )
    }

    const disconnectSendbird = async () =>{
      try{
        const UID = await EncryptedStorage.getItem("userId");
        if (UID != undefined) {
          await sb.disconnect()
          // console.log("Sendbird Disconnected")
        }
      }
      catch (err) {
        // console.log("An error has occured")
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
            setUserData(userData)   
        })
        .catch(e=>{
            console.log("ERROR --- SETTING --- GETOTKEN")
            alert(e)
        })
      }
    }
    catch{
      alert("Error. Please try again later!")
    }
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

  async function deleteAccountAlert(){
    Alert.alert(
      'Are you sure?',
      'Your account will be permanantly deleted.',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: () => deleteAccount(), style: 'destructive'},
      ],
      { 
        cancelable: true 
      }
    );
  }

  async function deleteAccount(){

    const accessToken = await EncryptedStorage.getItem("accessToken");

    if(route.params.propID != null && route.params.propID != undefined && accessToken != null){
      fetch('https://crib-llc.herokuapp.com/properties/' + route.params.propID, {
      method: 'DELETE',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
      },
      body:JSON.stringify({
          authyID: route.params.authyID
      })
      }).then(async res => {
         
        try{  
          await AsyncStorage.removeItem("postedProperty")
        }
        catch{
          alert("Error. Please try again later!")
        }
                
      })
      .catch((error) => {
        // console.log('Unable to delete this property. Please try again later.')
        console.log(error)
      });
    }
    if(USERID != undefined && route.params.authyID != undefined){
        fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
          authyID: route.params.authyID
        })
        }).then(async res => {
          logout()
        })
        .catch((error) => {
            console.log("ERRPR in deleting user", error)
        });
    }
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        // message:
        //   'Lighthouse | An app to find short term housing solutions made easy',
          url: 'https://apps.apple.com/us/app/crib-subleasing-made-easy/id1645127110'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


  return(
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
      <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
        <EditPageBackButtonContainer>
          <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
              <Ionicons name='arrow-back-outline' size={25} color='black'/>
          </Pressable>
        </EditPageBackButtonContainer>
        <EditPageNameContainer>
          <Header>Settings</Header>
        </EditPageNameContainer>
        <EditPageForwardButtonContainer/>
      </EditPagesHeaderContainer>


      <UpgradeContainer onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}>
        <UpgradeContainerLeft>
          <Ionicons name='cog-outline' size={40} color='black'/>
        </UpgradeContainerLeft>
        <UpgradeContainerRight>
            <UpgradeContainerHeader>Found a bug?</UpgradeContainerHeader>
            <UpgradeContainerSubheader>
              Report it now for better experience in the future.
            </UpgradeContainerSubheader>
        </UpgradeContainerRight>
      </UpgradeContainer>

      <RowContainer onPress={() => navigation.navigate("ProfileEdit", {userData : userData})}>
        <Ionicons name='person' size={22} color='black'/>
        <RowName>Profile</RowName>
      </RowContainer>
      <RowContainer style={{borderBottomWidth: 0}} onPress={onShare}>
        <Ionicons name='share' size={22} color='black'/>
        <RowName>Share Crib</RowName>
      </RowContainer>

        
        {/* <CategoryContainer>
          <CategoryName>Account Information</CategoryName>
        </CategoryContainer> */}
        {/* Phone number press to change */}
        <RowContainer style={{justifyContent:'space-between'}} >
          {/* <RowName>Phone Number</RowName>
          <RowValueContainer>
            <RowValueText>+1 {userData.phoneNumber}</RowValueText>
          </RowValueContainer> */}
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <Ionicons name='newspaper' size={22} color='black'/>
            <RowName>Notification</RowName>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: PRIMARYCOLOR }}
            thumbColor={ notificationsEnabled ? 'white': "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={()=> toggleNotification()}
            value={notificationsEnabled}
          />
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}}  onPress={() => navigation.navigate('TermsAndService')}>
          <Ionicons name='bookmarks' size={22} color='black'/>
          <RowName>Terms and services</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}} onPress={() => navigation.navigate('Privacy')}>
          <Ionicons name='shield' size={22} color='black'/>
          <RowName>Privacy</RowName>
        </RowContainer>
        <RowContainer onPress={()=> navigation.navigate("ContactUs", {email: userData.email})}>
          <Ionicons name='mail' size={22} color='black' />
          <RowName>Contact us</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}} onPress={logoutAlert}>
          <Ionicons name='ellipsis-vertical' size={22} color='black'/>
          <RowName>Logout</RowName>
        </RowContainer>
        <RowContainer style={{borderBottomWidth: 0}} onPress={deleteAccountAlert}>
          <Ionicons name='exit' size={22} color='black'/>
          <RowName >Delete account</RowName>
        </RowContainer>
        {/* <RowContainer>
          <RowName>Email</RowName>
          <RowValueContainer onPress={()=>navigation.navigate("ChangeEmail", {email: userData.email})}>
            <RowValueText>{userData.email}</RowValueText>
            <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
          </RowValueContainer>
        </RowContainer> */}
  
    </SafeAreaView>
  )
}