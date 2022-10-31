import * as React  from 'react';
import { createBottomTabNavigator,  } from '@react-navigation/bottom-tabs';
import DiscoverScreen from './discover';
import MessageScreen from '../Message/message.js'
import ProfileScreen from '../Profile/profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROBOTOFONTFAMILY, PRIMARYCOLOR, FAGetBottomIcons } from '../../../sharedUtils';
Ionicons.loadFont()

const Tab = createBottomTabNavigator();



export default function DiscoverTab(){
    return(

    <Tab.Navigator 
        
        screenOptions={({ route }) => ({
          lazy: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Discover') {
              iconName = focused
                ? 'Discover'
                : 'Discover';
              color = 'PRIMARYCOLOR'
            } else if (route.name === 'Message') {
              iconName = focused ? 'Message' : 'Message';
              color = PRIMARYCOLOR
            }
            else if (route.name === 'Profile') {
              iconName = focused ? 'Profile' : 'Profile';
              color = PRIMARYCOLOR
            }

            // You can return any component that you like here!
            return FAGetBottomIcons(iconName);
          },
          tabBarLabelStyle:{
            fontFamily: ROBOTOFONTFAMILY,
            fontWeight: '500',
            color: PRIMARYCOLOR
          },
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