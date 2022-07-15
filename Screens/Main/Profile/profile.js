import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  Image,
  Pressable,
  Animated
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../UserContext';

import ProfileEditModal from './profileEdit';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import { Header,Container, NameText, OccupationText,EditProfilePressable,SlidingContainer,
    PostContainer, FavContainer, PostedText, FavText,  DefaultPostFavText, PostedPropertyInfoContainer,
    PropertyName, DatePriceText
 } from './profileStyle';
import { useEvent } from 'react-native-reanimated';
export default function ProfileScreen({navigation}){
    const scrollviewRef = useRef(null)
    const {user, logout} = useContext(UserContext)
    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState("")
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const [editProfileModal, setEditProfileModal] = useState(false)

    const translation = useRef(new Animated.Value(0)).current;

    const [userData, setUserData] = useState('')

    const [profilePic, setProfilePic] = useState('')

    const [propertyAddr, setPropertyAddr] = useState('');




 
    useEffect(()=>{
       getTokens()
      
    }, [])
    async function getTokens(){
        const accessToken = await SecureStorage.getItem("refreshToken");
        console.log("Access Token " + accessToken)

        const UID = await SecureStorage.getItem("userId");

        console.log("UID " + UID)
        setProfilePic(await SecureStorage.getItem("profilePic"))
        fetch('https://sublease-app.herokuapp.com/users/' + UID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(userData =>{
            setUserData(userData)
            console.log(userData)
            
           
            console.log(userData.postedProperties.length)
            if(userData.postedProperties.length != 0){
                console.log(userData.postedProperties[0])
                fetchPostedProperties(userData.postedProperties[0], accessToken)
            }
        })
        .catch(e=>{
            alert(e)
        })
    }

    async function fetchPostedProperties(id, token){
        await fetch('https://sublease-app.herokuapp.com/properties/' + id, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            }
            }) 
            .then(res => res.json()).then(propertyData =>{
                console.log("propertyData")
                console.log(propertyData)
                setPostedProperties(propertyData)
               
               
                
            })
            .catch(e=>{
                alert(e)
        })
    }

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
        <SafeAreaView style={{backgroundColor:'white'}}>
            <Header>
                <Pressable onPress={()=>navigation.navigate('Setting')}>
                    <Ionicons name='cog-outline' size={30} />
                </Pressable>
            </Header>
            <Container>
                <Image source={{uri: userData.profilePic}} 
                style={{width:WIDTH*0.35, height: WIDTH*0.35, borderRadius: WIDTH*0.175, alignSelf:'center', backgroundColor:'pink'}} />
            
                <NameText>{userData.firstName} {""} {userData.lastName}</NameText>
                <OccupationText>{userData.occupation}</OccupationText>

                {/* <EditProfilePressable onPress={()=>navigation.navigate("ProfileEdit")}>
                    <Text style={{color:'white',}}>Edit Profile</Text>
                </EditProfilePressable> */}
                <SlidingContainer>
                    <Animated.View style={{width:WIDTH*0.35, height: HEIGHT*0.05, borderRadius: 25, position:'absolute', left:WIDTH*0.05,
                     backgroundColor:PRIMARYCOLOR, opacity:0.2, transform:[{translateX: translation}]}}></Animated.View>
                    <PostContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Posted'), PressPosted()}}>
                        <FontAwesome name='home'  size={20} color={tabPressed == 'Posted' ? PRIMARYCOLOR : PRIMARYGREY}/>
                        <PostedText tabPressed={tabPressed} >Posted</PostedText>
                    </PostContainer>
                    <FavContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Fav'), PressFav()}}>
                        <FontAwesome name='heart' size={20} color={tabPressed == "Fav" ? PRIMARYCOLOR : PRIMARYGREY} />
                        <FavText tabPressed={tabPressed}>Favorite</FavText>
                    </FavContainer>
                </SlidingContainer>

            <ScrollView ref={scrollviewRef} horizontal snapToAlignment='start' snapToInterval={WIDTH} decelerationRate='fast'
                style={{width:WIDTH, height:HEIGHT*0.4}}>
                <View style={{ width:WIDTH, height:HEIGHT*0.4, justifyContent:'center', alignItems:'center'}}>
                    {postedProperties != "" ?
                        <View>
                            <Image source={{uri: postedProperties.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height:HEIGHT*0.25, backgroundColor:'red', alignSelf:'center', borderRadius:10}}/>
                            <PostedPropertyInfoContainer>
                                <PropertyName>{postedProperties.propertyInfo.loc.secondaryTxt}</PropertyName>
                                <DatePriceText>
                                    {new Date(postedProperties.propertyInfo.availableFrom).getUTCMonth()}- 
                                    {new Date(postedProperties.propertyInfo.availableFrom).getFullYear()}
                                    {" "} to {" "}
                                    {new Date(postedProperties.propertyInfo.availableTo).getUTCMonth()}- 
                                    {new Date(postedProperties.propertyInfo.availableTo).getFullYear()}
                                    </DatePriceText>
                                <PropertyName style={{color:'black'}}>${postedProperties.propertyInfo.price}</PropertyName>
                            </PostedPropertyInfoContainer>
                        </View>
                    :
                        <Pressable style={{width:WIDTH, height:'100%', alignItems:'center', justifyContent:'center'}}
                            onPress={()=>navigation.navigate('PropertyPosting')}>
                            <Image source={require('../../../assets/PostedHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            {/* <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                            backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                            </Pressable> */}
                            <Text>{postedProperties != null}</Text>
                        </Pressable>
                    }
                </View>
                <View style={{width:WIDTH, height:HEIGHT*0.3}}>
                    {favoriteProperties.length == 0 &&
                        <View style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../../assets/FavHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            <DefaultPostFavText>You haven't liked any properties yet...</ DefaultPostFavText>
                        </View>
                    }
                </View>
               
            </ScrollView>
            </Container>
        </SafeAreaView>
    )
}