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

import { createBottomTabNavigator,  } from '@react-navigation/bottom-tabs';

import { FAGetBottomIcons, PRIMARYCOLOR, ROBOTOFONTFAMILY } from '../../../sharedUtils';
import DiscoverScreen from '../Discover/discover';
import MessageScreen from '../Message/message.js';
import ProfileScreen from '../Profile/profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


const Tab = createBottomTabNavigator();

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export default function ProfileTab(){

    return(

      <Tab.Navigator 
        screenOptions={({ route }) => ({
          lazy: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Discover') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            
            } else if (route.name === 'Message') {
              iconName = focused ? 'mail' : 'mail-outline';
            }
            else if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={30} color={PRIMARYCOLOR} />;
          },
          tabBarShowLabel: false,
          headerShown: false,
          
        })}
      >
        
        <Tab.Screen name="Discover" component={DiscoverScreen} 
        options={({ route }) => ({
          tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
  
              if(routeName == "Discover"){
                return "flex";
              }
              else{
                return "none";
              }
         
          })})}/>
        <Tab.Screen name="Message" component={MessageScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    
    )
     
}