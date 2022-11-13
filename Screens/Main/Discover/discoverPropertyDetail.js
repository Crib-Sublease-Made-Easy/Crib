import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    Animated as RNAnimated,
    SafeAreaView,
    Pressable
} from 'react-native';

import FastImage from 'react-native-fast-image'

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView , { Marker,PROVIDER_GOOGLE }from 'react-native-maps';

import {UserContext} from '../../../UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import Lottie from 'lottie-react-native';


import {PropertyDescription, Section, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, CardSectionTwo, InfoHeaderText,
            InfoContainer, InfoText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
           DateContainer, DateText,DescriptionText, AmenitiesText, TypeText, BedContainer,
           BedTopContainer, BedNumberText, BedroomNameText, TenantNameText, InfoHeaderTextAndCenter,
           StickyHeaderContainer,  StickyHeaderIcon,  TypeLocationFavoriteContainer,
           TypeLocationContainer,FavoriteContainer, BedBathDateContainer, BedBathText, DistanceText, RowContainer, ShowOnMapPressable, ShowOnMapText, TenantInformationContainer, TenantProfileImageContainr, TenantNameScollOccupationContainer, Subheading, AmenitiesContainer } from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import { LIGHTGREY , GetAmenitiesIcon, PRIMARYCOLOR, GetFAIconsInBlack, HEIGHT, WIDTH} from '../../../sharedUtils';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBath, faBed, faEye, faFire, faFireFlameCurved, faFireFlameSimple } from '@fortawesome/free-solid-svg-icons';

import DropdownAlert from 'react-native-dropdownalert';

