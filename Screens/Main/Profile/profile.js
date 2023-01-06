import React , {useContext, useState, useRef, useEffect, useCallback, useId} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Share,
  ActivityIndicator
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
PostedFavContainer,
JoinedDateText,
HeaderContainer,
ImageContainer,
NameDateContainer,
NameText,
SettingContainer,
UpgradeContainer,
UpgradeView,
UpgradeImageContainer,
UpgradeTextContainer,
UpgradeTextHeader,
UpgradeText,
OptionContainer,
OptionRow,
OptionName
} from './profileStyle';

import { EXTRALIGHT, LIGHTGREY, GOOGLEBLUE, DARKGREY } from '../../../sharedUtils';


export default function ProfileScreen({navigation}){
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
        {text: 'Edit Profile', icon: 'create', color: GOOGLEBLUE},
        {text: 'List a Property', icon: 'home', color: PRIMARYCOLOR},
        {text: 'View posted property', icon: 'search', color: 'black'},
        {text: 'View saved property', icon: 'heart', color: '#ed3413'},
    ]
   
    useEffect(()=>{
    
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()              
        });
       
        return unsubscribe; 
    }, [navigation])   

    //Retrieve user info for display and cache for later use
    async function getTokens(){
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");

            //This is to set the profile pic from cache
            let cachedProfilePic;
            try{
                cachedProfilePic = await AsyncStorage.getItem("profilePic");
                let cachedFirstName = await AsyncStorage.getItem("firstName");
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

            if(accessToken != undefined && USERID != undefined){
                
                //Get user favorite properties
                fetchFavoriteProperties(accessToken)
                if(accessToken != null && USERID != null){
                    fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
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
    async function toPostProperty(userData){
        try{
            const cachedPostedProperty = await EncryptedStorage.getItem('postedProperty')
           
            if(cachedPostedProperty != undefined){
                alert("As a regular member, you can only post one property.")
            }
            else{
                navigation.navigate('PropertyPosting')
            }
        }
        catch{

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

    function pressOption(name){
        
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

            <View style={{height: HEIGHT*0.05}}/>

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


