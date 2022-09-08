import React, {useState, useEffect, useRef, useCallback} from 'react';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Button,
    Keyboard,
    TextInput,
    Image,
    ActivityIndicator,
    Pressable,
    Animated as RNAnimated,
    
  } from 'react-native';

import styled from 'styled-components/native';
import { SharedElement } from 'react-navigation-shared-element';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import Animated, {useAnimatedStyle, useSharedValue, withSpring, runOnJS, FadeIn, Layout,  FadeInUp, SlideInLeft, Easing, interpolate,} from 'react-native-reanimated';

import { FlatList, Gesture, GestureDetector, TouchableOpacity,  } from 'react-native-gesture-handler';

import Lottie from 'lottie-react-native';


const PRIMARYCOLOR = '#4050B5'
const TEXTGREY = '#969696'

import { HEIGHT, WIDTH, MEDIUMGREY, LIGHTGREY, DARKGREY, TEXTINPUTBORDERCOLOR, ROBOTOFONTFAMILY, EXTRALIGHT } from '../../../sharedUtils';
import { SystemMessage } from 'react-native-gifted-chat';

const CardContainer = styled(Pressable)`
  width: ${WIDTH*0.9}px
  align-self: center;
  border-radius: 15px;
  padding-vertical: ${HEIGHT*0.01}px
`


const PropertyInfoContainer = styled.View`
  width: ${WIDTH*0.875}px;
  justify-content:space-around
  align-self: center
  padding-top: ${HEIGHT*0.01}px;
  padding-left: ${WIDTH*0.001}px
  
`

const LocationAndPrice = styled.View`
  flexDirection: row;
  width: 100%;
  justifyContent: space-between
`

const LocationFont = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600;
  max-width: ${WIDTH*0.5}px
  font-family: ${ROBOTOFONTFAMILY}

  
`
const DateFont = styled.Text`
    margin-top: ${HEIGHT*0.01}px;
    font-size: ${HEIGHT*0.0155}px;
    font-weight: 400;
    font-family: ${ROBOTOFONTFAMILY}

  
   
`
const PriceFont = styled.Text`
  max-width: ${WIDTH*0.3}px
  justify-content: center;
  font-size: ${HEIGHT*0.0175}px;
  color: black
  font-weight: 500;
  font-family: ${ROBOTOFONTFAMILY}

`

const PropertyImageContainer = styled.View`
  position: relative;
  border-radius:25px

`

const OpenMapIconContainer = styled.Pressable`
  height: ${HEIGHT*0.05}px;
  width: ${HEIGHT*0.05}px;
  border-radius: ${HEIGHT*0.025}px;
  background-color: rgba(0,0,0,0.8);
  bottom: ${HEIGHT*0.02}px;
  right: ${WIDTH*0.05}px;
  position: absolute;
  justify-content:center;
  align-items: center
`

const DragGreyLineContainer = styled.View`
  
  width: ${WIDTH}px;
  align-items: center
  padding-top: ${HEIGHT*0.015}px;
`  
const DragGreyLine = styled.View`
  height: ${HEIGHT*0.004}px;
  width: ${WIDTH*0.25}px;
  border-radius: 15px;
  background-color: ${MEDIUMGREY}
`

const PropertiesLength = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 500
  color: black
  padding-vertical: ${HEIGHT*0.015}px
`
const DefaultPostFavText = styled.Text`
    color: ${DARKGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
    width: ${WIDTH*0.6}px
    text-align: center
`

