import * as React from 'react';
import { useState, useContext, useEffect, createContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

const PRIMARYGREY = '#5e5d5d'
const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

//User Context
import { UserContext } from './UserContext.js';

//Screens
import LandingScreen from './Screens/Onboarding/Landing/landing.js';
import LoginScreen from './Screens/Onboarding/login.js';
import Login_OTP from './Screens/Onboarding/login_otp.js';

import SignupScreen from './Screens/Onboarding/signup.js';
import FirstLastNameScreen from './Screens/Onboarding/FirstLastName/firstLastName.js';
import AgeScreen from './Screens/Onboarding/Age/age.js';
import GenderScreen from './Screens/Onboarding/Gender/gender.js';
import ProfilePicScreen from './Screens/Onboarding/ProfilePic/profilePic.js';
import OccupationScreen from './Screens/Onboarding/Occupation/occupation.js';
import SchoolScreen from './Screens/Onboarding/School/school.js';
import EmailScreen from './Screens/Onboarding/Email/email.js';
import PasswordScreen from './Screens/Onboarding/Password/password.js';
import PhoneNumberScreen from './Screens/Onboarding/PhoneNumber/phoneNum.js';

import EmailPasswordScreen from './Screens/Onboarding/emailPassword.js';
import OTPScreen from './Screens/Onboarding/otp.js';

import PropertyDetailScreen from './Screens/Main/Discover/discoverPropertyDetail.js';
import PropertyPostingScreen from './Screens/Main/Discover/discoverpropertyPosting.js';
import DiscoverTab from './Screens/Main/Discover/discoverMain.js';
import DiscoverFilterScreen from './Screens/Main/Discover/Filter/discoverFilter.js';
import DiscoverSearchScreen from './Screens/Main/Discover/discoverSearch.js'

import ProfileTab from './Screens/Main/Profile/profileMain.js';
import ProfileEditScreen from './Screens/Main/Profile/profileEdit.js';
import EditEducationScreen from './Screens/Main/Profile/EditProfile/EditEducation/editEducation.js';
import EditOccupationScreen from './Screens/Main/Profile/EditProfile/EditOccupation/editOccupation.js';
import SettingScreen from './Screens/Main/Profile/Setting/setting.js'
import ChatScreen from './Screens/Main/Message/chat.js'

import ChangeNumberScreen from './Screens/Main/Profile/Setting/changeNumber.js';
import ChangeEmailScreen from './Screens/Main/Profile/Setting/ChangeEmail/changeEmail.js';
import EditAboutMeScreen from './Screens/Main/Profile/EditProfile/EditAboutMe/editAboutMe.js';
import EditPropertyScreen from './Screens/Main/Profile/EditProperty/editProperty.js';
import OTPEditScreen from './Screens/Main/Profile/Setting/OTPNumber/otpEdit.js';

//Property Edit Screens
import PropTypesScreen from './Screens/Main/Profile/EditProperty/EditPropTypeModal/propertyTypeModal.js';
import EditPropertyPriceScreen from './Screens/Main/Profile/EditProperty/EditPropertyPrice/editPropertyPrice.js';
import EditPropertyAvailScreen from './Screens/Main/Profile/EditProperty/EditPropertyAvailability/editPropertyAvail.js';
import EditPropertyDescriptionScreen from './Screens/Main/Profile/EditProperty/EditPropertyDescription/editPropertyDescription.js';
import EditPropertyAmenitiesScreen from './Screens/Main/Profile/EditProperty/EditPropertyAmenities/editPropertyAmen.js';

//Message
import MessageTab from './Screens/Main/Message/message.js';

//Navigation between tabs
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CardStyleInterpolators } from '@react-navigation/stack';
import SendBird from 'sendbird'

const Stack = createSharedElementStackNavigator();

const appId = '14BD0602-4159-48D7-9292-66136C479B46';

import OneSignal from 'react-native-onesignal';






const PRIMARYCOLOR = '#4050B5'

