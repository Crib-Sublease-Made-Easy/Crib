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
  Animated,
  Share
} from 'react-native';
import { UserContext } from '../../../UserContext';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PRIMARYCOLOR, Header, HeaderContainer,BackButtonContainer, NameContainer, ResetButtonContainer  } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()




import {Container, NameText, OccupationText,EditProfilePressable,SlidingContainer,
    PostContainer, FavContainer, PostedText, FavText,  DefaultPostFavText, PostedPropertyInfoContainer,
    PropertyName, DatePriceText, InformationContainer, IconContainer, IconsContainer,PriceEditContainer,
    EditPropertyPressable, EditText, FavPropertyCard, FavPropertyCardName, FavPropertyCardContent,
    FavPropertyCardDateText, FavPropertyCardDateContainer, PostedPropertyCard, HeaderIndividualContainer,
    RowContainer, RowItemName
 } from './profileStyle';
import { EXTRALIGHT, LIGHTGREY, GOOGLEBLUE, MEDIUMGREY, DARKGREY } from '../../../sharedUtils';
export default function ProfileScreen({navigation}){
    const scrollviewRef = useRef(null)
    const {USERID} = useContext(UserContext);

    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState(null)
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const translation = useRef(new Animated.Value(0)).current;

    const [userData, setUserData] = useState('')

    const [profilePic, setProfilePic] = useState(null)

    var tempFavProp = []
 
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("REFRESH --- USEEFFECT")
            getTokens()
        });
        return unsubscribe; 
    }, [navigation])

    const onShare = async () => {
        try {
          const result = await Share.share({
            // message:
            //   'Lighthouse | An app to find short term housing solutions made easy',
              url: 'https://apps.apple.com/us/app/google-chrome/id535886823https://apps.apple.com/us/app/google-chrome/id535886823'
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


    async function getTokens(){

        
        const accessToken = await SecureStorage.getItem("accessToken");

        fetchFavoriteProperties(accessToken)
        fetch('https://sublease-app.herokuapp.com/users/' + USERID, {
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
                    await AsyncStorage.setItem("profilePic", userData.profilePic);
                }
            }
            // let cachedFavoriteProperties = await AsyncStorage.getItem("favoriteProperties")
            // let cachedFavoritePropertiesId = await AsyncStorage.getItem("favoritePropertiesId")
            // let compare = new Object(JSON.parse(cachedFavoritePropertiesId)).toString() == userData.favoriteProperties;
            
            // if(cachedFavoriteProperties == null || !compare){
            //     console.log("UPDATE --- API --- favoriteProperties")
            //     setFavoriteProperties([])
            //     await AsyncStorage.removeItem('favoriteProperties')
            //     await AsyncStorage.removeItem('favoritePropertiesId')
            //     userData.favoriteProperties.forEach(async propID => {
            //         await fetch('https://sublease-app.herokuapp.com/properties/' + propID, {
            //             method: 'GET',
            //             headers: {
            //             Accept: 'application/json',
            //             'Content-Type': 'application/json',
            //             'Authorization': 'Bearer ' + accessToken,
            //             }
            //             }) 
            //             .then( async res => await res.json()).then(propertyData =>{
                                
            //                 tempFavProp.push(propertyData)
            //                 setFavoriteProperties(prev=>[...prev, propertyData])

            //                 //testing 
                            
            //             })
            //             .catch(e=>{
            //                 alert(e)
            //         })
            //     });
                
            //     await AsyncStorage.setItem('favoriteProperties', JSON.stringify(tempFavProp))
            //     await AsyncStorage.setItem('favoritePropertiesId', JSON.stringify(userData.favoriteProperties))
                
            // }
            // else{
            //     console.log("UPDATE --- CACHE --- favoriteProperties")
            //     setFavoriteProperties(JSON.parse(cachedFavoriteProperties))
            // }

            if(userData.postedProperties != undefined){
                fetchPostedProperties(userData.postedProperties[0], accessToken)
            }

           
        })
        .catch(e=>{
            alert(e)
        })
    }
    


    async function fetchPostedProperties(id, token){
       
        await fetch('https://sublease-app.herokuapp.com/properties/' + id, {
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
                    // console.log(JSON.stringify(propertyData))
                    // console.log(tempPropData)
                    // console.log(propertyData)
                    // console.log("COMPARE", compare)
                    if(!compare || tempPropData == null) {
                        console.log("UPDATE --- API --- POSTED PROPERTY")
                        await AsyncStorage.setItem('postedProperty', JSON.stringify(propertyData))
                        if(JSON.stringify(propertyData) != {"Error": "No Property found"}){
                            setPostedProperties(propertyData)
                        }
                    }
                    else{
                        console.log("UPDATE --- CACHE --- POSTED PROPERTY")
                        setPostedProperties(JSON.parse((tempPropData)))
                    }           
                }
               
                
                
            })
        
            .catch(e=>{
                alert(e)
        })
    }
    function fetchFavoriteProperties (token){
        fetch('https://sublease-app.herokuapp.com/users/favorites/all', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            }
        }).then(res => res.json()).then(async data =>{
            //data.properties get the list of all properties
            // console.log("DATA", JSON.stringify(data))
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
                    await AsyncStorage.setItem("favoriteProperties", JSON.stringify(data) )
                }
                else{
                    setFavoriteProperties([])
                }
            }
            else{ // The api and cache data is the same
                console.log("UPDATE --- CACHE --- FAV PROPERTY")
                console.log(tempFavProp)
                setFavoriteProperties(JSON.parse(tempFavProp))
            }

        })

    }

    function toPostProperty(){
        if(userData.postedProperties.length != 0){
            alert("As a regular member, you can only post one property.")
        }
        else{
            navigation.navigate('PropertyPosting')
        }
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
            <HeaderContainer style={{borderBottomWidth: 0}}>
                <HeaderIndividualContainer style={{justifyContent:'flex-start'}}>
                    <Image source={{uri: profilePic}} 
                    style={{width:WIDTH*0.1, height: WIDTH*0.1, borderRadius: WIDTH*0.05, alignSelf:'center', backgroundColor:EXTRALIGHT}} />
                </HeaderIndividualContainer> 
                    
                <HeaderIndividualContainer>
                    <Header>{userData.firstName}</Header>
                </HeaderIndividualContainer>

                <HeaderIndividualContainer style={{justifyContent:'flex-end'}}>
                    <Pressable onPress={()=>navigation.navigate('Setting')}>
                        <Ionicons name='cog-outline' size={30} />
                    </Pressable>
                </HeaderIndividualContainer>
               
            </HeaderContainer>
            {/* <Header>
                <Pressable onPress={()=>navigation.navigate('Setting')}>
                    <Ionicons name='cog-outline' size={30} />
                </Pressable>
            </Header> */}
            <View style={{marginTop: HEIGHT*0.05}}>
                <RowContainer onPress={()=> navigation.navigate("ProfileEdit", {userData : userData})}>    
                    <Ionicons name="create"  size={30} color={GOOGLEBLUE}/>
                    <RowItemName>Edit Profile</RowItemName>
                </RowContainer>
                <RowContainer onPress={()=> toPostProperty()}>    
                    <Ionicons name="home"  size={30} color={PRIMARYCOLOR}/>
                    <RowItemName>Post a property</RowItemName>
                </RowContainer>
                <RowContainer onPress={()=> onShare()}>    
                    <Ionicons name="share"  size={30} color={DARKGREY}/>
                    <RowItemName>Share Crib</RowItemName>
                </RowContainer>
            </View>
            <Container>
                
                {/* <View style={{width:WIDTH*0.9, height: WIDTH*0.30, borderRadius: WIDTH*0.175,}}>
                    <Image source={{uri: profilePic}} 
                    style={{width:WIDTH*0.3, height: WIDTH*0.3, borderRadius: WIDTH*0.15, alignSelf:'center', backgroundColor:EXTRALIGHT}} />
                </View> */}
                
                    
                    {/* <NameText>{userData.firstName} {""} {userData.lastName}</NameText> */}

                     {/* <IconsContainer>
                        <View style={{justifyContent:"center", alignItems:"center"}}>
                        <IconContainer onPress={()=> navigation.navigate("ProfileEdit", {userData : userData})}>
                            <Ionicons name="create"  size={25} color={GOOGLEBLUE}/>
                        </IconContainer>
                        <Text style={{ padding:5}}>Edit Profile</Text>
                        </View>
                        <View style={{justifyContent:"center", alignItems:"center"}}>
                        <IconContainer onPress={()=> toPostProperty()}>

                            <Ionicons name="home"  size={25} color={PRIMARYCOLOR}/>
                        </IconContainer>
                        <Text style={{padding:5}}>List Property</Text>
                        </View>
                        <View style={{justifyContent:"center", alignItems:"center"}}>
                        <IconContainer onPress={()=> onShare()}>
                            <Ionicons name="share"  size={25} color={DARKGREY}/>
                        </IconContainer>
                        <Text style={{padding: 5}}>Share Crîb</Text>
                        </View>
                    </IconsContainer>  */}
               
                
               

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
                style={{width:WIDTH, maxHeight:HEIGHT*0.45, }} scrollEnabled={false}>
                <View style={{ width:WIDTH, alignItems:'center' , paddingVertical: HEIGHT*0.02}}>
                    {postedProperties != null ?
                        <PostedPropertyCard onPress={()=>navigation.navigate("PropertyDetail", {data: postedProperties, uid: userData._id})}>
                            <Image key={"defaultPropPic"}
                            source={{uri: postedProperties == null ? null : postedProperties.propertyInfo.imgList[0]}} style={{width:WIDTH*0.9, height:HEIGHT*0.25, backgroundColor:LIGHTGREY, alignSelf:'center', borderRadius:10}}/>
                            <PostedPropertyInfoContainer>
                                <PropertyName>{postedProperties.propertyInfo.loc.streetAddr}</PropertyName>
                                <DatePriceText>{postedProperties.propertyInfo.loc.secondaryTxt}</DatePriceText>
                                <DatePriceText>
                                    {new Date(postedProperties.propertyInfo.availableFrom).toLocaleString('default', { month: 'short' })} {""}
                                    {new Date(postedProperties.propertyInfo.availableFrom).getFullYear()}
                                    {" "} - {" "}
                                    {new Date(postedProperties.propertyInfo.availableTo).toLocaleString('default', { month: 'short' })} {""}
                                    {new Date(postedProperties.propertyInfo.availableTo).getFullYear()}
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
                        <Pressable style={{width:WIDTH, height:'100%', alignItems:'center', justifyContent:'center'}}
                            onPress={toPostProperty}>
                            <Image source={require('../../../assets/PostedHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            {/* <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                            backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                            </Pressable> */}
                            <DefaultPostFavText>Sublease in just a few steps</ DefaultPostFavText>
                        </Pressable>
                    }
                </View>
                <View style={{width:WIDTH, height:HEIGHT*0.45, }}>
                    {favoriteProperties.length == 0 ?
                        <Pressable style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=> navigation.navigate("Discover")}>
                            <Image source={require('../../../assets/FavHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            <DefaultPostFavText>Start discovering...</ DefaultPostFavText>
                        </Pressable>
                        :
                        <ScrollView contentContainerStyle={{alignSelf:'center'}}
                        style={{alignSelf:'center', width: WIDTH, paddingTop: HEIGHT*0.01}} showsVerticalScrollIndicator={false}>
                            {favoriteProperties.map((item, index)=>(
                            <FavPropertyCard key={item.propertyInfo._id + index}>
                                <Pressable style={{width:'30%', height:'100%', borderRadius:10}} onPress={()=> navigation.navigate("PropertyDetail", {data: item})}>
                                <Image source={{uri: item.propertyInfo.imgList[0]}} 
                                style={{width:'100%', height:'100%', borderTopLeftRadius:10, borderBottomLeftRadius:10}}/>
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


