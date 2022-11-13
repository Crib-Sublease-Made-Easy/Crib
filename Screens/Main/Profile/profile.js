import React , {useContext, useState, useRef, useEffect, useCallback, useId} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Share
} from 'react-native';
import { UserContext } from '../../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


import FastImage from 'react-native-fast-image'

import { PRIMARYCOLOR, Header, HeaderContainer, HEIGHT, WIDTH, MEDIUMGREY } from '../../../sharedUtils';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSquareCheck, faSwimmer, faDog} from '@fortawesome/free-solid-svg-icons'
library.add(faSquareCheck, faSwimmer, faDog)
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import Lottie from 'lottie-react-native';

import {
StyledView,
Container,
SlidingContainer, 
PostContainer, 
FavContainer, 
PostedText, 
FavText,  
DefaultPostFavText, 
PostedPropertyInfoContainer,
PropertyName, 
DatePriceText,PriceEditContainer, 
EditPropertyPressable, 
EditText, 
FavPropertyCard, 
FavPropertyCardName, 
FavPropertyCardContent, 
FavPropertyCardDateText, 
FavPropertyCardDateContainer, 
PostedPropertyCard, 
HeaderIndividualContainer,
RowContainer, 
RowItemName,
ProfileHeading, 
NoUserViewContainer, 
LoginContainer, 
LoginText, 
SignupContainer,
SignupText,
PostedFavContainer
} from './profileStyle';

import { EXTRALIGHT, LIGHTGREY, GOOGLEBLUE, DARKGREY, GetFAIconWithColor } from '../../../sharedUtils';


