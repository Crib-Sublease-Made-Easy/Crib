import React , {useContext, useState, useRef, useEffect, useCallback, useId} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  Pressable,
  Animated,
  Share,
  ActivityIndicator,
  AppState
} from 'react-native';
import { UserContext } from '../../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


import FastImage from 'react-native-fast-image'

import { PRIMARYCOLOR, Header, HEIGHT, WIDTH, MEDIUMGREY } from '../../../sharedUtils';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSquareCheck, faSwimmer, faDog} from '@fortawesome/free-solid-svg-icons'
library.add(faSquareCheck, faSwimmer, faDog)
import Ionicons from 'react-native-vector-icons/Ionicons';


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
CribPremiumPressable,
NoUserViewContainer, 
LoginContainer, 
LoginText, 
SignupContainer,
SignupText,
PostedFavContainer,
JoinedDateText,
HeaderContainer,
ImageContainer,
NameDateContainer,
NameText,
SettingContainer,
CribPremiumHeaderText,
UpgradeView,
UpgradeImageContainer,
UpgradeTextContainer,
UpgradeTextHeader,
UpgradeText,
OptionContainer,
OptionRow,
OptionName,
CribPremiumPressableLeft,
CribPremiumSubheaderText
} from './profileStyle';

import { EXTRALIGHT, LIGHTGREY, GOOGLEBLUE, DARKGREY } from '../../../sharedUtils';


