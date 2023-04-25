import * as React from 'react';
import { useState, useRef, useEffect, createContext } from 'react';
import {
  AppState,
  Image
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import './onChat'

//User Context
import { UserContext } from './UserContext.js';

//Screens
import LandingScreen from './Screens/Onboarding/Landing/landing.js';
import LoginScreen from './Screens/Onboarding/login.js';
import Login_OTP from './Screens/Onboarding/login_otp.js';

import SignupScreen from './Screens/Onboarding/signup.js';
import TermsAndService from './Screens/Onboarding/termsAndService';
import Privacy from './Screens/Onboarding/privacy';
import FirstLastNameScreen from './Screens/Onboarding/FirstLastName/firstLastName.js';
import AgeScreen from './Screens/Onboarding/Age/age.js';
import GenderScreen from './Screens/Onboarding/Gender/gender.js';
import ProfilePicScreen from './Screens/Onboarding/ProfilePic/profilePic.js';
import OccupationScreen from './Screens/Onboarding/Occupation/occupation.js';
import SchoolScreen from './Screens/Onboarding/School/school.js';
import EmailScreen from './Screens/Onboarding/Email/email.js';
import TenantOrSubtenantScreen from './Screens/Onboarding/TenantOrSubtenant/tenantorsubtenant.js'
import PasswordScreen from './Screens/Onboarding/Password/password.js';
import PhoneNumberScreen from './Screens/Onboarding/PhoneNumber/phoneNum.js';
import NotificationPromptScreen from './Screens/Onboarding/NotificationProm/notificationPrompt';

import EmailPasswordScreen from './Screens/Onboarding/emailPassword.js';
import OTPScreen from './Screens/Onboarding/otp.js';

import PropertyDetailScreen from './Screens/Main/Discover/discoverPropertyDetail.js';
import PropertyPostingScreen from './Screens/Main/Discover/discoverpropertyPosting.js';
import DiscoverTab from './Screens/Main/Discover/discoverMain.js';
import DiscoverFilterScreen from './Screens/Main/Discover/Filter/discoverFilter.js';


import ProfileTab from './Screens/Main/Profile/profileMain.js';
import ProfileEditScreen from './Screens/Main/Profile/profileEdit.js';
import EditEducationScreen from './Screens/Main/Profile/EditProfile/EditEducation/editEducation.js';
import EditOccupationScreen from './Screens/Main/Profile/EditProfile/EditOccupation/editOccupation.js';
import SettingScreen from './Screens/Main/Profile/Setting/setting.js'
import ChatScreen from './Screens/Main/Message/chat.js'

import ReportUsScreen from './Screens/Main/Profile/Setting/ReportUser/ReportUser';

import ChangeNumberScreen from './Screens/Main/Profile/Setting/changeNumber.js';
import ChangeEmailScreen from './Screens/Main/Profile/Setting/ChangeEmail/changeEmail.js';
import EditAboutMeScreen from './Screens/Main/Profile/EditProfile/EditAboutMe/editAboutMe.js';
import EditPropertyScreen from './Screens/Main/Profile/EditProperty/editProperty.js';
import OTPEditScreen from './Screens/Main/Profile/Setting/OTPNumber/otpEdit.js';

import ContactUsScreen from './Screens/Main/Profile/Setting/ContactUs/contactUs.js';

//Property Edit Screens
import PropTypesScreen from './Screens/Main/Profile/EditProperty/EditPropTypeModal/propertyTypeModal.js';
import EditPropertyPriceScreen from './Screens/Main/Profile/EditProperty/EditPropertyPrice/editPropertyPrice.js';
import EditPropertyAvailScreen from './Screens/Main/Profile/EditProperty/EditPropertyAvailability/editPropertyAvail.js';
import EditPropertyDescriptionScreen from './Screens/Main/Profile/EditProperty/EditPropertyDescription/editPropertyDescription.js';
import EditPropertyAmenitiesScreen from './Screens/Main/Profile/EditProperty/EditPropertyAmenities/editPropertyAmen.js';

import PostedPropertyScreen from './Screens/Main/Profile/postedProperty';
import FavoritePropertyScreen from './Screens/Main/Profile/favProperty';
import LikeViewScreen from './Screens/Main/Profile/viewLikes';

import LoadingScreen from './LoadingScreen';

import MyReferralCodeScreen from './Screens/Main/Premium/ReferalCode/myReferralCode'
import EnterReferralCodeScreen from './Screens/Main/Profile/Setting/EnterReferralCode/enterReferralCode'
import PriceBreakDownScreen from './Screens/Main/Premium/PriceBreakdown/priceBreakdown';

//Message
import MessageTab from './Screens/Main/Message/message.js';

//Navigation between tabs
import { NavigationContainer, getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { CardStyleInterpolators } from '@react-navigation/stack';




import SendBird from 'sendbird'

const Stack = createSharedElementStackNavigator();

const appId = 'EF181665-2473-42C6-9376-A340AF716169';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CribConnectSubtenantScreen from './Screens/Main/Premium/CribConnectSubtenant/cribconnectsubtenant';
import CribConnectTenantScreen from './Screens/Main/Premium/CribConnectTenant/cribconnecttenant';
import CribConnectPreferenceScreen from './Screens/Main/Premium/CribConnectPreference/cribconnectpreference';


export default function App() {


  
  const appState = useRef(AppState.currentState);
  const [user, setUser] = useState(null)


  const [sendBirdConnected, setSendbirdConnection] = useState(false)
  const [preloadProperties, setPreloadProperties] = useState([])
  const [lastSearchedCoor, setLastSearchedCoor] = useState()


  const sb = new SendBird({ appId: appId});   // The `localCacheEnabled` is optional. The default is false.




//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("EF181665-2473-42C6-9376-A340AF716169");
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(async response => {
  const deviceState = await OneSignal.getDeviceState();
  // console.log(deviceState)
  try{
    const cacheOneSignalID = await EncryptedStorage.getItem("oneSignalUserID");
    if (deviceState.userId != cacheOneSignalID && deviceState != null){
      
      await EncryptedStorage.setItem("oneSignalUserID", deviceState.userId);
    }
  }
  catch{e=>{
    console.log(("TRY/CATCH in APP.js EncryptedStorage.setItem('oneSignalUserID')"))
    console.log(e)
  }}
});



//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  // console.log("OneSignal: notification opened:", notification);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  // console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  // console.log("notification: ", notification);
  const data = notification.additionalData
  // console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  if(!onChat){
    notificationReceivedEvent.complete(notification);
  } else{
    notificationReceivedEvent.complete(null);
  }

});

  useEffect(() => {
   
    cleanup()
    // console.log("INITIALIZE APP.JS USEEFFECT")
    // refreshAccessToken()
    const subscription = AppState.addEventListener("change", nextAppState => {

      if (
        // appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // console.log("App has come to the foreground!");
        refreshAccessToken()
      } 
      else{
        onChat = false
        disconnectSendbird()
      }

      appState.current = nextAppState;
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };

  }, [user])

  //Check if the user logged is on app for the first time
  //If launch is null ( new install ): then clean up all stored varaibled

  async function cleanup(){
    try{
      const firstTime = await AsyncStorage.getItem("launched")
      if(firstTime != null){
        await AsyncStorage.setItem("launched", 'true');
      }
      else{
        // console.log("New start after uninstalling")
        await EncryptedStorage.clear();
        await AsyncStorage.clear()
        await AsyncStorage.setItem("launched", 'true');
      }
    }
    catch{ e => {
      alert("Error! Please try again later.")
    }
    }
  }

  const disconnectSendbird = async () =>{
    try{
      const UID = await EncryptedStorage.getItem("userId");
      if (UID != undefined) {
        await sb.disconnect()
        console.log("Sendbird Disconnected")
      }
    }
    catch{
      console.log("ERROR --- APP.JS --- DISCONNECT")
    }
  }


  const connectSendbird = async (UID) => {
    setUser(UID)
    try {
      console.log("connecting to sendbird")
      await sb.connect(UID, function (user, error) {
        if (error) {
          // Handle error.
          console.log("Error connecting to sendbird in the App.Js")
          console.log(error)
        }
        else {
          // The user is connected to Sendbird server.
          console.log("sendbird connected")
        }
      });
    } 
    catch (err) {
      // Handle error.
      console.log("SENDBIRD ERROR")
    }
  }


  const refreshAccessToken = async () => {
    try{
      const rt = await EncryptedStorage.getItem("refreshToken");
      
      const id = await EncryptedStorage.getItem("userId");

      //If refresh token is undefined, meaning user have not logged in
      if (rt != undefined && id != undefined) {
        setUser(id)
        connectSendbird(id)
      
        await fetch('https://crib-llc.herokuapp.com/tokens/accessRefresh', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + rt
          }
        }).then(async e => {
          const response = await e.json();
          if(e.status == 200){
            try {
              if(response.accessToken != undefined ?? response.accessToken != null){
                await EncryptedStorage.setItem("accessToken", response.accessToken)
                const cachedProfilePic = await EncryptedStorage.getItem("profilePic");
                if(cachedProfilePic != undefined){
                  await Image.prefetch(cachedProfilePic);
                  console.log("PREFETCH --- APP.JS --- PROFILEPIC")
                }
              }
              
            } catch (err) {
              alert(err)
            }
          }
          else if(e.status == 401){
            alert("An error has occured.");
            logout()
          }
          else{
            alert("An error has occured.")
          }
        })
        .catch ( e => {
          alert("An error has occured.")
        })
      }
      else{
        console.log("Refresh Token is undefined. User is not logged in.")
      }
    }
    catch{
      console.log("ERROR --- APP --- REFRESHTOKEN")
    }
  
  }
  const login = (name) => {
    setUser(name);
  };

  const logout = async() => {
    console.log("Logging out")
    disconnectSendbird()
    OneSignal.disablePush(true);
    try{
      await EncryptedStorage.clear()
    }
    catch (err){
      console.log("Clearing encryted storage", err)
    }
    try{
      await AsyncStorage.clear()
    }
    catch (err) {
      console.log("Clearing encryted storage", err)
      console.log(err)
    }
    login(null)
  };


  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });


  // async function checkCribConnect(){
  //   const accessToken = await EncryptedStorage.getItem("accessToken");
  //   let USERID = await EncryptedStorage.getItem("userId")
  
  //   if(accessToken != undefined && USERID != undefined && accessToken != null){
        
  //       //Get user favorite properties
  //       // fetchFavoriteProperties(accessToken)
        
  //       await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
  //       method: 'GET',
  //       headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + accessToken,
  //       }
  //       }) 
  //       .then(res => res.json()).then(async userData =>{
            
  //           if(userData.cribPremium.paymentDetails.status == true){
  //               setCribPremium(true)
  //           }
  //           setUserData(userData)
  //           if(userData.cribPremium.paymentDetails.status == false){
  //               checkIfPaid(userData)
  //           }
  //       })
  //       .catch(e=>{
  //         console.log("Error")
  //       })
  //   }

  // }



  return (

    <NavigationContainer>
      <UserContext.Provider value={{ login, logout, sb, USERID: user, preloadProperties: preloadProperties, lastSearchedCoor: lastSearchedCoor}}>

          <Stack.Navigator>

            <Stack.Screen
            name="PreloadData"
            component={LoadingScreen}
            options={{headerShadowVisible: false,cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter, headerShown:false}}
            />

            <Stack.Screen
              name="DiscoverTabs"
              component={DiscoverTab}
              options={{headerShadowVisible: false,cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter, headerShown:false}}
            />

            <Stack.Screen
              name="ProfileTabs"
              component={ProfileTab}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
            />

            <Stack.Screen
              name="MessageTabs"
              component={MessageTab}
              options={{cardStyleInterpolator: forFade, headerStyle:{backgroundColor:'red'},  }}
            />


            <Stack.Screen name="PropertyDetail"
              component={PropertyDetailScreen}
              options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, gestureEnabled: false }}
              
            />
            <Stack.Screen name="PropertyPosting"
              component={PropertyPostingScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                gestureEnabled: false 
              }}
            />

            <Stack.Screen name="PropertyFilter"
              component={DiscoverFilterScreen}
              options={{
                headerShown: false, presentation: 'transparentModal',
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
              }}
            />

            <Stack.Screen name="Setting"
              component={SettingScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />

            <Stack.Screen name="TermsAndService"
              component={TermsAndService}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />
            <Stack.Screen name="Privacy"
              component={Privacy}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />
            <Stack.Screen name="Chat"
              component={ChatScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
              }}
              
              
            />
            <Stack.Screen name="ChangeNumber"
              component={ChangeNumberScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />
            <Stack.Screen name="ChangeEmail"
              component={ChangeEmailScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />

            <Stack.Screen name="OTPEdit"
              component={OTPEditScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
              }}
            />
            <Stack.Screen name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, gestureDirection: 'vertical'
              }}
            />

            <Stack.Screen name="EditEducation"
              component={EditEducationScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditOccupation"
              component={EditOccupationScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditAboutMe"
              component={EditAboutMeScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditProperty"
              component={EditPropertyScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditPropertyType"
              component={PropTypesScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditPropertyPrice"
              component={EditPropertyPriceScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditPropertyAvail"
              component={EditPropertyAvailScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditPropertyDescription"
              component={EditPropertyDescriptionScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EditPropertyAmenities"
              component={EditPropertyAmenitiesScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="ContactUs"
              component={ContactUsScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />

            <Stack.Screen name="PostedProperty"
              component={PostedPropertyScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />

            <Stack.Screen name="FavoriteProperty"
              component={FavoritePropertyScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="LikeProperty"
              component={LikeViewScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="ReportUser"
              component={ReportUsScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />

            <Stack.Screen name="MyReferralCode"
              component={MyReferralCodeScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="EnterReferralCode"
              component={EnterReferralCodeScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="CribConnectSubtenant"
              component={CribConnectSubtenantScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="CribConnectTenant"
              component={CribConnectTenantScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="CribConnectPreference"
              component={CribConnectPreferenceScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            />
            <Stack.Screen name="CribConnectPriceBreakdown"
              component={PriceBreakDownScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              }}
            />





          

            <Stack.Screen name="Landing" component={LandingScreen} options={{ 
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS}} 
              />
            <Stack.Screen
              name="Login"
              component={LoginScreen}

              options={{ headerShown: false }}
            />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FirstLastName" component={FirstLastNameScreen} options={{ headerShown: false, }} />
            <Stack.Screen name="Age" component={AgeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePic" component={ProfilePicScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Occupation" component={OccupationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="School" component={SchoolScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NotificationPrompt" component={NotificationPromptScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Email" component={EmailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TenantOrSubtenant" component={TenantOrSubtenantScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Password" component={PasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login_OTP"
              component={Login_OTP}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
            />

            <Stack.Screen name="EmailPassword" component={EmailPasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="otp" component={OTPScreen} options={{ headerShown: false }} />

          </Stack.Navigator>
        


      </UserContext.Provider>
    </NavigationContainer>

  )
}