export default function ProfileScreen({navigation}){
    const insets = useSafeAreaInsets();
    const scrollviewRef = useRef(null)
    const {USERID, user} = useContext(UserContext);


    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState(null)
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const translation = useRef(new Animated.Value(0)).current;

    const [userData, setUserData] = useState('')

    const [profilePic, setProfilePic] = useState(null)
   
    useEffect(()=>{
    
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("REFRESH --- USEEFFECT")
            getTokens()              
        });
       
        return unsubscribe; 
    }, [navigation])

    //Share the app on app store to freinds throguh message 
    const onShare = async () => {
        try {
          const result = await Share.share({
            //   'Lighthouse | An app to find short term housing solutions made easy',
              url: 'https://apps.apple.com/us/app/google-chrome/id535886823'
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
    };

    //Retrieve user info for display and cache for later use
    async function getTokens(){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        const refreshToken = await EncryptedStorage.getItem("refreshToken");
        const UID = await EncryptedStorage.getItem("userId")

        if(refreshToken != undefined){
            
            //Get user favorite properties
            fetchFavoriteProperties(accessToken)
            if(accessToken != null && UID != null){
                fetch('https://crib-llc.herokuapp.com/users/' + UID, {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
                }
                }) 
                .then(res => res.json()).then(async userData =>{
                    setUserData(userData)
                    //Load API data if the cached profile pic is null
                    let cachedProfilePic = await AsyncStorage.getItem("profilePic");
                    if(profilePic == null){
                        if(cachedProfilePic != null && cachedProfilePic == userData.profilePic ){
                        
                            console.log("UPDATE --- CACHE --- profilePic")
                            setProfilePic(cachedProfilePic)
                        }
                        else{
                            console.log("UPDATE --- API --- profilePic")
                            setProfilePic(userData.profilePic)
                            try{
                                await AsyncStorage.setItem("profilePic", userData.profilePic);
                            }
                            catch{e=>{
                                console.log("ERROR --- PROFILE --- GETTOKEN")
                            }

                            }
                            
                        }
                    }
                    if(userData.postedProperties != undefined){
                        fetchPostedProperties(userData.postedProperties[0], accessToken)
                    }
                })
                .catch(e=>{
                    console.log("ERROR --- PROFILE --- GETTOKEN")
                    alert(e)
                })
            }
           
        }
        
    }
    
    //Funciton: Get user's posted proeprty
    async function fetchPostedProperties(id, token){
      
            await fetch('https://crib-llc.herokuapp.com/properties/' + id, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            }
            })
            .then(res => {
                if(res.status == 404){
                    setPostedProperties(null)
                }
                else{
                    return res.json()
                }
            }).then(async propertyData =>{
                if(propertyData != undefined){
                    
                    //Returns no prop found when theres nothing 
                    const tempPropData = await AsyncStorage.getItem('postedProperty')
                    
                    let compare = (tempPropData === JSON.stringify(propertyData))
                    
                    if(!compare || tempPropData == null) {
                        console.log("UPDATE --- API --- POSTED PROPERTY")
                        try{
                            await AsyncStorage.setItem('postedProperty', JSON.stringify(propertyData))
                        }
                        catch{
                            e=>{
                                console.log(e)
                            }
                        }
                        
                        if(JSON.stringify(propertyData) != {"Error": "No Property found"}){
                            setPostedProperties(propertyData)
                        }
                    }
                    else{
                        console.log("UPDATE --- CACHE --- POSTED PROPERTY")
                        setPostedProperties(JSON.parse((tempPropData)))
                    }           
                }

            }).catch(e=>{
                console.log("ERROR --- PROFILE --- FETCHPOSTEDPROPERTIES")
                alert(e)
            })
        
    }

    //Function: Fetch favorite properties 
    function fetchFavoriteProperties(token){
        fetch('https://crib-llc.herokuapp.com/users/favorites/all', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            }
        }).then(res => res.json()).then(async data =>{
            //data.properties get the list of all properties
            const tempFavProp = await AsyncStorage.getItem("favoriteProperties");
            // console.log("TEMPDATA", tempFavProp)

            const compare = tempFavProp === JSON.stringify(data)
            // console.log(compare)

            //If the api data is different from the AyncStorage data
            if(!compare){
                //This is that favproperties is not empty so no error later on
                if(data.length != 0){
                    console.log("UPDATE --- API --- FAV PROPERTY")
                    
                    setFavoriteProperties(data);
                    try{
                        await AsyncStorage.setItem("favoriteProperties", JSON.stringify(data) )
                    }
                    catch{e=>{
                        console.log("ERRROR --- PROFILE --- FETCHFAVORITEPROPERTY")
                    }}
                }
                else{
                    setFavoriteProperties([])
                }
            }
            else{ // The api and cache data is the same
                console.log("UPDATE --- CACHE --- FAV PROPERTY")
                setFavoriteProperties(JSON.parse(tempFavProp))
            }
        })
    }

    //Function to post properties, only if user have no properties 
    function toPostProperty(){
        if(userData.postedProperties.length >= 1 ){
            alert("As a regular member, you can only post one property.")
        }
        else{
            navigation.navigate('PropertyPosting')
        }
    }

    //Function: animate the process of the sliding half transparant bckground between psoted and favorite 
    function PressPosted(){
        Animated.spring(translation,{
        toValue: 0,
        duration:100,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        scrollviewRef.current.scrollTo({x:0})
    }

    function PressFav(){
        Animated.spring(translation,{
        toValue: WIDTH*0.45 ,
        duration:100,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        scrollviewRef.current.scrollTo({x:WIDTH})
    }
    return(
        <StyledView style={{backgroundColor:'white', flex: 1, }} insets={insets}>
            {/* Check if user is logged in and show differnt page*/}
            {USERID != null ? 
            
            // This is when user is logged in 
            <View style={{flex: 1}}>
                <HeaderContainer style={{borderBottomWidth: 0}}>
                    <HeaderIndividualContainer style={{justifyContent:'flex-end', width: '15%'}}>
                        <Pressable  hitSlop={WIDTH*0.05} onPress={()=> navigation.navigate("ProfileEdit", {userData : userData})}>
                        <FastImage source={{uri: profilePic, priority: FastImage.priority.high}} 
                        style={{width:WIDTH*0.1, height: WIDTH*0.1, borderRadius: WIDTH*0.05, alignSelf:'center', backgroundColor:EXTRALIGHT}} />
                        </Pressable>
                    </HeaderIndividualContainer> 
                        
                    <HeaderIndividualContainer style={{width: '70%'}}>
                        <Header>{userData.firstName}</Header>
                    </HeaderIndividualContainer>

                    <HeaderIndividualContainer style={{ width:'15%',justifyContent:'flex-start', }}>
                        <Pressable onPress={()=>navigation.navigate('Setting')}>
                            <Ionicons name='cog-outline' size={30} />
                        </Pressable>
                    </HeaderIndividualContainer>
                
                </HeaderContainer>
                <ProfileHeading>Profile</ProfileHeading>
                {/* The Edit Profie, Post a Property and Share a Crib function */}
                <View>
                    <RowContainer onPress={()=> navigation.navigate("ProfileEdit", {userData : userData})}>    
                        <Ionicons name="create"  size={25} color={GOOGLEBLUE}/>
                        <RowItemName>Edit Profile</RowItemName>
                    </RowContainer>
                    <RowContainer onPress={()=> toPostProperty()}>    
                        <Ionicons name="home"  size={25} color={PRIMARYCOLOR}/>
                        <RowItemName>Post a property</RowItemName>
                    </RowContainer>
                    {/* <RowContainer onPress={()=> onShare()}>    
                        <Ionicons name="share"  size={25} color={DARKGREY}/>
                        <RowItemName>Share Crib</RowItemName>
                    </RowContainer> */}
                </View>

                <Container>
                    {/* This is the Slider between Posted and Favorite */}
                    <SlidingContainer>
                        <Animated.View style={{width:WIDTH*0.35, height: HEIGHT*0.05, borderRadius: 25, position:'absolute', left:WIDTH*0.05,
                        backgroundColor:PRIMARYCOLOR, opacity:0.2, transform:[{translateX: translation}]}}></Animated.View>
                        <PostContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Posted'), PressPosted()}}>
                            <FontAwesome name='home'  size={20} color={tabPressed == 'Posted' ? PRIMARYCOLOR : DARKGREY}/>
                            <PostedText tabPressed={tabPressed} >Posted</PostedText>
                        </PostContainer>
                        <FavContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Fav'), PressFav()}}>
                            <FontAwesome name='heart' size={20} color={tabPressed == "Fav" ? PRIMARYCOLOR : DARKGREY} />
                            <FavText tabPressed={tabPressed}>Favorite</FavText>
                        </FavContainer>
                    </SlidingContainer>

                    {/* Horizontal scrollview for posted and favorite property */}
                    <ScrollView ref={scrollviewRef} showsHorizontalScrollIndicator= {false} horizontal snapToAlignment='start' snapToInterval={WIDTH} decelerationRate='fast'
                        style={{width:WIDTH, maxHeight:HEIGHT*0.45, }} scrollEnabled={false}>
                        {/* This is the View of posted property */}
                        <View style={{ width:WIDTH, alignItems:'center' , paddingVertical: HEIGHT*0.02}}>
                            {/* When user have a property */}
                            {postedProperties != null ?
                                <PostedPropertyCard onPress={()=>navigation.navigate("PropertyDetail", {data: postedProperties, uid: userData._id})}>
                                    <FastImage key={"defaultPropPic"}
                                    source={{uri: postedProperties == null ? null : postedProperties.propertyInfo.imgList[0], priority: FastImage.priority.medium}} style={{width:WIDTH*0.9, height:HEIGHT*0.25, backgroundColor:LIGHTGREY, alignSelf:'center', borderRadius:10}}/>
                                    <PostedPropertyInfoContainer>
                                        <PropertyName>{postedProperties.propertyInfo.loc.streetAddr}</PropertyName>
                                        <DatePriceText>{postedProperties.propertyInfo.loc.secondaryTxt}</DatePriceText>
                                        <DatePriceText>
                                            {new Date(postedProperties.propertyInfo.availableFrom).toLocaleDateString('default', { month: 'short' })} {""}
                                           
                                            {" "} - {" "}
                                            {new Date(postedProperties.propertyInfo.availableTo).toLocaleDateString('default', { month: 'short' })} {""}
                                           
                                        </DatePriceText>
                                        <PriceEditContainer>
                                            <PropertyName style={{color:'black'}}>${postedProperties.propertyInfo.price} / month</PropertyName>
                                            <EditPropertyPressable onPress={()=>navigation.navigate("EditProperty", {propertyData: postedProperties.propertyInfo, propId: postedProperties.propertyInfo._id})}>
                                                <EditText>Edit</EditText>
                                            </EditPropertyPressable>
                                        </PriceEditContainer>
                                    </PostedPropertyInfoContainer>
                                </PostedPropertyCard>
                            :
                                //When user have no property
                                <Pressable style={{width:WIDTH, height:'100%', alignItems:'center', justifyContent:'center'}}
                                    onPress={toPostProperty}>
                                    <Lottie source={require('../../../subleaseProperties.json')} autoPlay style={{width:WIDTH*0.6, height: WIDTH*0.6, }}/>
                                    {/* <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                                    backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                                        <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                                    </Pressable> */}
                                    <DefaultPostFavText>Sublease in just a few steps</ DefaultPostFavText>
                                </Pressable>
                            }
                        </View>

                         {/* This is the View of favorite property */}
                        <PostedFavContainer>
                            
                            {favoriteProperties.length == 0 ?
                            //When there is no favorite property
                                <Pressable style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=> navigation.navigate("Discover")}>
                                    {/* <Lottie source={require('../../../likeanimation.json')} autoPlay loop={20}  style={{width:WIDTH*0.4, height: WIDTH*0.4, }}/> */}
                                    <DefaultPostFavText>No likes yet. Start discovering...</ DefaultPostFavText>
                                </Pressable>
                                :
                                //When there exist at least 1 fav prop
                                <ScrollView contentContainerStyle={{alignSelf:'center'}}
                                style={{alignSelf:'center', width: WIDTH, paddingTop: HEIGHT*0.01}} showsVerticalScrollIndicator={false}>
                                    {favoriteProperties.length != 0 && favoriteProperties?.map((item, index)=>(
                                    <FavPropertyCard key={item.propertyInfo._id + index}>
                                        <Pressable style={{width:'30%', height:'100%', borderRadius:10}} onPress={()=> navigation.navigate("PropertyDetail", {data: item})}>
                                        <FastImage source={{uri: item.propertyInfo.imgList[0], priority: FastImage.priority.low}} 
                                        style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderBottomLeftRadius:10}}/>
                                        </Pressable>
                                        <FavPropertyCardContent onPress={()=> navigation.navigate("PropertyDetail", {data: item, uid: userData._id})}>
                                            <FavPropertyCardName>{item.propertyInfo.loc.secondaryTxt}</FavPropertyCardName>
                                            <FavPropertyCardDateContainer>
                                                <FavPropertyCardDateText>
                                                    {
                                                    new Date(item.propertyInfo.availableFrom).toLocaleDateString() }
                                                </FavPropertyCardDateText>
                                                <View style={{paddingHorizontal: WIDTH*0.02}}>
                                                {GetFAIconWithColor("ArrowRight", "black")}
                                                </View>
                                                <FavPropertyCardDateText>
                                                {
                                                    new Date(item.propertyInfo.availableTo).toLocaleDateString() }
                                                </FavPropertyCardDateText>
                                            </FavPropertyCardDateContainer>
                                            <FavPropertyCardName>$ {item.propertyInfo.price}</FavPropertyCardName>
                                        </FavPropertyCardContent>
                                    </FavPropertyCard>

                                    ))}
                                    {/* Padding in the bottom so the fav pro wont stick to bottom */}
                                    <View style={{width:WIDTH*0.9, height: HEIGHT*0.05,}}/>
                
                                </ScrollView>
                            }
                        </PostedFavContainer>
                    
                    </ScrollView>
                </Container>
            </View>
            :
            // When user is not logged in 
            <NoUserViewContainer>
                <View style={{width:WIDTH*0.6, height: WIDTH*0.6, }}>
                    <Lottie source={require('../../../notLoggedIn.json')} style={{width:'100%', height: '100%' }}/>
                </View>

                <DefaultPostFavText>Login to view and post properties.</DefaultPostFavText>

                <LoginContainer onPress={()=> navigation.navigate("Login")}>
                    <LoginText>Login</LoginText>
                </LoginContainer>

                <SignupContainer onPress={()=> navigation.navigate("FirstLastName")}>
                    <SignupText>Sign up</SignupText>
                </SignupContainer>

            </NoUserViewContainer>
        }
        </StyledView>
    )
}