export default function ProfileScreen({navigation}){
    const appState = useRef(AppState.currentState);
    const insets = useSafeAreaInsets();
    const scrollviewRef = useRef(null)
    const {USERID, user} = useContext(UserContext);

    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState(null)
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const translation = useRef(new Animated.Value(0)).current;

    const [userData, setUserData] = useState('')
    const [firstName, setFirstName] = useState('')

    const [profilePic, setProfilePic] = useState(null)
    const [loading, setLoading] = useState(false)

    const RowOptions = [
        // {text: 'My Referral Code', icon: 'star'},
        {text: 'Edit Profile', icon: 'create', color: GOOGLEBLUE},
        {text: 'List a Property', icon: 'home', color: PRIMARYCOLOR},
        {text: 'View posted property', icon: 'search', color: 'black'},
        {text: 'View saved property', icon: 'heart', color: '#ed3413'},
        {text: 'My Referral Code', icon: 'barcode', color: '#ed3413'},
    ]

    const staticLikes = 10
    const staticViews = 12
    
   
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            
            getTokens()
            fetchFavoriteProperties()
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) 
            {
                
            }
            getTokens()
            appState.current = nextAppState;
        });
      
        return () => {
        subscription.remove();
        };
       
    }, [navigation])   

    //Retrieve user info for display and cache for later use
    async function getTokens(){
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");

            //This is to set the profile pic from cache
            let cachedProfilePic;
            try{
                cachedProfilePic = await AsyncStorage.getItem("profilePic");
                let cachedFirstName = await EncryptedStorage.getItem("firstName");
                setFirstName(cachedFirstName)
                if(cachedProfilePic != null){
                    setProfilePic(cachedProfilePic)
                }
                console.log("SETPROFILEPIC --- CACHE --- GETTOKEN")
                console.log("SETFIRSTNAME --- CACHE --- GETTOKEN")
            }
            catch{
                console.log("Error in setting profile pic from cache.")
            }
            const uid  = await EncryptedStorage.getItem("userId")
            if(accessToken != undefined && uid != undefined){
                
                //Get user favorite properties
                if(accessToken != null && uid != null){
                    fetch('https://crib-llc.herokuapp.com/users/' + uid, {
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
                        
                        if(cachedProfilePic == null){
                            setProfilePic(userData.profilePic)
                            try{
                                console.log("PROFILEPIC --- API --- GETTOKEN")
                                if(userData.profilePic != undefined && userData.profilePic != null){
                                    await AsyncStorage.setItem("profilePic", userData.profilePic);
                                }
                            }
                            catch{
                                console.log("ERROR --- PROFILE --- GETTOKEN")
                            }
                        }
                        if(userData.postedProperties != undefined && userData.postedProperties.length >= 1){
                            console.log(userData.postedProperties.length >= 1)
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
        catch{
            console.log("ERROR ---GETTOKENS")
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
                    const tempPropData = await EncryptedStorage.getItem('postedProperty')
                    
                    let compare = (tempPropData === JSON.stringify(propertyData))
                    
                    if(!compare || tempPropData == null) {
                        // console.log("UPDATE --- API --- POSTED PROPERTY")
                        try{
                            await EncryptedStorage.setItem('postedProperty', JSON.stringify(propertyData))
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
                // console.log("ERROR --- PROFILE --- FETCHPOSTEDPROPERTIES")
                alert(e)
            })
    }

    //Function: Fetch favorite properties 
    async function fetchFavoriteProperties(token){
        token = await EncryptedStorage.getItem("accessToken")
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

            //If the api data is different from the AyncStorage data
            // if(!compare){
            //     //This is that favproperties is not empty so no error later on
            //     if(data.length != 0){
            //         console.log("UPDATE --- API --- FAV PROPERTY")
            //         console.log(data)
            //         setFavoriteProperties(data);
            //         try{
            //             if(data != undefined){
            //                 await AsyncStorage.setItem("favoriteProperties", JSON.stringify(data) )
            //             }
            //         }
            //         catch{e=>{
            //             console.log("ERRROR --- PROFILE --- FETCHFAVORITEPROPERTY")
            //         }}
            //     }
            //     else{
            //         console.log("no fav")
            //         setFavoriteProperties([])
            //     }
            // }
            // else{ // The api and cache data is the same
            //     // console.log("UPDATE --- CACHE --- FAV PROPERTY")
            //     console.log("no faddv")
            //     setFavoriteProperties(data)
            // }
            setFavoriteProperties(data)
        })
    }

    //Function to post properties, only if user have no properties 
    async function toPostProperty(){
              
        if(userData.postedProperties.length > 0){
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

    async function pressOption(name){
        
        if(name == "Edit Profile"){
            navigation.navigate("ProfileEdit", {userData : userData})
        }
        else if(name == "List a Property"){
            toPostProperty()
        }
        else if(name == "View posted property"){
            navigation.navigate("PostedProperty", {postedProperties:postedProperties, userData: userData})
        }
        else if(name == "View saved property"){
            navigation.navigate("FavoriteProperty", {favoriteProperties: favoriteProperties})
        }
        else if(name == "My Referral Code"){
            // const at = await EncryptedStorage.getItem("accessToken")
            // console.log(at)
            navigation.navigate("MyReferralCode", {userData : userData})
        }
      
    }
    return(
        <StyledView style={{backgroundColor:'white', flex: 1}} insets={insets}>
        {USERID != null ? 
        <View>
            <HeaderContainer>
                <ImageContainer>
                    <ActivityIndicator animating={loading}  size='small' color={DARKGREY} />
                    <FastImage onLoadStart={()=> setLoading(true)}  onLoadEnd={()=>setLoading(false)} source={{uri: profilePic, priority: FastImage.priority.high}} style={{height:'100%', width:'100%', borderRadius:WIDTH*0.125, position:'absolute'}}/>
                </ImageContainer>
                <NameDateContainer>
                    {userData?.cribPremium?.paymentDetails?.status ?
                    <NameText style={{color: '#FFD700'}}>Premium Connect</NameText>
                    :
                    <NameText style={{color: '#D9D9D9'}}>Regular Member</NameText>
                    }
                    <NameText>{firstName}</NameText>
                    <JoinedDateText>Joined 2023</JoinedDateText>
                </NameDateContainer>
                <SettingContainer>
                    <Pressable hitSlop={WIDTH*0.03} onPress={()=>navigation.navigate('Setting',{propID: postedProperties?.propertyInfo._id, authyID: userData?.authy_id})}>
                        <Ionicons name='cog-outline' size={30}  color='black' />
                    </Pressable>
                </SettingContainer>
            </HeaderContainer>

            {/* <UpgradeContainer>
                <UpgradeView>
                    <UpgradeImageContainer>

                    </UpgradeImageContainer>
                    <UpgradeTextContainer>
                        <UpgradeTextHeader>Upgrade to premium</UpgradeTextHeader>
                        <UpgradeText>Be a premium member to post more than one property and use advanced filtered!</UpgradeText>
                    </UpgradeTextContainer>
                </UpgradeView>
            </UpgradeContainer> */}

            <View style={{height: HEIGHT*0.03}}/>
            <CribPremiumPressable  style={{backgroundColor: '#d4af37'}} onPress={(()=>navigation.navigate("CribConnectTenant", {userData: userData}))}>
                <CribPremiumPressableLeft>
                    <CribPremiumHeaderText>Crib Connect</CribPremiumHeaderText>
                    <CribPremiumSubheaderText>Let us do the work! {'\n'}We will find you a reliable {'\n'}tenant so you don't have to.</CribPremiumSubheaderText>
                </CribPremiumPressableLeft>
                <Lottie source={require('../../../assets/cribconnecttenantslide3.json')} autoPlay style={{width: WIDTH*0.2}}/>
            </CribPremiumPressable>
            <View style={{height: HEIGHT*0.015}}/>
            {postedProperties == undefined ? (<CribPremiumPressable onPress={toPostProperty}>
                <CribPremiumPressableLeft>
                    <CribPremiumHeaderText>Sublease your room</CribPremiumHeaderText>
                    <CribPremiumSubheaderText>Stop paying for an empty {'\n'}room so you can spend it {'\n'}somewhere else!</CribPremiumSubheaderText>
                </CribPremiumPressableLeft>
                <Lottie source={require('../../../assets/cibprofilepremium.json')} autoPlay style={{width: WIDTH*0.25}}/>
            </CribPremiumPressable>)
            :
            (<CribPremiumPressable style={{height: HEIGHT*0.13}} onPress={(()=>{
                if (userData.cribPremium.status) {
                    navigation.navigate("LikeProperty")
                }else {
                    navigation.navigate("Connect", {userData: userData})
                    Alert.alert("Get Crib Connect!","Only Crib Connect users get to view property views and likes")
                }
                })}>
                <CribPremiumPressableLeft>
                    <CribPremiumHeaderText>View Your Property Likes</CribPremiumHeaderText>
                    <CribPremiumSubheaderText>Your posted property has {staticViews} {'\n'}views and {staticLikes} likes!</CribPremiumSubheaderText>
                </CribPremiumPressableLeft>
                <Lottie source={require('../../../assets/propertyLikes.json')} autoPlay style={{width: WIDTH*0.16}}/>
            </CribPremiumPressable>)}
            
            <View style={{height: HEIGHT*0.025}}/>


            <OptionContainer>
                {RowOptions.map((item) => (
                    <OptionRow key={item.text} onPress={()=>pressOption(item.text)}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                          <Ionicons name={item.icon} size={25} color='black'/>
                          <OptionName>{item.text}</OptionName>
                        </View>
                        <Ionicons name='chevron-forward' size={25} color= {DARKGREY}/>
                    </OptionRow>

                ))}
            </OptionContainer>
        </View>
        :

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