export default function App() {
  const [sendBirdConnected, setSendbirdConnection] = useState(false)

  const [testUserId, setTestUserId] = useState('')

  const sb = new SendBird({ appId: appId, localCacheEnabled: true });   // The `localCacheEnabled` is optional. The default is false.



//OneSignal Init Code
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("3573fb4c-2c3e-4245-b509-4a75f1c5edd1");
//END OneSignal Init Code

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log("Prompt response:", response);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});



  useEffect(async () => {
    
    console.log("NEW APP REFRESH")
    refreshAccessToken()
  }, [])
  const connectSendbird = async () => {
    const UID = await SecureStorage.getItem("userId");
    if (UID != undefined) {
      try {
        console.log("connecting to sendbird")
        console.log()
        sb.connect(UID, function (user, error) {
          if (error) {
            // Handle error.
            console.log("sendbird error")
            console.log(error)
          }
          else {
            console.log("sendbird connected")
            console.log(user)
          }
          // The user is connected to Sendbird server.
        });
        // The user is connected to the Sendbird server.
      } catch (err) {
        // Handle error.
        console.log("SENDBIRD ERROR")
      }
    }
  }

  const refreshAccessToken = async () => {
      
    const rt = await SecureStorage.getItem("refreshToken");
    const id = await SecureStorage.getItem("userId");
    if (rt != undefined) {
      setUser(id)
      fetch('https://sublease-app.herokuapp.com/tokens/accessRefresh', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + rt
        }
      }).then(async e => e.json()).then(async (response) => {
        console.log("RESOPONSE", response)
        try {
          await SecureStorage.setItem("accessToken", response.accessToken)
        } catch (err) {
          console.log(err)
        }
      })

      const at = await SecureStorage.getItem("accessToken");


      fetch('https://sublease-app.herokuapp.com/users/' + id, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + at
        }
      }).then(async e => e.json()).then(async (response) => {
        console.log("FETCH USER", response)
        try {
          await SecureStorage.setItem("firstName", response.firstName)
          await SecureStorage.setItem("lastName", response.lastName)
          await SecureStorage.setItem("profilePic", response.profilePic)
          login(id);
        } catch (err) {
          console.log(err)
        }
      })
      connectSendbird()
    }
  }



  const [user, setUser] = useState(null)

  const login = (name) => {
    setUser(name);
  };

  const logout = () => {
    setUser(null);
  };


  const forFade = ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (

    <NavigationContainer>
      <UserContext.Provider value={{ user, login, logout, sb, USERID: user}}>

        {user != null ?

          <Stack.Navigator>

            <Stack.Screen
              name="DiscoverTabs"
              component={DiscoverTab}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
            />

            <Stack.Screen
              name="ProfileTabs"
              component={ProfileTab}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
            />

            <Stack.Screen
              name="MessageTabs"
              component={MessageTab}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
            />


            <Stack.Screen
              name="DiscoverSearch"
              component={DiscoverSearchScreen}
              options={{ headerShown: false, cardStyleInterpolator: forFade }}
              sharedElements={(route, otherRoute, showing) => {
                return ["searchBox"];
              }}
            />
            <Stack.Screen name="PropertyDetail"
              component={PropertyDetailScreen}
              options={{ headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, }}
              sharedElements={(route, otherRoute, showing) => {
                return ["0", "view"];
              }}
            />
            <Stack.Screen name="PropertyPosting"
              component={PropertyPostingScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
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

    

            <Stack.Screen name="Chat"
              component={ChatScreen}
              options={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
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

            {/* Messaging */}
            {/* <Stack.Screen name="Lobby" component={Lobby} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Member" component={Member} />
        <Stack.Screen name="Invite" component={Invite} /> 
        <Stack.Screen name="Profile" component={Invite} /> */}





          </Stack.Navigator>
          :

          <Stack.Navigator initialRouteName='Landing'>


            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}

              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FirstLastName" component={FirstLastNameScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Age" component={AgeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfilePic" component={ProfilePicScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Occupation" component={OccupationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="School" component={SchoolScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Email" component={EmailScreen} options={{ headerShown: false }} />
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
        }


      </UserContext.Provider>
    </NavigationContainer>

  )
}