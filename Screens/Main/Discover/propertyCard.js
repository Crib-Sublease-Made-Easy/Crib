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
    Aniamted as RNAnimated
  } from 'react-native';

import styled from 'styled-components/native';
import { Image as RneImage } from "@rneui/themed";
import { SharedElement } from 'react-navigation-shared-element';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

//Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import Animated, {useAnimatedStyle, useSharedValue, withSpring, runOnJS, FadeIn, Layout,  FadeInUp, SlideInLeft, Easing,} from 'react-native-reanimated';

import { FlatList, Gesture, GestureDetector, TouchableOpacity,  } from 'react-native-gesture-handler';

const PRIMARYCOLOR = '#4050B5'
const TEXTGREY = '#969696'

import { HEIGHT, WIDTH, MEDIUMGREY, LIGHTGREY, DARKGREY, TEXTINPUTBORDERCOLOR } from '../../../sharedUtils';
import { ease } from 'react-native/Libraries/Animated/Easing';


// const CardContainer = styled.Pressable`
//     width: ${WIDTH*0.9}px;
//     height: ${HEIGHT*0.375}px;
//     align-self: center;
//     border-radius: 15px;
//     padding-top: ${HEIGHT*0.01}px;
//     padding-bottom: ${HEIGHT*0.01}px;
// `
const CardContainer = {width: WIDTH*0.9,  alignSelf: 'center', borderRadius: 15, paddingVertical: HEIGHT*0.01 ,  };

const PropertyInfoContainer = styled.View`
  width: ${WIDTH*0.875}px;
  height: ${HEIGHT*0.1}px
  justify-content:space-around
  align-self: center
  padding-top: ${HEIGHT*0.01}px;
  padding-left: ${WIDTH*0.025}px
  
  
`

const LocationFont = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 500;
  width: 100%
  
`
const PropertyInfoContainerLeft = styled.View`
    width: ${WIDTH*0.6}px;
    justify-content: space-around
`

const PropertyInfoContainerRight = styled.View`
    width: ${WIDTH*0.3}px;
    justify-content: flex-end;
`
const DateFont = styled.Text`
    margin-top: ${HEIGHT*0.0025}px;
    font-size: ${HEIGHT*0.015}px;
    font-weight: 400;
    color: black
   
`
const PriceFont = styled.Text`
  justify-content: center;
  font-size: ${HEIGHT*0.0175}px;
  color: black
  font-weight: 400;
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
const FavIconContainer = styled.Pressable`
  height: ${HEIGHT*0.05}px;
  width: ${HEIGHT*0.05}px;
  border-radius: ${HEIGHT*0.025}px;
  background-color: rgba(0,0,0,0.8);
  bottom: ${HEIGHT*0.02}px;
  left: ${WIDTH*0.05}px;
  position: absolute;
  justify-content:center;
  align-items: center
`

const DragGreyLineContainer = styled.View`
  
  width: ${WIDTH}px;
  align-items: center
  padding-top: ${HEIGHT*0.02}px;
`  
const DragGreyLine = styled.View`
  height: ${HEIGHT*0.004}px;
  width: ${WIDTH*0.3}px;
  border-radius: 15px;
  background-color: ${TEXTINPUTBORDERCOLOR}
`

const PropertiesLength = styled.Text`
  font-size: ${HEIGHT*0.015}px;
  font-weight: 500
  padding-vertical: ${HEIGHT*0.015}px
`