export default function PropertyDetailScreen({navigation, route}){
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            onChat = false 
        });
   
        fetchProperties()
        getTokens()
      
      return unsubscribe
    }, [])
    
    let dropDownAlertRef = useRef();
    const flatListRef = useRef(null)
    const [propData, setPropData] = useState(route.params.data.propertyInfo);
    const postedUserData = route.params.data.userInfo;
    const {sb, USERID} = useContext(UserContext);
    const [flatlistIndex, setFlatlistIndex] = useState(0)
    const [liked, setLiked]  = useState()
    const [ownProperty, setOwnProperty] = useState(route.params.data.propertyInfo.postedBy == USERID)


    
    const createConversation = async () =>{


        //Check if the user is signed in or not
        const rt  = EncryptedStorage.getItem("refressToken");

        if(rt != null){

            var userIds = [USERID, propData.postedBy]
            sb.GroupChannel.createChannelWithUserIds(userIds, true, propData.loc.streetAddr, propData.imgList[0], propData._id, function(groupChannel, error) {
                if (error) {
                    // Handle error.
                    console.log(error)
                    alert("You are currently engaged in a conversation with this user")
                } else {
                    console.log("Channel Created Successfully")
                    //console.log(groupChannel)
                    // A group channel with additional information is successfully created.
                    var channelUrl = groupChannel.url;
                    navigation.navigate("Chat", {url:channelUrl, id: USERID, postedBy:postedUserData.firstName})
                }
            });
        }
        else{
            alert("Sign in to contact tenant.");
            navigation.navigate("Landing")
        }
    }

    async function getTokens(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        if (USERID != null && accessToken != null){
            fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                if(userData.favoriteProperties?.indexOf(route.params.data.propertyInfo._id) == -1){
                    setLiked(false)
                }
                else{
                    setLiked(true)
                }
            })
            .catch(e=>{
                dropDownAlertRef.alertWithType('error', 'Authentication Error', "Please try again later.");
            })
        }   
    }

    async function fetchProperties(){
        const accessToken = await EncryptedStorage.getItem("accessToken");
        if(route.params.data != undefined && accessToken != null){
            await fetch('https://crib-llc.herokuapp.com/properties/' + route.params.data.propertyInfo._id, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            },
            body:JSON.stringify({
                viewCount: route.params.incrementViewCount ? "true" : "false"
            })
            
            
            }) 
            .then(res => res.json()).then( async propertyData =>{
                if(propertyData.propertyInfo.deleted){
                    await fetch('https://crib-llc.herokuapp.com/properties/favorite', {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + accessToken,
                        },
                        body: JSON.stringify({
                            propertyId: route.params.data.propertyInfo._id,
                        })
                        }) 
                        .catch(e=>{
                            dropDownAlertRef.alertWithType('error', 'Error', "Please try again later.");
                    })
                    alert("Post deleted.")
                    navigation.goBack()
                }
            })
            .catch(e=>{
                dropDownAlertRef.alertWithType('error', 'Error', "Please try again later.");
            })
        }
        
    }


    const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setFlatlistIndex(roundIndex)
    }, []);

    async function likeProperty(){

        const refreshToken = await EncryptedStorage.getItem("refreshToken");

        if(refreshToken != undefined){
            
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != null){
                await fetch('https://crib-llc.herokuapp.com/properties/favorite', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + accessToken,
                },
                body: JSON.stringify({
                    propertyId: route.params.data.propertyInfo._id,
                })
                }) 
                .then(res => res.json()).then(async message =>{
                    // console.log(message)
                    await AsyncStorage.removeItem("favoriteProperties");
                    setLiked(!liked)
                })
                .catch(e=>{
                    dropDownAlertRef.alertWithType('error', 'Error favoriting property', "Please try again later.");
                })
            }
        }
        else{
            alert("Sign in to like properties.");
            navigation.navigate("Landing")
        }
        
    }

 
    function getMapView(lat1,lon1,lat2,lon2) {
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
        return ((d+1) * 0.621371) / 69 ; //km to miles
      }
      
      function deg2rad(deg) {
        return deg * (Math.PI/180)
      }

    return(
       <SafeAreaView style={{ backgroundColor:'white', flex: 1}}>
            
    
        <ScrollView 
        showsVerticalScrollIndicator={false} 
        bouncesZoom={1}
        scrollEventThrottle={5}
        style={{backgroundColor:'white'}}
        >
            <Lottie source={require('../../../ImageLoading.json')} autoPlay   style={{width:WIDTH, height: WIDTH*0.3, position:'absolute', marginTop: HEIGHT*0.025}}/>

            {/* Property image slider container */}
            <View style={{height:HEIGHT*0.35, width:WIDTH}}>
                <FlatList 
                    onScroll={onScroll}
                    horizontal 
                    snapToAlignment="center"
                    decelerationRate={"fast"}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    snapToInterval={WIDTH}
                    style={{position:'absolute', width:WIDTH, height:HEIGHT*0.35, overflow:'hidden'}}
                    data={route.params.data.propertyInfo.imgList}
                    ref={flatListRef}
                    renderItem={({item})=>(
                        
                        <View style={{width:WIDTH, height:HEIGHT*0.35,justifyContent:'center'}}>
                            <FastImage 
                            source={{
                                uri: item,
                                priority: FastImage.priority.high,
                            }} 
                            style={{width:'100%', height:'100%', 
                            }}/>
                        </View>
                    )}
                />
                                
                {/* Property image page indicator */}
                <View style={{width: WIDTH, height: HEIGHT*0.02, position:'absolute', bottom:HEIGHT*0.03, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    {propData.imgList.map((data, index)=>(
                        <View key={"img"+ index} style={{marginLeft:WIDTH*0.02, marginRight:WIDTH*0.02, height:HEIGHT*0.012, width:HEIGHT*0.012, 
                        borderRadius:HEIGHT*0.006,backgroundColor: flatlistIndex == index ? PRIMARYCOLOR : 'white' }}>
                        </View>
                    ))}
                </View>                        
            </View>
            
            {/* This section includes the type, location, bed, bath, date and description */}
            <Section>
                {/* This is the container that contains type, location and the favorite button */}
                <TypeLocationFavoriteContainer>
                    <TypeLocationContainer>
                        <CardTitle>{propData.type} for rent</CardTitle>
                        <LocationText>{propData.loc.secondaryTxt}  •  UW - Madison</LocationText>
                    </TypeLocationContainer>

                    <FavoriteContainer>
                        <Ionicons  name="heart" size={30} color={ liked ? '#ee88a6' : LIGHTGREY}/>
                    </FavoriteContainer>
                </TypeLocationFavoriteContainer>
                
                {/* Container that contains the bed and bath count also the date */}
                <BedBathDateContainer>
                    <BedBathText>{propData.bed} Bed  •  {propData.bath} Bath</BedBathText>
                    <BedBathText>
                        {new Date(propData.availableFrom).toDateString().split(" ")[1]} {new Date(propData.availableFrom).toDateString().split(" ")[3] + "  "} -  
                        {"  " + new Date(propData.availableTo).toDateString().split(" ")[1]} {new Date(propData.availableTo).toDateString().split(" ")[3]}
                    </BedBathText>
                </BedBathDateContainer>

                <DescriptionText>{propData.description}</DescriptionText>
            </Section>   
                 
                    {/* {route.params.distance != undefined &&
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',  width: WIDTH*0.2}}>   
                        {GetFAIconsInBlack("Map")}
                        <TypeText style={{color:'black', fontWeight: '500',}}>{route.params.distance} miles</TypeText>
                    </View>
                    } */}
            
            {/* This section shows the distance from searched location and the show on map pressable */}
            <Section>  
                <RowContainer>
                    <DistanceText><DistanceText style={{color: PRIMARYCOLOR}}>3 miles</DistanceText> from search location</DistanceText>
                    <ShowOnMapPressable>
                        <ShowOnMapText>
                            Show on map
                        </ShowOnMapText>
                    </ShowOnMapPressable>
                </RowContainer>
            </Section>

            {/* This is the tenant information. Seperated to left and right */}
            <Section>
                <Subheading>Tenant Information:</Subheading>
                <TenantInformationContainer>
                    <TenantProfileImageContainr>
                        <Image source={{uri:postedUserData.profilePic}} style={{height:WIDTH*0.2, width:WIDTH*0.2, borderRadius:WIDTH*0.1, backgroundColor:LIGHTGREY,  }}/>
                    </TenantProfileImageContainr>
                    <TenantNameScollOccupationContainer>
                        <TenantNameText style={{fontWeight: '500'}}>{postedUserData.firstName} {postedUserData.lastName}</TenantNameText>
                        <TenantNameText>{postedUserData.school} </TenantNameText>
                        <TenantNameText>{postedUserData.occupation}</TenantNameText>
                    </TenantNameScollOccupationContainer>
                </TenantInformationContainer>

            </Section>

            <Section>
                <Subheading>Amenities ({propData.amenities.length})</Subheading>
                <AmenitiesContainer>
                    {propData.amenities.length != 0 ? 
                    propData.amenities.map((value)=>(
                    <AmenitiesItem key={value + "detailamen"}>
                        {GetFAIconsInBlack(value)}
                        {/* <AmenitiesText>{value.replaceAll("_"," ")}</AmenitiesText> */}
                        <AmenitiesText>{value.replace("_", " ").replace("_"," ")}</AmenitiesText>
                        
                    </AmenitiesItem>

                    ))
                    :
                    <InfoText>No amenities listed ...</InfoText>
                        
                    }
                </AmenitiesContainer>

            </Section>  
            {/* This is the section for sublease details */}
            <Section>
                <Subheading>Sublease details</Subheading>
                <LocationText>Security </LocationText>
            </Section>      
        </ScrollView>

                <StickyHeaderContainer>
                    < StickyHeaderIcon  hitSlop={WIDTH*0.05} onPress={()=>navigation.goBack()}>
                        <Ionicons  name="arrow-back-outline" size={25} color='white'></Ionicons>
                    </ StickyHeaderIcon>
                    { !ownProperty &&
                    < StickyHeaderIcon hitSlop={WIDTH*0.05} onPress={likeProperty}>
                        <Ionicons  name="heart" size={25} color={ liked ? '#ee88a6' : 'white'}></Ionicons>
                    </ StickyHeaderIcon>
                    }
                    
                </StickyHeaderContainer>
                <Footer>
                    <PricePerMonth>${propData.price} <Text style={{fontSize: HEIGHT*0.025, fontWeight:'500'}}>/ month</Text></PricePerMonth>
                
                    <ContactTanentButton disabled={ownProperty} ownProperty={ownProperty} hitSlop={WIDTH*0.05} onPress={()=>createConversation()}>
                        <Text style={{color:'white', fontWeight:'700'}}>Contact Tenant</Text>
                    </ContactTanentButton>
                </Footer>
          
            
        <DropdownAlert
            ref={(ref) => {
            if (ref) {
                dropDownAlertRef = ref;
            }
            }}
        />
       
        
        </SafeAreaView>
       
        
    )
}