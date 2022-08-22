import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
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
    Pressable,
    RefreshControl,
    Vibration
  } from 'react-native';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';


import MapView , { Marker }from 'react-native-maps';

import {UserContext} from '../../../UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()



import { Container, PropertyDescription, ImageStyle, CardSectionOne, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, BedBathLogo, Divider, CardSectionTwo, InfoHeaderText,
            InfoContainer, BothInfoContainer, InfoText, DescriptionText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
           DateContainer, DateText, DescriptionContainer, AmenitiesText, TypeText, BedContainer,
           BedTopContainer, BedNumberText, BedroomNameText, TenantNameText, InfoHeaderTextAndCenter,
           StickyHeaderContainer,  StickyHeaderIcon} from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import getFAAmenities, { LIGHTGREY , GetAmenitiesIcon, PRIMARYCOLOR, DARKGREY, GetFAIcons, GetFAIconsInBlack } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;



export default function PropertyDetailScreen({navigation, route}){
    
    useEffect(()=>{
      fetchProperties()
      getTokens()
    }, [])

    const flatListRef = useRef(null)
    const [propData, setPropData] = useState(route.params.data.propertyInfo);
    const postedUserData = route.params.data.userInfo;
    const {sb, USERID} = useContext(UserContext);
    const [flatlistIndex, setFlatlistIndex] = useState(0)
    const [liked, setLiked]  = useState()
    const [ownProperty, setOwnProperty] = useState(route.params.data.propertyInfo.postedBy == route.params.uid)
    const createConversation = async () =>{
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

    async function getTokens(){
        const accessToken = await SecureStorage.getItem("accessToken");

        fetch('https://sublease-app.herokuapp.com/users/' + USERID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
            if(userData.favoriteProperties.indexOf(route.params.data.propertyInfo._id) == -1){
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

    async function fetchProperties(){
        const accessToken = await SecureStorage.getItem("accessToken");
        console.log("FETCH PROPERTYDETAIL")
        await fetch('https://sublease-app.herokuapp.com/properties/' + route.params.data.propertyInfo._id, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            },
            
            }) 
            .then(res => res.json()).then( async propertyData =>{
                if(propertyData.propertyInfo.deleted){
                    await fetch('https://sublease-app.herokuapp.com/properties/favorite', {
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


    const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setFlatlistIndex(roundIndex)
    }, []);

    async function likeProperty(){
        console.log("Liking")
        const accessToken = await SecureStorage.getItem("accessToken");
        
        await fetch('https://sublease-app.herokuapp.com/properties/favorite', {
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
                console.log(message)
                
                    
                
                    // const tempFavProp = await AsyncStorage.getItem("favoritePropertiesId")
                    // if(tempFavProp != null){
                    //     const JSONtempFavProp = JSON.parse(tempFavProp)
                    //     let temp = [];
                        
                    //     JSONtempFavProp.forEach(element => {
                    //         temp.push(element)
                    //     });
                    //     temp.push(route.params.data.propertyInfo._id)
                        
                    //     await AsyncStorage.setItem("favoritePropertiesId", JSON.stringify(temp))
                    // }
                    // else{
                    //     let temp = [];
                    //     temp.push(route.params.data.propertyInfo._id)
                    //     await AsyncStorage.setItem("favoritePropertiesId",  JSON.stringify(temp))
                    // }
                    

                await AsyncStorage.removeItem("favoriteProperties");
               
                setLiked(!liked)
            })
            .catch(e=>{
                alert(e)
        })
    }

    function isCloseToTop({layoutMeasurement, contentOffset, contentSize}){
       
        return contentOffset.y < -HEIGHT*0.2;
     }

    return(
       
        <Container>             
            <PropertyDescription>
    
                <ScrollView showsVerticalScrollIndicator={false} onRefresh={()=>console.log("hi")} 
               
                bouncesZoom={1}
                scrollEventThrottle={5}
                onScroll={({nativeEvent}) => {
                    if(isCloseToTop(nativeEvent)){
                       navigation.navigate("Discover")
                    }
                }}
                >
                
                    <View style={{height:HEIGHT*0.35, width:WIDTH}}>
                        <FlatList 
                        onScroll={onScroll}
                        horizontal 
                        style={{position:'absolute', width:WIDTH, height:HEIGHT*0.35, overflow:'hidden'}}
                        data={route.params.data.propertyInfo.imgList}
                        ref={flatListRef}
                        renderItem={({item})=>(
                           
                            <View style={{width:WIDTH, height:HEIGHT*0.35,justifyContent:'center'}}>
                                <Image source={{uri: item}} style={{width:WIDTH, height:HEIGHT*0.35,}} />
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
                        <TypeText>{propData.type} for rent</TypeText>
                        <CardTitle>{propData.loc.streetAddr}</CardTitle>
                        <LocationDistanceContainer>
                            <Ionicons name="location-outline" size={20} />
                            <LocationText>{propData.loc.secondaryTxt}</LocationText>
                            {/* <LocationText>3 miles away</LocationText> */}
                        </LocationDistanceContainer>
                        <DescriptionContainer>
                          
                                {propData.description}
                           
                        </DescriptionContainer>
                        <BedAndBathContainer>
                            <BedContainer>
                                <BedTopContainer>
                                {propData.bed != "Studio" &&
                                    <Ionicons name='bed' size={30} />
                                }
                                    <BedNumberText>{propData.bed}</BedNumberText>
                                </BedTopContainer>
                                <BedroomNameText>Bedroom</BedroomNameText>
                            </BedContainer>
                            <BedContainer>
                                <BedTopContainer>
                                    <Ionicons name='water' size={30} />
                                    <BedNumberText>{propData.bath}</BedNumberText>
                                </BedTopContainer>
                                <BedroomNameText>Bathroom</BedroomNameText>
                            </BedContainer>
                            <BedContainer>
                                <BedTopContainer>
                                    <Ionicons name='flame' size={30} />
                                    <BedNumberText>
                                    {
                                    propData.numberOfViews < 1000 ?
                                    propData.numberOfViews 
                                    :
                                    propData.numberOfViews/1000 + "K"
                                    }
                                    </BedNumberText>
                                </BedTopContainer>
                                <BedroomNameText>Views</BedroomNameText>
                            </BedContainer>
                            {/* <BedBathLogo>
                                <Ionicons name="bed-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bed} bedroom</LocationText>
                            </BedBathLogo>
                            <BedBathLogo>
                                <Ionicons name="water-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bath} bathroom</LocationText>
                            </BedBathLogo> */}
                        </BedAndBathContainer>
                    </CardSectionOne>   
                  
                    <CardSectionTwo>
                     
                        <InfoHeaderText>Availability</InfoHeaderText>
                        <InfoContainer> 
                            
                            <DateContainer>
                                <Ionicons name='calendar' size={20} />
                                <DateText style={{color:'black', }}> From    </DateText>
                                <DateText>{new Date(propData.availableFrom).toDateString()}</DateText>
                            </DateContainer>
                            <DateContainer>
                                <Ionicons name='calendar' size={20} />
                                <DateText style={{color:'black',  }}> To    </DateText>
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
                        <View style={{width: WIDTH*0.9, height: HEIGHT*0.2, borderRadius:25,}}>
                        <MapView
                            scrollEnabled={false}
                            style={{flex:1, position:'relative', borderRadius:10}}
                            initialRegion={{
                            latitude: propData.loc.coordinates[1], 
                            longitude: propData.loc.coordinates[0],
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                            coordinate={{latitude: propData.loc.coordinates[1], longitude: propData.loc.coordinates[0]}}
                            ></Marker>
                        </MapView>
                        </View>
                    </CardSectionTwo>
                    
                    
                    <CardSectionTwo>
                        <InfoHeaderText>Tenant Information</InfoHeaderText>
                        <TenantInfoContainer>
                            <ProfileImageContainer>
                                <Image source={{uri:postedUserData.profilePic}} style={{height:HEIGHT*0.1, width:HEIGHT*0.1, borderRadius:HEIGHT*0.05, backgroundColor:LIGHTGREY}}/>
                            </ProfileImageContainer>
                            <TenantInfo>
                                <TenantNameText style={{width: WIDTH*0.6}}>{postedUserData.firstName} {postedUserData.lastName}</TenantNameText>
                                {postedUserData.school != "" && 
                                    <InfoText>School:  {postedUserData.school}</InfoText>
                                }
                                {postedUserData.occupation != "" && 
                                    <InfoText>Occupation:  {postedUserData.occupation}</InfoText>
                                }
                            </TenantInfo>
                        </TenantInfoContainer>
                    </CardSectionTwo>
                  
                    <CardSectionOne>
                        <InfoHeaderText>Amenities</InfoHeaderText>
                        {propData.amenities.length != 0 ? propData.amenities.map((value)=>(
                            <AmenitiesItem key={value + "detailamen"}>
                                {GetFAIconsInBlack(value)}
                                <AmenitiesText>{value.replace("_"," ")}</AmenitiesText>
                               
                            </AmenitiesItem>

                        ))
                        :
                        <InfoText>No amenities listed ...</InfoText>
                    
                    }
                    </CardSectionOne>
                    
                </ScrollView>
                <StickyHeaderContainer>
                    < StickyHeaderIcon onPress={()=>navigation.goBack()}>
                        <Ionicons  name="arrow-back-outline" size={25} color='white'></Ionicons>
                    </ StickyHeaderIcon>
                    { !ownProperty &&
                    < StickyHeaderIcon  onPress={likeProperty}>
                        <Ionicons  name="heart" size={25} color={ liked ? '#ee88a6' : 'white'}></Ionicons>
                    </ StickyHeaderIcon>
                    }
                    
                </StickyHeaderContainer>
            </PropertyDescription>
            <Footer>
                    <PricePerMonth>${propData.price} <Text style={{fontSize: HEIGHT*0.025, fontWeight:'500'}}>/ month</Text></PricePerMonth>
                
                    <ContactTanentButton disabled={ownProperty} ownProperty={ownProperty} onPress={()=>createConversation()}>
                        <Text style={{color:'white', fontWeight:'700'}}>Contact Tenant</Text>
                    </ContactTanentButton>
            </Footer>

        </Container>
       
        
    )
}