export default function PropertyCard({navigation, setSelectedPin, loadMoreProperties,
    filteredPropertiesData, flatlistRefreshing, length, moveMap, openPreviewCard, userId,
    searching, currentLocation, loading
   
}){
    const flatListItemOpacity = useRef(new RNAnimated.Value(0)).current;
    const flatlistRef = useRef(0);
    const [previewing, setPreviewing] = useState(false)
   
    // const [propertiesData, setPropertiesData] = useState([]);

    useEffect(()=>{
     
      if(searching){
        translateY.value = withSpring(HEIGHT*0.67, {stiffness: 70, mass: 0.3, damping:15})
      }
      if(flatlistRefreshing){
        translateY.value = withSpring(-HEIGHT*0.005, {stiffness: 50, mass: 0.3, damping:15})
      }
     
    }, [searching, flatlistRefreshing,])

    // Swipable Bottom Sheet
    const translateY = useSharedValue(0)
    const velocityY = useSharedValue(0)

    const context = useSharedValue({y:0})

    const gesture = Gesture.Pan().onStart(()=>{
    
    context.value = {y: translateY.value}
    }).onUpdate((event)=>{
    translateY.value = event.translationY + context.value.y
    
    translateY.value = Math.max(translateY.value, -HEIGHT*0.005);

    velocityY.value = event.velocityY;

   
    }).onEnd(()=>{
    //console.log(velocityY.value)
    if(translateY.value  < HEIGHT*0.35){
      if(Math.abs(velocityY.value) > 1750){
        translateY.value = withSpring(HEIGHT*0.67, {stiffness: 70, mass: 0.3, damping:10})
      }
      else{
        translateY.value = withSpring(-HEIGHT*0.005, {stiffness: 50, mass: 0.3, damping:15})
      }       
    }
    else{
      if(Math.abs(velocityY.value) > 1750){
        translateY.value = withSpring(-HEIGHT*0.005, {stiffness: 70, mass: 0.3, damping:10})
      }
      else{
        translateY.value = withSpring(HEIGHT*0.67, {stiffness: 70, mass: 0.3, damping:15})
      }
    }


    })
    
    function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d * 0.621371; //km to miles
    }
    
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    function handleFlatlistOpacity(){
      RNAnimated.timing(flatListItemOpacity,{
        toValue: 1,
        delay:200,
        useNativeDriver: true,
        duration:200
        
      }).start()
    }


    const bottomSheetStyle = useAnimatedStyle(()=>{
        return{
            transform:[{translateY: translateY.value}]
        }
    })

    function MoveMapToPin(pinInfo){
   
        setSelectedPin(pinInfo)
        openPreviewCard()
        moveMap(pinInfo.propertyInfo.loc.coordinates[1] - 0.015,pinInfo.propertyInfo.loc.coordinates[0])
        translateY.value = withSpring(HEIGHT*0.67, {stiffness: 50, mass: 0.3, damping:15})
    }

    function toogleCard(){
      console.log(translateY.value)
      if(translateY.value > HEIGHT*0.5){

        translateY.value = withSpring(-HEIGHT*0.005, {stiffness: 50, mass: 0.3, damping:15})
      }
      else{
        translateY.value = withSpring(HEIGHT*0.67, {stiffness: 70, mass: 0.3, damping:15})
      }
    }
  

    const renderCards = (data, index) =>{

        return(
        
          <RNAnimated.View 
          style={{opacity: flatListItemOpacity.interpolate({
            inputRange:[0,1],
            outputRange:[0,1]
          })}}>
            <CardContainer 
            onPress={()=> navigation.navigate('PropertyDetail', {data: data.item, uid: userId, incrementViewCount : true, distance: Math.round(getDistanceFromLatLonInMiles(currentLocation[0],currentLocation[1],data.item.propertyInfo.loc.coordinates[1], data.item.propertyInfo.loc.coordinates[0])), currentLocation: currentLocation})} >
               
              <PropertyImageContainer >
                <Image  
                style={{width:WIDTH*0.9, height:WIDTH*0.6, borderRadius:15, backgroundColor:LIGHTGREY,
                opacity: 1
                }} source={{uri:data.item.propertyInfo.imgList[0]}}/>
                
                  <OpenMapIconContainer onPress={()=>MoveMapToPin(data.item)}>
                      <FontAwesome name='location-arrow' size={HEIGHT*0.02} color='white'/>
                  </OpenMapIconContainer>
              </PropertyImageContainer>
               
                <PropertyInfoContainer>
                   
                  <LocationAndPrice>
                  
                    <LocationFont>{data.item.propertyInfo.loc.secondaryTxt}</LocationFont>
                    
                    <PriceFont>${data.item.propertyInfo.price} / month</PriceFont>
                  </LocationAndPrice>
                  <DateFont>{new Date(data.item.propertyInfo.availableFrom).getDate() + " " +
                            new Date(data.item.propertyInfo.availableFrom).toLocaleString('default', { month: 'short' }) + " " + 
                            new Date(data.item.propertyInfo.availableFrom).getFullYear()
                            }  -  {new Date(data.item.propertyInfo.availableTo).getDate() + " " +
                            new Date(data.item.propertyInfo.availableTo).toLocaleString('default', { month: 'short' })+ " " + 
                            new Date(data.item.propertyInfo.availableTo).getFullYear()}
                            </DateFont>
                          
                  <DateFont>{Math.round(getDistanceFromLatLonInMiles(currentLocation[0],currentLocation[1],data.item.propertyInfo.loc.coordinates[1], data.item.propertyInfo.loc.coordinates[0]))} miles away</DateFont>
            
                </PropertyInfoContainer>   
              
                    <View style={{backgroundColor:'white'}}></View>
              
            </CardContainer>
          </RNAnimated.View>
         
         
        )
    }

    
    return(
    <View  style={{flex:1}}>
      
    <GestureDetector  gesture={gesture}>
    
    
      <Animated.View
        style={[bottomSheetStyle,{width: WIDTH, height: HEIGHT*0.75, alignItems:'center', borderTopLeftRadius:25, 
        borderTopRightRadius:25,backgroundColor: 'white',
        shadowColor: 'black', shadowRadius: 15,shadowOffset: {width: 0, height: 0},  shadowOpacity: 0.2, elevation: 5,
      }]}>
        <DragGreyLineContainer>
          
          <View style={{width: WIDTH, justifyContent:'center', alignItems:'center', height: HEIGHT*0.045, shadowColor:LIGHTGREY, shadowOffset:{width:0, height:HEIGHT*0.01}, shadowRadius: 5, shadowOpacity: 0.2, backgroundColor:'white'}}>
            <Pressable onPress={toogleCard}
            style={{paddingVertical: HEIGHT*0.005, paddingHorizontal: WIDTH*0.05, backgroundColor: EXTRALIGHT, borderRadius:20}}>
              <Ionicons name='map' size={25} color={PRIMARYCOLOR}/>
            </Pressable>
          </View>
        </DragGreyLineContainer>
        {/* {flatlistRefreshing ?
        <ActivityIndicator size="large" color= {PRIMARYCOLOR} style={{marginTop: HEIGHT*0.1}} />
        : */
        filteredPropertiesData.length != 0 ?
       
          <FlatList
          onEndReachedThreshold = {0.4}
          ItemSeparatorComponent={() => {
            return (
              <View style={{width: WIDTH*0.9, height: HEIGHT*0.03}}>

              </View>
            )
          }
            
          }
          onEndReached={()=>{
              loadMoreProperties()
          }
          }
          ListFooterComponent={()=>{
            return(
              <View style={{height:HEIGHT*0.05}}></View>
            )
          }}
          bounces = {true}
          style={{paddingBottom: HEIGHT*0.1}}
          onLayout={handleFlatlistOpacity}
          scrollEnabled={!previewing}
          showsVerticalScrollIndicator={false}
          ref={flatlistRef}
          data = {filteredPropertiesData}
        
          // key={propertiesData}
          keyExtractor={(item, index) => String(index)}
          renderItem={(item, index)=>renderCards(item, index)}
          />
         
          :
          loading ?
          <View>

          </View>
          :
          <View style={{justifyContent:'center', alignItems:'center', marginTop: HEIGHT*0.1}}>
            <Lottie source={require('../../../noProperties.json')} autoPlay loop={false} style={{width:WIDTH*0.6, height: WIDTH*0.4, }}/>
            <DefaultPostFavText>No properties found. Please select a new area or adjust filter options</ DefaultPostFavText>
          </View>
          }   
        </Animated.View>
    
   </GestureDetector>
   </View>
    )
}