export default function PropertyCard({navigation, setSelectedPin, loadMoreProperties,
    filteredPropertiesData, markerClickIndex, flatlistRefreshing, currentLocation,
    onMarkerClick, length, moveMap, openPreviewCard
}){
    // console.log("hi")
    // console.log(filteredPropertiesData)
    const flatlistRef = useRef(0);
    const [previewing, setPreviewing] = useState(false)
    // const [propertiesData, setPropertiesData] = useState([]);
    const [propertyPage, setPropertyPage] = useState(0);
    const ImageOpacity = useRef(new Animated.Value(1)).current;
    useEffect(()=>{
       console.log("UseEffect Refreshing...")
    //    loadProperty()
        // console.log(propertiesData)
        translateY.value = withSpring(HEIGHT/40, {stiffness: 50, mass: 0.3, damping:15})

    }, [])

    // Swipable Bottom Sheet
    const translateY = useSharedValue(0)

    function enableFlatlistScroll(arg){
        setPreviewing(arg);
    }


    const context = useSharedValue({y:0})

    const gesture = Gesture.Pan().onStart(()=>{
    
    context.value = {y: translateY.value}
    }).onUpdate((event)=>{
    translateY.value = event.translationY + context.value.y
    
    translateY.value = Math.max(translateY.value, HEIGHT/40);
   
    }).onEnd(()=>{
    //console.log(translateY.value)
    if(translateY.value  < HEIGHT/1.59 ){
        translateY.value = withSpring(HEIGHT/40, {stiffness: 50, mass: 0.3, damping:15})
        runOnJS(enableFlatlistScroll)(false)
    }

    if (translateY.value  > HEIGHT/6.69 ){
        translateY.value = withSpring(HEIGHT/1.4, {stiffness: 50, mass: 0.3, damping:15})
        runOnJS(enableFlatlistScroll)(true)
    }
    })
    
    
    const bottomSheetStyle = useAnimatedStyle(()=>{
        return{
            transform:[{translateY: translateY.value}]
        }
    })

    function MoveMapToPin(id){
        console.log(id)
        fetch(`https://sublease-app.herokuapp.com/properties/${id}`, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
            }
            }) 
            .then(res => res.json()).then( pinInfo =>{
                console.log("onMarkerClick")
                console.log("The clicker pin info")
                //console.log(pinInfo)
                console.log("==========================================================")
                console.log(pinInfo.propertyInfo)
                setSelectedPin(pinInfo.propertyInfo)
                openPreviewCard()
                moveMap(pinInfo.propertyInfo.loc.coordinates[1] - 0.015,pinInfo.propertyInfo.loc.coordinates[0])

            })
            .catch(e=>{
                alert(e)
        })
        translateY.value = withSpring(HEIGHT/1.4, {stiffness: 50, mass: 0.3, damping:15})
    }

    const renderCards = useCallback((data, index) =>{
       // console.log("HELLO")
        console.log("DATA ITEM", data.item)

        return(
            <Pressable 
            style={CardContainer}  onPress={()=> navigation.navigate('PropertyDetail', {data: data.item})} >
                {/* <SharedElement id="0"> */}
                    <PropertyImageContainer>
                        <Animated.Image  
                        style={{width:WIDTH*0.9, height:WIDTH*0.6, borderRadius:15, backgroundColor:LIGHTGREY,
                        opacity: 1
                        }} source={{uri:data.item.propertyInfo.imgList[0]}}/>
                        {/* <OpenMapIconContainer onPress={()=>MoveMapToPin(data)}> */}
                        <OpenMapIconContainer onPress={()=>MoveMapToPin(data.item._id)}>
                            <FontAwesome name='location-arrow' size={HEIGHT*0.02} color='white'/>
                        </OpenMapIconContainer>
                        {/* <FavIconContainer >
                            <Ionicons name="heart" size={20} color='white'/>
                        </FavIconContainer> */}
                    </PropertyImageContainer>
                {/* </SharedElement> */}
                <PropertyInfoContainer>
                   
                        <LocationFont>{data.item.propertyInfo.loc.streetAddr}</LocationFont>
                        <DateFont>{new Date(data.item.propertyInfo.availableFrom).toDateString()} - { new Date(data.item.propertyInfo.availableTo).toDateString()}</DateFont>
                       
                   
                   
                        <PriceFont><Text style={{fontWeight:'700'}}>${data.item.propertyInfo.price}</Text>/month</PriceFont>
                    
                </PropertyInfoContainer>   
                <SharedElement id="view">
                    <View style={{backgroundColor:'white'}}></View>
                </SharedElement>
            </Pressable>
        )
    })

    
    return(
    <View  style={{flex:1}}>
        
    <GestureDetector  gesture={gesture}>
    
      <Animated.View
        style={[bottomSheetStyle,{width: WIDTH, height: HEIGHT*0.76, alignItems:'center', borderTopLeftRadius:25, 
        borderTopRightRadius:25,backgroundColor: 'white',
        shadowColor: 'black', shadowRadius: 15,shadowOffset: {width: 0, height: 0},  shadowOpacity: 0.2, elevation: 5,
      }]}>
        <DragGreyLineContainer>
          <DragGreyLine></DragGreyLine>
          <PropertiesLength>{length} properties found</PropertiesLength>
        </DragGreyLineContainer>
        {flatlistRefreshing ?
        <ActivityIndicator size="large" color= {PRIMARYCOLOR} style={{marginTop: HEIGHT*0.1}} />
        :
        <FlatList
        onEndReachedThreshold = {0.5}
       
        onEndReached={()=>{
            console.log("loading more data")
            loadMoreProperties()
        }
        }
        bounces = {true}
        style={{paddingBottom: HEIGHT*0.1}}
        scrollEnabled={!previewing}
        showsVerticalScrollIndicator={false}
        ref={flatlistRef}
        data = {filteredPropertiesData}
       
        // key={propertiesData}
        keyExtractor={(item, index) => String(index)}
        renderItem={(item, index)=>renderCards(item, index)}
        />
        }   
        </Animated.View>
    
   </GestureDetector>
   </View>
    )
}