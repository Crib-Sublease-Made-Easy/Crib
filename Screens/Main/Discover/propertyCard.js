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
    FlatList
    
  } from 'react-native';

import FastImage from 'react-native-fast-image'


import styled from 'styled-components/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated, {useAnimatedStyle, useSharedValue, withSpring, runOnJS, FadeIn, Layout,  FadeInUp, SlideInLeft, Easing, interpolate,} from 'react-native-reanimated';

import {Gesture, GestureDetector, TouchableOpacity,  } from 'react-native-gesture-handler';

import Lottie from 'lottie-react-native';


import { HEIGHT, WIDTH, MEDIUMGREY, LIGHTGREY, DARKGREY, EXTRALIGHT, PRIMARYCOLOR } from '../../../sharedUtils';


const CardContainer = styled(Pressable)`
width: ${WIDTH*0.9}px
height: ${WIDTH}px
align-self: center;
border-radius: 15px;
`


const PropertyInfoContainer = styled.View`
  width: ${WIDTH*0.9}px;
  height: ${WIDTH*0.2}px;
  padding-top: ${HEIGHT*0.01}px
  align-self: center
  justify-content: space-around
  
`

const LocationAndPrice = styled.View`
  flexDirection: row;
  width: 100%;
  justifyContent: space-between
`

const LocationFont = styled.Text`
  font-size: ${HEIGHT*0.017}px;
  font-weight: 600;
  color: black
`
const DateFont = styled.Text`
font-size: ${HEIGHT*0.0155}px;
font-weight: 400;
color: black  
`

const DatePriceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: ${WIDTH*0.9}px
  align-items: center
`
const BedBathNumberText = styled.Text`
  font-size: ${HEIGHT*0.0155}px;
  font-weight: 400;
  color: black
`

const PriceFont = styled.Text`
  max-width: ${WIDTH*0.3}px
  justify-content: center;
  font-size: ${HEIGHT*0.0175}px;
  color: black
  font-weight: 600;
`

const PropertyImageContainer = styled.View`
  position: relative;
  border-radius:25px
`

const OpenMapIconContainer = styled.Pressable`
  height: ${HEIGHT*0.06}px;
  width: ${HEIGHT*0.06}px;
  border-radius: ${HEIGHT*0.03}px;
  background-color: rgba(0,0,0,0.8);
  bottom: ${HEIGHT*0.02}px;
  right: ${WIDTH*0.05}px;
  position: absolute;
  justify-content:center;
  align-items: center
`

const DragGreyLineContainer = styled.View`
  height: ${HEIGHT*0.07}px
  width: ${WIDTH}px;
  align-items: center
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  justify-content: center
  background-color: white
`  
// const DragGreyLine = styled.View`
//   height: ${HEIGHT*0.004}px;
//   width: ${WIDTH*0.25}px;
//   border-radius: 15px;
//   background-color: ${MEDIUMGREY}
// `

const TopBarSlider = styled.View`
  width: ${WIDTH}px
  justify-content: center
  align-items: center
  height: ${HEIGHT*0.07}px
  shadow-color: ${LIGHTGREY} 
  shadow-offset: 0 ${HEIGHT*0.01}px
  shadowRadius: 5px
  shadowOpacity: 0.2
  backgroundColor: white
  border-top-left-radius: 25px
  border-top-right-radius: 25px
`


const DefaultPostFavText = styled.Text`
    color: ${DARKGREY};
    font-weight: 700
    font-size: ${HEIGHT*0.015}px;
    width: ${WIDTH*0.6}px
    text-align: center
`
const NumberOfPropertiesText = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 600
  color: black
