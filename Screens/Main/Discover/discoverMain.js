import * as React  from 'react';
import { createBottomTabNavigator,  } from '@react-navigation/bottom-tabs';
import DiscoverScreen from './discover';
import MessageScreen from '../Message/message.js'
import ProfileScreen from '../Profile/profile';
import CribConnectScreen from '../Premium/CribConnectScreen'
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARYCOLOR } from '../../../sharedUtils';
import { UserContext } from '../../../UserContext';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

const Tab = createBottomTabNavigator();



export default function DiscoverTab({navigation, route}){
const [numOfSubtenants, setNumOfSubtenants] = React.useState(0)

  React.useEffect(()=>{
    getTokens()
  },[])

  async function getTokens(){
       
    const accessToken = await EncryptedStorage.getItem("accessToken");
    let USERID = await EncryptedStorage.getItem("userId")

    
  
    if(accessToken != undefined && USERID != undefined && accessToken != null){

        await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
          if(userData.cribConnectSubtenants != undefined){
            setNumOfSubtenants(userData.cribConnectSubtenants.length)
          }
        })
        .catch(e=>{
          console.log("Error")
        })
    } 


    
}

  // console.log(route.params.LastSearched)
    return(

    <Tab.Navigator 
        
        screenOptions={({ route }) => ({
          lazy: false,
        
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Discover') {
              iconName = focused
                ? 'search'
                : 'search-outline';
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
          tabBarBadge: route.name == "Connect" && numOfSubtenants != 0 ? numOfSubtenants : null
          
        })}
      >
        
        <Tab.Screen name="Discover" component={DiscoverScreen}
        initialParams={{ LastSearchedLocation:  route?.params?.LastSearchedLocation == undefined ? undefined :  route.params.LastSearchedLocation, LastSearched: route?.params?.LastSearched == undefined ? [40.730610, -73.935242] : [route.params.LastSearched.split(",")[0],route.params.LastSearched.split(",")[1]]}}
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