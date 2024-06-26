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

import { PRIMARYCOLOR } from '../../../sharedUtils';
import DiscoverScreen from '../Discover/discover';
import MessageScreen from '../Message/message.js';
import ProfileScreen from '../Profile/profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
import CribConnectScreen from '../Premium/CribConnectScreen';



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
            color = focused ? PRIMARYCOLOR : '#A9A9A9'
          } else if (route.name === 'Message') {
            iconName = focused ? 'mail' : 'mail-outline';
            color = focused ? PRIMARYCOLOR : '#A9A9A9'
          }
          else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            color = focused ? PRIMARYCOLOR : '#A9A9A9'
          }
          else if (route.name === 'Connect') {
            iconName = focused ? 'earth' : 'earth-outline';
            color = focused ? PRIMARYCOLOR : '#A9A9A9'
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarLabel: ({focused, color, size}) => (
          <Text style={{color: focused ? PRIMARYCOLOR : '#A9A9A9', fontSize: 10, fontWeight:'500'}}>{route.name}</Text>
        ),
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
        <Tab.Screen name="Connect" component={CribConnectScreen} />
        <Tab.Screen name="Message" component={MessageScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    
    )
     
}