`


export default function PropertyCard({navigation, setSelectedPin, loadMoreProperties,
    filteredPropertiesData, flatlistRefreshing, length, moveMap, openPreviewCard, userId,
    searching, currentLocation, loading, 
   
}){
    const flatListItemOpacity = useRef(new RNAnimated.Value(0)).current;
    const flatlistRef = useRef();
    const [previewing, setPreviewing] = useState(false)
   
    // const [propertiesData, setPropertiesData] = useState([]);

    useEffect(()=>{
     
      if(searching){
        translateY.value = withSpring(HEIGHT*0.68, {stiffness: 70, mass: 0.3, damping:15})
      }
      if(flatlistRefreshing){
        translateY.value = withSpring(0, {stiffness: 50, mass: 0.3, damping:15})
       
        // flatlistRef.current.scrollToIndex({index:0})
        ScrollToTop();
      }
     
    }, [searching, flatlistRefreshing,])

    function ScrollToTop(){
      flatlistRef?.current?.scrollToIndex({index: 0, animated:true})
    }

    // Swipable Bottom Sheet
    const translateY = useSharedValue(0)
    const velocityY = useSharedValue(0)

    const context = useSharedValue({y:0})

    const gesture = Gesture.Pan().onStart(()=>{
    
    context.value = {y: translateY.value}
    }).onUpdate((event)=>{
    translateY.value = event.translationY + context.value.y
    
    translateY.value = Math.max(translateY.value, 0);

    velocityY.value = event.velocityY;

   
    }).onEnd(()=>{
    //console.log(velocityY.value)
    if(translateY.value  < HEIGHT*0.3){
      if(Math.abs(velocityY.value) > 500){
        translateY.value = withSpring(HEIGHT*0.68, {stiffness: 70, mass: 0.3, damping:10})
      }
      else{
        translateY.value = withSpring(0, {stiffness: 50, mass: 0.3, damping:15})
      }       
    }
    else{
      if(Math.abs(velocityY.value) > 1000){
        translateY.value = withSpring(0, {stiffness: 70, mass: 0.3, damping:10})
      }
      else{
        translateY.value = withSpring(HEIGHT*0.68, {stiffness: 70, mass: 0.3, damping:15})
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
        moveMap(pinInfo.propertyInfo.loc.coordinates[1] - 0.0005,pinInfo.propertyInfo.loc.coordinates[0], true)
        translateY.value = withSpring(HEIGHT*0.68, {stiffness: 50, mass: 0.3, damping:15})
    }

    const renderCards = (data, index) =>{
      return(
        <RNAnimated.View 
        style={{opacity: flatListItemOpacity.interpolate({
          inputRange:[0,1],
          outputRange:[0,1]
        })}}>
          <CardContainer
          onPress={()=> navigation.navigate('PropertyDetail', {data: data.item, uid: userId, incrementViewCount : true, distance: Math.round(getDistanceFromLatLonInMiles(currentLocation[0],currentLocation[1],data.item.propertyInfo.loc.coordinates[1], data.item.propertyInfo.loc.coordinates[0])), currentLocation: currentLocation, scraped: data.item.propertyInfo.postedBy == null ? true : false})} >
              
            <PropertyImageContainer>
              <FastImage  
              source={{
                uri: data.item.propertyInfo.imgList[0],
                priority: FastImage.priority.high,
              }}  
              style={{width:WIDTH*0.9, height:WIDTH*0.8, borderRadius:15, backgroundColor:LIGHTGREY,
              opacity: 1,
              }}
              />
              
              <OpenMapIconContainer hitSlop={WIDTH*0.025} onPress={()=>{MoveMapToPin(data.item)}}>
                  <FontAwesome name='location-arrow' size={20} color='white'/>
              </OpenMapIconContainer>
            </PropertyImageContainer>
              
            <PropertyInfoContainer>
              <LocationFont numberOfLines={1}>{data.item.propertyInfo.type} in {data.item.propertyInfo.loc.secondaryTxt}</LocationFont>
              <DatePriceContainer>
                <BedBathNumberText numberOfLines={1}>{data.item.propertyInfo.bed} Bed   {data.item.propertyInfo.bath} Bath</BedBathNumberText>
              </DatePriceContainer>
              
              <DatePriceContainer>
                <DateFont numberOfLines={1}>
                  {
                  // "Flexible  " +   
                  new Date(data.item.propertyInfo.availableFrom).toDateString().split(" ")[1] + " " +
                  new Date(data.item.propertyInfo.availableFrom).toDateString().split(" ")[2] + " " +
                  new Date(data.item.propertyInfo.availableFrom).getFullYear()
                  }  -  {
                  new Date(data.item.propertyInfo.availableTo).toDateString().split(" ")[1] + " " +
                  new Date(data.item.propertyInfo.availableTo).toDateString().split(" ")[2] + " " +
                  new Date(data.item.propertyInfo.availableTo).getFullYear()
                  }
                </DateFont>
                <PriceFont numberOfLines={1}>${data.item.propertyInfo.price} / month</PriceFont>

              </DatePriceContainer>
            </PropertyInfoContainer>   
            
          </CardContainer>
        </RNAnimated.View>
      )
    }

    
  return(
    
  <GestureDetector  gesture={gesture}>
    
      <Animated.View
        style={[bottomSheetStyle,{width: WIDTH, height: HEIGHT*0.75,  position:'absolute', bottom: 0, alignItems:'center', borderTopLeftRadius:25, 
        borderTopRightRadius:25,backgroundColor: 'white',
        shadowColor: 'black', shadowRadius: 15,shadowOffset: {width: 0, height: 0},  shadowOpacity: 0.2, elevation: 5, alignSelf:'baseline'
      }]}>
        <DragGreyLineContainer>
          <NumberOfPropertiesText>
            {length} Subleases found
          </NumberOfPropertiesText>
        </DragGreyLineContainer>
        {/* {flatlistRefreshing ?
        <ActivityIndicator size="large" color= {PRIMARYCOLOR} style={{marginTop: HEIGHT*0.1}} />
        : */
        filteredPropertiesData.length != 0 && filteredPropertiesData != undefined ?
        
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
  )
}