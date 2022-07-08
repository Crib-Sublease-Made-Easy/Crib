import * as React  from 'react';
import { useState, useContext, createContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions
} from 'react-native';


const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

//User Context
import { UserContext } from './UserContext.js';

//Screens
import LandingScreen from './Screens/Onboarding/Landing/landing.js';
import LoginScreen from './Screens/Onboarding/login.js';
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

//Navigation between tabs
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CardStyleInterpolators } from '@react-navigation/stack';



const Stack = createSharedElementStackNavigator();

const PRIMARYCOLOR = '#4050B5'

export default function App () {

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
    <UserContext.Provider value={{user, login, logout}}>
    
    { user == null ?
   
      <Stack.Navigator>
        
        <Stack.Screen
          name="DiscoverTabs"
          component={DiscoverTab}
          options={{headerShown: false, cardStyleInterpolator: forFade}}
        />
        <Stack.Screen
          name="DiscoverSearch"
          component={DiscoverSearchScreen}
          options={{headerShown: false, cardStyleInterpolator: forFade}}
          sharedElements={(route, otherRoute, showing) => {
            return ["searchBox"];
          }}
        />
        <Stack.Screen name="PropertyDetail" 
        component={PropertyDetailScreen} 
        options={{ headerShown: false, cardStyleInterpolator: forFade, }}
        sharedElements={(route, otherRoute, showing) => {
          return ["0", "view"];
        }}
        />
        {/* <Stack.Screen name="PropertyPosting" 
        component={PropertyPostingScreen} 
        options={{ headerShown: false, presentation:'transparentModal', 
        cardStyleInterpolator:CardStyleInterpolators.forVerticalIOS }}
        /> */}

        <Stack.Screen name="PropertyFilter" 
        component={DiscoverFilterScreen} 
        options={{ headerShown: false, presentation:'transparentModal', 
        cardStyleInterpolator:CardStyleInterpolators.forVerticalIOS }}
        />


      </Stack.Navigator>
      :
      
      <Stack.Navigator initialRouteName='Landing'>
        <Stack.Screen name="Landing"   component={LandingScreen} options={{headerShown: false}}/>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          
          options={{headerShown: false, animation:'slide_from_right'}}
        />
        <Stack.Screen name="Signup"  component={SignupScreen} options={{headerShown: false}}/>
        <Stack.Screen name="FirstLastName"  component={FirstLastNameScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Age"  component={AgeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Gender"  component={GenderScreen} options={{headerShown: false}}/>
        <Stack.Screen name="ProfilePic"  component={ProfilePicScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Occupation"  component={OccupationScreen} options={{headerShown: false}}/>
        <Stack.Screen name="School"  component={SchoolScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Email"  component={EmailScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Password"  component={PasswordScreen} options={{headerShown: false}}/>
        <Stack.Screen name="PhoneNumber"  component={PhoneNumberScreen} options={{headerShown: false}}/>



        <Stack.Screen name="EmailPassword" component={EmailPasswordScreen} options={{headerShown: false}}/>
        <Stack.Screen name="otp" component={OTPScreen} options={{headerShown: false}}/>
        
      </Stack.Navigator>
    }
    
    </UserContext.Provider>
    </NavigationContainer>
   
  )
}