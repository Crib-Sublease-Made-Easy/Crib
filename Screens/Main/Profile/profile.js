import React , {useContext, useState, useRef, useEffect, useCallback, useId} from 'react';
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
    PropertyName, DatePriceText, InformationContainer, IconContainer, IconsContainer,PriceEditContainer,
    EditPropertyPressable, EditText, FavPropertyCard, FavPropertyCardName, FavPropertyCardContent,
    FavPropertyCardDateText, FavPropertyCardDateContainer
 } from './profileStyle';
import { useEvent } from 'react-native-reanimated';
import { EXTRALIGHT, LIGHTGREY } from '../../../sharedUtils';
import { FlatList } from 'react-native-gesture-handler';
export default function ProfileScreen({navigation}){
    const scrollviewRef = useRef(null)
    const {user, logout} = useContext(UserContext)
    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState(null)
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const translation = useRef(new Animated.Value(0)).current;

    const [userData, setUserData] = useState('')

    const [profilePic, setProfilePic] = useState(null)

    const [propertyAddr, setPropertyAddr] = useState('');
 
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("REFRESHHHHHHH")
            getTokens()
        });
        return unsubscribe; 
    }, [navigation])

    async function getTokens(){
        console.log("In getTokens Function")
        const accessToken = await SecureStorage.getItem("accessToken");
        const UID = await SecureStorage.getItem("userId");
        console.log("ACCESSTOKEN")
        let cachedProfilePic = await SecureStorage.getItem("profilePic");
        if(cachedProfilePic != null){
            console.log("LOADING -- Profile Pic from cache data")
            setProfilePic(cachedProfilePic)
        }

        fetch('https://sublease-app.herokuapp.com/users/' + UID, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async userData =>{
            console.log("USERDATA" , userData)
            setUserData(userData)
            //Load API data if the cached profile pic is null
            let cachedProfilePic = await SecureStorage.getItem("profilePic");
            if(cachedProfilePic == null){
                console.log("LOADING -- Profile Pic from API data")
                await SecureStorage.setItem("profilePic", userData.profilePic);
                setProfilePic(userData.profilePic)
            }
           
                fetchPostedProperties(userData.postedProperties[0], accessToken)
            
            if(userData.favoriteProperties !== favoriteProperties){
                setFavoriteProperties([])
                userData.favoriteProperties.forEach(propID => {
                    fetchFavoriteProperties(propID, accessToken)
                });
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
                console.log("PROPERTYDATA", propertyData)
                if(propertyData.propertiesFound != "No Property found"){
                    setPostedProperties(propertyData) 
                } else {
                    setPostedProperties(null) 
                }
            })
        
            .catch(e=>{
                alert(e)
        })
    }
    const fetchFavoriteProperties = useCallback(async (id, token) => {
       
        await fetch('https://sublease-app.herokuapp.com/properties/' + id, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            }
            }) 
            .then(res => res.json()).then(propertyData =>{
                // console.log("propertyData")
               
                setFavoriteProperties(prev => [...prev, propertyData]) 
            })
            .catch(e=>{
                alert(e)
        })
    }, [profilePic])


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
                <View style={{width:WIDTH*0.35, height: WIDTH*0.35, borderRadius: WIDTH*0.175,}}>
                    <Image source={{uri: profilePic}} 
                    style={{width:WIDTH*0.35, height: WIDTH*0.35, borderRadius: WIDTH*0.175, alignSelf:'center', backgroundColor:EXTRALIGHT}} />
                </View>
                <InformationContainer>
                    <View style={{ width: WIDTH*0.5, justifyContent: 'flex-start'}}>
                        <NameText>{userData.firstName} {""} {userData.lastName}</NameText>
                    </View>
                    <IconsContainer>
                        <IconContainer onPress={()=> navigation.navigate("ProfileEdit", {userData : userData})}>
                            <Ionicons name="create"  size={25}/>
                        </IconContainer>
                        {/* <IconContainer onPress={()=> navigation.reset({index: 0 , routes: [{ name: 'PropertyPosting'}]} )}> */}
                        <IconContainer onPress={()=> navigation.navigate('PropertyPosting')}>

                            <Ionicons name="home"  size={25} color={PRIMARYCOLOR}/>
                        </IconContainer>
                        <IconContainer onPress={()=> navigation.navigate("PropertyPosting")}>
                            <Ionicons name="heart"  size={25} color={PRIMARYCOLOR}/>
                        </IconContainer>
                    </IconsContainer>
                </InformationContainer>
               

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
                style={{width:WIDTH, height:HEIGHT*0.4}} scrollEnabled={false}>
                <View style={{ width:WIDTH, height:HEIGHT*0.4, justifyContent:'center', alignItems:'center'}}>
                    {postedProperties != null ?
                        <Pressable onPress={()=>navigation.navigate("PropertyDetail", {data: postedProperties, uid: userData._id})}>
                            <Image key={"defaultPropPic"}
                            source={{uri: postedProperties == [] ? null : postedProperties.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height:HEIGHT*0.25, backgroundColor:LIGHTGREY, alignSelf:'center', borderRadius:10}}/>
                            <PostedPropertyInfoContainer>
                                <PropertyName>{postedProperties.propertyInfo.loc.streetAddr} { "," } {postedProperties.propertyInfo.loc.secondaryTxt}</PropertyName>
                                <DatePriceText>
                                    {new Date(postedProperties.propertyInfo.availableFrom).getUTCMonth()}- 
                                    {new Date(postedProperties.propertyInfo.availableFrom).getFullYear()}
                                    {" "} to {" "}
                                    {new Date(postedProperties.propertyInfo.availableTo).getUTCMonth()}- 
                                    {new Date(postedProperties.propertyInfo.availableTo).getFullYear()}
                                </DatePriceText>
                                <PriceEditContainer>
                                    <PropertyName style={{color:'black'}}>${postedProperties.propertyInfo.price}</PropertyName>
                                    <EditPropertyPressable onPress={()=>navigation.navigate("EditProperty", {propertyData: postedProperties.propertyInfo})}>
                                        <EditText>Edit</EditText>
                                    </EditPropertyPressable>
                                </PriceEditContainer>
                            </PostedPropertyInfoContainer>
                        </Pressable>
                    :
                        <Pressable style={{width:WIDTH, height:'100%', alignItems:'center', justifyContent:'center'}}
                            onPress={()=>navigation.reset(index=0, route=[{name: 'PropertyPosting'}] )}>
                            <Image source={require('../../../assets/PostedHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            {/* <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                            backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                            </Pressable> */}
                            <Text>{postedProperties != null}</Text>
                        </Pressable>
                    }
                </View>
                <View style={{width:WIDTH, height:HEIGHT*0.45, }}>
                    {favoriteProperties.length == 0 ?
                        <View style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../../assets/FavHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            <DefaultPostFavText>You haven't liked any properties yet...</ DefaultPostFavText>
                        </View>
                        :
                        <ScrollView contentContainerStyle={{alignSelf:'center'}}
                        style={{alignSelf:'center',}} showsVerticalScrollIndicator={false}>
                            {favoriteProperties.map((item)=>(
                            <FavPropertyCard key={item.propertyInfo._id}>
                                <Pressable style={{width:'30%', height:'100%', borderRadius:10}} onPress={()=> navigation.navigate("PropertyDetail", {data: item})}>
                                <Image source={{uri: item.propertyInfo.imgList[0]}} 
                                style={{width:'100%', height:'100%', borderRadius:10}}/>
                                </Pressable>
                                <FavPropertyCardContent onPress={()=> navigation.navigate("PropertyDetail", {data: item, uid: userData._id})}>
                                    <FavPropertyCardName>{item.propertyInfo.loc.streetAddr}</FavPropertyCardName>
                                    <FavPropertyCardDateContainer>
                                        <FavPropertyCardDateText>
                                            {new Date(item.propertyInfo.availableFrom).toLocaleDateString()}
                                        </FavPropertyCardDateText>
                                        <Ionicons name="arrow-forward-outline" size={15} />
                                        <FavPropertyCardDateText>
                                            {new Date(item.propertyInfo.availableTo).toLocaleDateString()}
                                        </FavPropertyCardDateText>
                                    </FavPropertyCardDateContainer>
                                    <FavPropertyCardName>$ {item.propertyInfo.price}</FavPropertyCardName>
                                </FavPropertyCardContent>
                            </FavPropertyCard>

                            ))}
                            <View style={{width:WIDTH*0.9, height: HEIGHT*0.05}}>

                            </View>
                        </ScrollView>
                        
                    }
                </View>
               
            </ScrollView>
            </Container>
        </SafeAreaView>
    )
}