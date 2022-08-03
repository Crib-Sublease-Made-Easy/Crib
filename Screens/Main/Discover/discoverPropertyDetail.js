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
  } from 'react-native';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import {UserContext} from '../../../UserContext'
import { SharedElement } from 'react-navigation-shared-element';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { Container, PropertyDescription, ImageStyle, CardSectionOne, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, BedBathLogo, Divider, CardSectionTwo, InfoHeaderText,
            InfoContainer, BothInfoContainer, InfoText, DescriptionText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
            CardSectionFour, CardSectionFive, DateContainer, DateText, DescriptionContainer, AmenitiesText} from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import { LIGHTGREY , GetAmenitiesIcon, PRIMARYCOLOR, DARKGREY} from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;



export default function PropertyDetailScreen({navigation, route}){
    console.log("Detail")
    console.log("DATAAAA", route.params.data.propertyInfo)
    useEffect(()=>{
        console.log(route.params.uid)
        console.log(route.params.data.propertyInfo.postedBy)
      fetchProperties()
      getTokens()
    }, [])
    const flatListRef = useRef(null)
    const propertyAmenities = (["Furnished", "Pets Allowed", "Able to renew", "On-site waher and dryer"]);
    const [propData, setPropData] = useState(route.params.data.propertyInfo);
    const postedUserData = route.params.data.userInfo;
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged: testFuction },
    ]);
    const {sb, USERID} = useContext(UserContext);
    const [flatingScrolling, setFlatlistScrolling] = useState(false)
    const [flatlistIndex, setFlatlistIndex] = useState(0)
    const [propAPIData, setPropAPIData] = useState()
    const [liked, setLiked]  = useState()
    const [userDate, setUserData]= useState()
    const [ownProperty, setOwnProperty] = useState(route.params.data.propertyInfo.postedBy == route.params.uid)
    const createConversation = async () =>{
        console.log("MY Userid", USERID)
        var userIds = [USERID, propData.postedBy]
        console.log("I log catsssss")
        
        sb.GroupChannel.createChannelWithUserIds(userIds, false, propData.loc.streetAddr, propData.imgList[0], propData._id, function(groupChannel, error) {
            if (error) {
                // Handle error.
                console.log("Failed To Create Channel")
                console.log(error)
            }
            console.log("Channel Created Successfully")
            //console.log(groupChannel)
            // A group channel with additional information is successfully created.
            var channelUrl = groupChannel.url;
            navigation.navigate("Chat", {url:channelUrl, id: USERID})
            console.log(channelUrl)
        });

        
    }

    async function fetchProperties(){
        const accessToken = await SecureStorage.getItem("refreshToken");
        await fetch('https://sublease-app.herokuapp.com/properties/' + route.params.data.propertyInfo._id, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then( async propertyData =>{
                console.log("TESTTT", propertyData)
                if(propertyData.propertyInfo.deleted){
                    const accessToken = await SecureStorage.getItem("refreshToken");
                    console.log(accessToken)
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
                        .then(res => res.json()).then(message =>{
                            setLiked(!liked)
                            console.log(message)
                        
                        })
                        .catch(e=>{
                            alert(e)
                    })
                    alert("Property is deleted.")
                    navigation.goBack()
                }
                if(route.params.data == undefined){
                    setPropData(propertyData.propertyInfo)
                }
                setPropAPIData(propertyData)
                //console.log(propertyData)
               
               
            })
            .catch(e=>{
                alert(e)
        })
    }

    const testFuction = ({
        viewableItems,
    }) => {
        //console.log(viewableItems)
    };

    const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setFlatlistIndex(roundIndex)
    }, []);

    async function likeProperty(){
        console.log("ID" , route.params.data.propertyInfo._id)
        const accessToken = await SecureStorage.getItem("refreshToken");
        console.log(accessToken)
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
            .then(res => res.json()).then(message =>{
                setLiked(!liked)
                console.log(message)
               
            })
            .catch(e=>{
                alert(e)
        })
    }

    async function getTokens(){
       
        const accessToken = await SecureStorage.getItem("refreshToken");
       //console.log("Access Token " + accessToken)

        const UID = await SecureStorage.getItem("userId");

      //  console.log("UID " + UID)
        fetch('https://sublease-app.herokuapp.com/users/' + UID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
            // console.log("userdata")
            setUserData(userData)
            console.log("userdata")
            console.log(userData)
           
            if (userData.favoriteProperties.indexOf(route.params.data.propertyInfo._id) != -1){
                setLiked(true)
            }
          
           
            
            
        })
        .catch(e=>{
            alert(e)
        })
    }

    return(
       
        <Container>             
            <PropertyDescription>
    
                <ScrollView showsVerticalScrollIndicator={false} onRefresh={()=>console.log("hi")} >
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
                        <Pressable  style={{backgroundColor:'rgba(43,43,43,0.8)',justifyContent:'center', alignItems:'center',
                         position:'absolute',top:HEIGHT*0.05, left:WIDTH*0.05, width:WIDTH*0.1, height:WIDTH*0.1, borderRadius: WIDTH*0.05 }} onPress={()=>navigation.goBack()}>
                            <Ionicons  name="arrow-back-outline" size={25} color='white'></Ionicons>
                        </Pressable>
                        { !ownProperty &&
                        <Pressable  style={{backgroundColor:'rgba(43,43,43,0.8)',justifyContent:'center', alignItems:'center',
                         position:'absolute',top:HEIGHT*0.05, right:WIDTH*0.05, width:WIDTH*0.1, height:WIDTH*0.1, borderRadius: WIDTH*0.05 }} onPress={likeProperty}>
                            <Ionicons  name="heart" size={25} color={ liked ? '#ee88a6' : 'white'}></Ionicons>
                        </Pressable>
                        }
                    </View>
                    
                    <CardSectionOne>
                        <CardTitle>{propData.loc.streetAddr}</CardTitle>
                        <LocationDistanceContainer>
                            <Ionicons name="location-outline" size={20} />
                            <LocationText>{propData.loc.secondaryTxt}</LocationText>
                            {/* <LocationText>3 miles away</LocationText> */}
                        </LocationDistanceContainer>
                        <BedAndBathContainer>
                            <BedBathLogo>
                                <Ionicons name="bed-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bed} bedroom</LocationText>
                            </BedBathLogo>
                            <BedBathLogo>
                                <Ionicons name="water-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bath} bathroom</LocationText>
                            </BedBathLogo>
                        </BedAndBathContainer>
                    </CardSectionOne>   
                    <Divider></Divider>
                    <CardSectionTwo>
                        <BothInfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Property Type:</InfoHeaderText>
                                <InfoText>{propData.type}</InfoText>
                            </InfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Availability:</InfoHeaderText>
                                <DateContainer>
                                    <DateText>{new Date(propData.availableFrom).toDateString()}</DateText>
                                    <Ionicons name="arrow-forward-outline" size={25} />
                                    <DateText>{new Date(propData.availableTo).toDateString()}</DateText>
                                </DateContainer>
                            </InfoContainer>
                        </BothInfoContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    <CardSectionTwo>
                        <InfoHeaderText>Descriptions:</InfoHeaderText>
                        <DescriptionContainer>
                            <Text>
                                {propData.description}
                            </Text>
                        </DescriptionContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    
                    <CardSectionTwo>
                        <InfoHeaderText>Tenant Information:</InfoHeaderText>
                        <TenantInfoContainer>
                            <ProfileImageContainer>
                                <Image source={{uri:postedUserData.profilePic}} style={{height:HEIGHT*0.125, width:HEIGHT*0.125, borderRadius:HEIGHT*0.125/2, backgroundColor:LIGHTGREY}}/>
                            </ProfileImageContainer>
                            <TenantInfo>
                                <InfoHeaderText style={{width: WIDTH*0.6}}>{postedUserData.firstName} {postedUserData.lastName}</InfoHeaderText>
                                <InfoText>{postedUserData.school}</InfoText>
                                <InfoText>{postedUserData.occupation}</InfoText>
                            </TenantInfo>
                        </TenantInfoContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    <CardSectionOne>
                        <InfoHeaderText>Amenities:</InfoHeaderText>
                        {propData.amenities.map((value)=>(
                            <AmenitiesItem key={value + "detailamen"}>
                                <Ionicons name={GetAmenitiesIcon(value)} size={25} color={DARKGREY}></Ionicons>
                                <AmenitiesText>{value.replace("_"," ")}</AmenitiesText>
                               
                            </AmenitiesItem>

                        ))}
                    </CardSectionOne>
                    
                </ScrollView>
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