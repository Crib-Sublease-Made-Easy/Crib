import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {
    ScrollView,
    Text,
    View,
    Dimensions,
    Image,
    Animated as RNAnimated,
    SafeAreaView
} from 'react-native';

import FastImage from 'react-native-fast-image'

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView , { Marker,PROVIDER_GOOGLE }from 'react-native-maps';

import {UserContext} from '../../../UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { Container, PropertyDescription, CardSectionOne, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, CardSectionTwo, InfoHeaderText,
            InfoContainer, InfoText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
           DateContainer, DateText, DescriptionContainer, AmenitiesText, TypeText, BedContainer,
           BedTopContainer, BedNumberText, BedroomNameText, TenantNameText, InfoHeaderTextAndCenter,
           StickyHeaderContainer,  StickyHeaderIcon} from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import { LIGHTGREY , GetAmenitiesIcon, PRIMARYCOLOR, GetFAIconsInBlack, ROBOTOFONTFAMILY, GetFAIcons, GetFAIconWithColor } from '../../../sharedUtils';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBath, faBed, faEye, faFire, faFireFlameCurved, faFireFlameSimple } from '@fortawesome/free-solid-svg-icons';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;



export default function PropertyDetailScreen({navigation, route}){
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            onChat = false 
        });
   
        fetchProperties()
        getTokens()
      
      return unsubscribe
    }, [])
    
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
                    console.log("Failed To Create Channel")
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
                alert(e)
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
                            alert(e)
                    })
                    alert("Property is deleted.")
                    navigation.goBack()
                }
            })
            .catch(e=>{
                alert(e)
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
        console.log("Liking")

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
                    alert(e)
                })
                console.log("hello")
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
       <SafeAreaView style={{ backgroundColor:'white'}}>
        <Container>             
            <PropertyDescription>
    
                <ScrollView 
                showsVerticalScrollIndicator={false} 
                bouncesZoom={1}
                scrollEventThrottle={5}
                style={{backgroundColor:'white'}}
                >
                    {/* <Lottie source={require('../../../ImageLoading.json')} autoPlay   style={{width:WIDTH, height: WIDTH*0.3, position:'absolute', marginTop: HEIGHT*0.025}}/> */}

                    <View style={{height:HEIGHT*0.35, width:WIDTH}}>
                        <FlatList 
                        onScroll={onScroll}
                        horizontal 
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
                        snapToAlignment="center"
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        snapToInterval={WIDTH}
                        
                        />
                            
                            {/* <Image style={ImageStyle} source={{uri: data.imgList[0]}}/> */}
                        <View style={{width: WIDTH, height: HEIGHT*0.02, position:'absolute', bottom:HEIGHT*0.03, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            {propData.imgList.map((data, index)=>(
                                <View key={"img"+ index} style={{marginLeft:WIDTH*0.02, marginRight:WIDTH*0.02, height:HEIGHT*0.012, width:HEIGHT*0.012, 
                                borderRadius:HEIGHT*0.006,backgroundColor: flatlistIndex == index ? PRIMARYCOLOR : 'white' }}>
                                </View>
                            ))

                            }

                        </View>


                        
                    </View>
                    
                    <CardSectionOne>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <TypeText>{propData.type} for rent</TypeText>
                            {route.params.distance != undefined &&
                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',  width: WIDTH*0.2}}>   
                                {GetFAIconsInBlack("Map")}
                                <TypeText style={{color:'black', fontWeight: '500',}}>{route.params.distance} miles</TypeText>
                            </View>
                        }
                       </View>
                        <CardTitle>{propData.loc.streetAddr}</CardTitle>
                        <LocationDistanceContainer>
                            <LocationText>{propData.loc.secondaryTxt}</LocationText>
                        </LocationDistanceContainer>

                        <BedAndBathContainer>
                            <BedContainer>
                                <BedTopContainer>
                              
                                <FontAwesomeIcon icon={faBed} size={30}/>
                                
                                    {/* <BedNumberText>{propData.bed.replace("P","+")}</BedNumberText> */}
                                </BedTopContainer>
                                {propData.bed == "Studio" ?
                                    <BedroomNameText>Studio</BedroomNameText>
                                    :
                                    <BedroomNameText>{propData.bed.replace("P","+")} Bedroom</BedroomNameText>
                                }
                            </BedContainer>
                            <BedContainer>
                                <BedTopContainer>
                                    <FontAwesomeIcon icon={faBath} size={30}/>
                                    {/* <BedNumberText>{propData.bath.replace("P","+")}</BedNumberText> */}
                                </BedTopContainer>
                                <BedroomNameText>{propData.bath.replace("P","+")} Bathroom</BedroomNameText>
                            </BedContainer>
                            <BedContainer>
                                <BedTopContainer>
                                <FontAwesomeIcon icon={faFireFlameSimple} size={30}/>
                                    {/* <BedNumberText>
                                    {
                                    propData.numberOfViews < 1000 ?
                                    propData.numberOfViews 
                                    :
                                    Math.round(propData.numberOfViews/1000) + "K"
                                    }
                                    </BedNumberText> */}
                                </BedTopContainer>
                                <BedroomNameText>{
                                    propData.numberOfViews < 1000 ?
                                    propData.numberOfViews 
                                    :
                                    Math.round(propData.numberOfViews/1000) + "K"
                                    } Views</BedroomNameText>
                            </BedContainer>
                          
                        </BedAndBathContainer>
                    </CardSectionOne>   
                    <CardSectionOne>   
                    <InfoHeaderText>Description</InfoHeaderText>
                        <DescriptionContainer>
                        
                            {propData.description}
                        
                        </DescriptionContainer>
                    </CardSectionOne>
                    <CardSectionTwo>
                     
                        <InfoHeaderText>Availability</InfoHeaderText>
                        <InfoContainer> 
                            <DateContainer>
                                {GetFAIconsInBlack("Calendar")}
                                <DateText style={{color:'black', marginLeft: WIDTH*0.025, width: WIDTH*0.15 }}>From    </DateText>
                                <DateText>{new Date(propData.availableFrom).toDateString()}</DateText>
                            </DateContainer>
                            <DateContainer>
                                {GetFAIconsInBlack("Calendar")}
                                <DateText style={{color:'black', marginLeft: WIDTH*0.025,width: WIDTH*0.15 }}>To   </DateText>
                                <DateText>{new Date(propData.availableTo).toDateString()}</DateText>
                            </DateContainer>
                                
                        </InfoContainer>
                       
                    </CardSectionTwo>

                    <CardSectionTwo>
                        <InfoHeaderTextAndCenter>
                            <InfoHeaderText>Location</InfoHeaderText>
                            {/* <View style={{flexDirection:'row', alignItems:'flex-start', justifyContent:'center'}}>
                                <Ionicons name="locate" size={20} />
                                <Text>Center</Text>
                            </View> */}
                        </InfoHeaderTextAndCenter>
                        <View style={{width: WIDTH*0.9, height: HEIGHT*0.25, borderRadius:25, marginTop: HEIGHT*0.025 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                            style={{flex:1, position:'relative', borderRadius:10}}
                            initialRegion={{
                            latitude: route.params.currentLocation == undefined ? propData.loc.coordinates[1] : (propData.loc.coordinates[1] +route.params.currentLocation[0])/2, 
                            longitude: route.params.currentLocation == undefined ? propData.loc.coordinates[0] : (propData.loc.coordinates[0]+ route.params.currentLocation[1]) /2,
                            latitudeDelta: route.params.currentLocation == undefined ? 0.03 : getMapView(propData.loc.coordinates[1], propData.loc.coordinates[0], route.params.currentLocation[0], route.params.currentLocation[1]),
                            longitudeDelta: route.params.currentLocation == undefined ? 0.03 : getMapView(propData.loc.coordinates[1], propData.loc.coordinates[0], route.params.currentLocation[0], route.params.currentLocation[1])
                            }}
                        >
                            <Marker
                            pinColor='green'
                            title='Destination'
                            coordinate={{latitude: propData.loc.coordinates[1], longitude: propData.loc.coordinates[0]}}
                            ></Marker>
                            {route.params.currentLocation != undefined &&
                            <Marker
                            title='Search Location'
                            coordinate={{latitude: route.params.currentLocation[0], longitude: route.params.currentLocation[1]}}
                            ></Marker>
                            }
                        </MapView>
                        </View>
                    </CardSectionTwo>
                    
                    
                    <CardSectionTwo>
                        <InfoHeaderText>Tenant Information</InfoHeaderText>
                        <TenantInfoContainer>
                            <ProfileImageContainer>
                                <Image source={{uri:postedUserData.profilePic}} style={{height:HEIGHT*0.1, width:HEIGHT*0.1, borderRadius:20, backgroundColor:LIGHTGREY}}/>
                            </ProfileImageContainer>
                            <TenantInfo>
                                <TenantNameText style={{width: WIDTH*0.6}}>{postedUserData.firstName} {postedUserData.lastName}</TenantNameText>
                                <View>
                                {postedUserData.school != "" && 
                                    <InfoText>{postedUserData.school}</InfoText>
                                }
                                {postedUserData.occupation != "" && 
                                    <InfoText>{postedUserData.occupation}</InfoText>
                                }
                                </View>
                            </TenantInfo>
                        </TenantInfoContainer>
                    </CardSectionTwo>
                  
                    <CardSectionOne>
                        <InfoHeaderText>Amenities ({propData.amenities.length})</InfoHeaderText>
                        <View style={{marginTop: HEIGHT*0.025}}>
                        {propData.amenities.length != 0 ? propData.amenities.map((value)=>(
                            <AmenitiesItem key={value + "detailamen"}>
                                {GetFAIconsInBlack(value)}
                                {/* <AmenitiesText>{value.replaceAll("_"," ")}</AmenitiesText> */}
                                <AmenitiesText>{value}</AmenitiesText>
                               
                            </AmenitiesItem>

                        ))
                        :
                        <InfoText>No amenities listed ...</InfoText>
                    
                    }
                    </View>
                    </CardSectionOne>
                    
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
            </PropertyDescription>
            

        </Container>

       
        
        </SafeAreaView>
       
        
    )
}