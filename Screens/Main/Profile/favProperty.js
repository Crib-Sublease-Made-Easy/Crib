import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  FlatList
} from 'react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, MEDIUMGREY, LIGHTGREY } from '../../../sharedUtils';
import { WIDTH, HEIGHT } from '../../../sharedUtils';
import FastImage from 'react-native-fast-image'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DatePriceText, DefaultPostFavText, EditPropertyPressable, EditText, PostedPropertyHeader, PostedPropertyInfoContainer, PostView, PriceEditContainer, PropertyName } from './favPropertyStyle';


import { UserContext } from '../../../UserContext';

import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function FavoritePropertyScreen({navigation, route}){

    const [favoriteProperties, setFavoriteProperties] = useState()
    const {USERID, user} = useContext(UserContext);
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
        const UID = await EncryptedStorage.getItem("userId")

            if(accessToken != undefined && UID != undefined){
                
                //Get user favorite properties
                fetchFavoriteProperties(accessToken)
                
            }
        }
        catch{
            console.log("ERROR ---GETTOKENS")
        }
        
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
                        Favorite property
                    </PostedPropertyHeader>
                </View>

                <View style={{flex: 1}}>
                {favoriteProperties != undefined && favoriteProperties.length == 0 ?
                 <Pressable style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=> navigation.navigate("Discover")}>
                 {/* <Lottie source={require('../../../likeanimation.json')} autoPlay loop={20}  style={{width:WIDTH*0.4, height: WIDTH*0.4, }}/> */}
                 <DefaultPostFavText>No likes yet. Start discovering...</ DefaultPostFavText>
                 </Pressable>
                :
                    <FlatList 
                    alwaysBounceVertical
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => item.propertyInfo._id}
                    bounces={false}
                  
                    data={favoriteProperties}
                    renderItem={({item})=>(
                        <PostView onPress={()=> navigation.navigate("PropertyDetail", {data: item, uid: USERID})}>
                            <FastImage key={"defaultPropPic"}
                            source={{uri: item == null ? null : item.propertyInfo.imgList[0], priority: FastImage.priority.medium}} style={{width:WIDTH*0.9, height:HEIGHT*0.35, backgroundColor:LIGHTGREY, alignSelf:'center', borderRadius:5}}/>
                            <PostedPropertyInfoContainer>
                                <PropertyName>{item.propertyInfo.loc.streetAddr}</PropertyName>
                                <DatePriceText>{item.propertyInfo.loc.secondaryTxt}</DatePriceText>
                                <DatePriceText>
                                    {new Date(item.propertyInfo.availableFrom).toLocaleString('default', { month: 'short' })} {""}
                                    {new Date(item.propertyInfo.availableFrom).getFullYear()}
                                    {" "} - {" "}
                                    {new Date(item.propertyInfo.availableTo).toLocaleString('default', { month: 'short' })} {""}
                                    {new Date(item.propertyInfo.availableTo).getFullYear()}
                                </DatePriceText>
                                <PriceEditContainer>
                                    <PropertyName style={{color:'black'}}>${item.propertyInfo.price} / month</PropertyName>
                                    <EditPropertyPressable onPress={()=> navigation.navigate("PropertyDetail", {data: item, uid: USERID})}>
                                        <EditText>View</EditText>
                                    </EditPropertyPressable>
                                </PriceEditContainer>
                            </PostedPropertyInfoContainer>
                        </PostView>
                    )}
                    />
                }
                </View>
               
            </SafeAreaView>
        </View>
    )
}