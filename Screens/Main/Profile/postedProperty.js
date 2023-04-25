import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';

import Lottie from 'lottie-react-native';

import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, MEDIUMGREY, LIGHTGREY, DARKGREY } from '../../../sharedUtils';
import { WIDTH, HEIGHT} from '../../../sharedUtils';
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DatePriceText, DefaultPostFavText, EditPropertyPressable, EditText, PostedPropertyHeader, PostedPropertyInfoContainer, PostView, PriceEditContainer, PropertyName } from './postedPropertyStyle';


import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserContext } from '../../../UserContext';


export default function PostedPropertyScreen({navigation, route}){

    const [postedProperties, setPostedProperties] = useState()
    const {USERID, user} = useContext(UserContext);
    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()              
        });
        return unsubscribe; 
    }, [navigation])   

    //Retrieve user info for display and cache for later use
    async function getTokens(){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        if(accessToken != undefined && USERID != undefined && accessToken != null){
            
            //Get user favorite properties
            // fetchFavoriteProperties(accessToken)
           
            await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                // console.log(userData)
                setUserData(userData)

                //Load API data if the cached profile pic is null
                if(userData.postedProperties != undefined && userData.postedProperties.length >= 1){
                    await fetchPostedProperties(userData.postedProperties[0], accessToken)
                }
                

                setLoading(false)
                
                
                
            })
            .catch(e=>{
                console.log("ERROR --- PROFILE --- GETTOKEN")
                alert(e)
            })
            
        } 
    }
    

    //Funciton: Get user's posted proeprty
    async function fetchPostedProperties(id, token){
        console.log("oops")
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
            console.log("oops", propertyData)
            if(propertyData != undefined){
                
                //Returns no prop found when theres nothing 
                const tempPropData = await EncryptedStorage.getItem('postedProperty')
                
                let compare = (tempPropData === JSON.stringify(propertyData))
                if(!compare || tempPropData == null) {
                   
                    console.log("UPDATE --- API --- POSTED PROPERTY")
                    try{
                        await EncryptedStorage.setItem('postedProperty', JSON.stringify(propertyData))
                    }
                    catch{

                        e=>{
                            console.log(e)
                        }
                    }
                    
                  
                    setPostedProperties(propertyData)
                    
                }
                else{
                    console.log("UPDATE --- CACHE --- POSTED PROPERTY")
                    setPostedProperties(JSON.parse((tempPropData)))
                }           
            }else{
              
                setPostedProperties(null)
            }

        }).catch(e=>{
            // console.log("ERROR --- PROFILE --- FETCHPOSTEDPROPERTIES")
            alert(e)
        })
    }

    function toPostProperty(){
        console.log(userData.postedProperties)
        if(userData.postedProperties.length >= 1 ){
            alert("As a regular member, you can only post one property.")
        }
        else{
            navigation.navigate('PropertyPosting')
        }
    }

    return(
        <View style={{flex: 1, backgroundColor:'white'}}>
            <SafeAreaView style={{flex: 1}}>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer >
                        <Pressable hitSlop={WIDTH*0.025} onPress={()=>navigation.goBack()}>
                            <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                        </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer/>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                <View style={{flexDirection:'row',alignItems:'center',  width: WIDTH*0.85, justifyContent:'space-between', alignSelf:'center'}}>
                    <PostedPropertyHeader>
                        Posted property
                    </PostedPropertyHeader>
                    <Pressable hitSlop={WIDTH*0.025} onPress={toPostProperty}>
                        <Ionicons name='add-circle' size={30} color={MEDIUMGREY} />
                    </Pressable>
                </View>
                
                <View style={{flex: 1}}>
                {postedProperties != null && postedProperties != undefined ?
                    <FlatList 
                    alwaysBounceVertical
                    keyExtractor={item => item.propertyInfo._id}
                    bounces={false}
                    data={[postedProperties]}
                    renderItem={({item})=>(
                        <PostView  onPress={()=> navigation.navigate("PropertyDetail", {data: item, uid: USERID})}>
                            <FastImage key={"defaultPropPic"}
                            source={{uri: postedProperties == null ? null : postedProperties.propertyInfo.imgList[0], priority: FastImage.priority.medium}} style={{width:WIDTH*0.9, height:HEIGHT*0.35, backgroundColor:LIGHTGREY, alignSelf:'center', borderRadius:5}}/>
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
                        </PostView>
                    )}
                    />
                    :
                    !loading ?
                    <Pressable style={{width:WIDTH, height:'100%', alignItems:'center', justifyContent:'center'}}
                        onPress={toPostProperty}>
                        <Lottie source={require('../../../subleaseProperties.json')} autoPlay loop={20}  style={{width:WIDTH*0.6, height: WIDTH*0.6, }}/>
                        {/* <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                        backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                        </Pressable> */}
                        <DefaultPostFavText>Sublease in just a few steps</ DefaultPostFavText>
                    </Pressable>
                    :
                    <ActivityIndicator size="large" color={DARKGREY} style={{marginTop: HEIGHT*0.2}}/>

                }
                </View>

            </SafeAreaView>

        </View>
    )
}