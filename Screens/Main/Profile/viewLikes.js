import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import {
    ScrollView,
    Text,
    View,
    Dimensions,
    Image,
    Animated as RNAnimated,
    SafeAreaView,
    Pressable,
    Linking
} from 'react-native';
import BadgeView from './badgeView';
import FastImage from 'react-native-fast-image'

import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MapView, { Marker } from 'react-native-maps';

import { UserContext } from '../../../UserContext'
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, MEDIUMGREY, LIGHTGREY } from '../../../sharedUtils';
import {
    Section, TypeLocationContainer, TypeLocationFavoriteContainer, CardSectionOne, CardTitle, LocationDistanceContainer,
    LocationText, FavoriteContainer, CardSectionTwo, InfoHeaderText,
    InfoContainer, InfoText, AmenitiesItem, Footer, Subheading,
    PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
    DateContainer, DateText, DescriptionContainer, AmenitiesText, TypeText, BedContainer,
    BedTopContainer, BedNumberText, BedroomNameText, TenantNameText, InfoHeaderTextAndCenter,
    StickyHeaderContainer, StickyHeaderIcon, BedBathDateContainer, BedBathText, DescriptionText, DistanceText, RowContainer, TenantInformationContainer, TenantProfileImageContainr, TenantNameScollOccupationContainer, AmenitiesContainer
} from '../Discover/discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import { DatePriceText, DefaultPostFavText, EditPropertyPressable, EditText, PostedPropertyHeader, PostedPropertyInfoContainer, PostView, PriceEditContainer, PropertyName } from './favPropertyStyle';
import viewIcon from '../../../assets/view.png';
import likeIcon from '../../../assets/heart.png';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;
const likeUsers = [
    { "__v": 0, "_id": "635884058cca31e65c64df21", 
    "authy_id": 693716679, 
    "liked": true,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df22", 
    "authy_id": 693716679, 
    "liked": true,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df23", 
    "authy_id": 693716679, 
    "liked": false,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df24", 
    "authy_id": 693716679, 
    "liked":false,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df25", 
    "authy_id": 693716679, 
    "liked": true,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://crib-llc.herokuapp.com/users/profileImages/2aa3c45989fcaa4050698112ef0f4739170ea4649a1f216457370cb79dd26299", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df26", 
    "authy_id": 693716679, 
    "liked": false,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df27", 
    "authy_id": 693716679, 
    "liked": true,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df28", 
    "authy_id": 693716679, 
    "liked": false,
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "referredBy": null, "school": "UW-Madison" }, 
    { "__v": 0, "_id": "635884058cca31e65c64df29", 
    "authy_id": 693716679,
    "liked": true, 
    "cribPremium": { "paymentDetails": { "paymentLink": null, "status": false }, "referred": [] }, 
    "dob": "986258831000", "email": "ahmirza@wisc.edu", 
    "favoriteProperties": ["638b7a09fa4b87de7a9bebee", "642c059ea86d011aa438e729"], 
    "firstName": "Hadeid", "gender": "Male", "lastActive": "2023-04-20T23:54:24.309Z", 
    "profilePic": "https://picsum.photos/200", "referralCode": null, 
    "lastName": "M", "occupation": "", "oneSignalUserId": "ee572aec-0aba-4856-b391-8439ff3ce53a", 
    "phoneNumber": 6089494233, "postedProperties": ["643ddac7bc47b05b614cb649"], 
    "referredBy": null, "school": "UW-Madison" }, 


]
export default function ViewLikeScreen({ navigation, route }) {

    return (
        // <Text>Likes</Text>
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
                        Likes & Views
                    </PostedPropertyHeader>
                </View>

                <View style={{flex: 1}}>
                {likeUsers != undefined && likeUsers.length == 0 ?
                 <Pressable style={{width:WIDTH, height:'100%',alignItems:'center',justifyContent:'center'}} onPress={()=> navigation.navigate("Discover")}>
                 {/* <Lottie source={require('../../../likeanimation.json')} autoPlay loop={20}  style={{width:WIDTH*0.4, height: WIDTH*0.4, }}/> */}
                 <DefaultPostFavText>No likes yet. Start posting...</ DefaultPostFavText>
                 </Pressable>
                :
                <FlatList 
                alwaysBounceVertical
                snapToAlignment="center"
                snapToInterval={WIDTH}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                bounces={false}
              
                data={likeUsers}
                renderItem={({item})=>(
                    <TenantInformationContainer style={{paddingHorizontal:WIDTH*0.06, paddingVertical:WIDTH*0.02}}>
                    <TenantProfileImageContainr>
                        <BadgeView parentView={
                            <Image source={{uri:item.profilePic}} style={{height:WIDTH*0.2, width:WIDTH*0.2, borderRadius:WIDTH*0.1, backgroundColor:LIGHTGREY,  }}/>
                        } badgeImageSource={item.liked? likeIcon : viewIcon}/>
                        
                    </TenantProfileImageContainr>
                    <TenantNameScollOccupationContainer>
                        <TenantNameText>{item.firstName} {item.lastName}</TenantNameText>
                        {item.school != "" &&
                        <TenantNameText>{item.school} </TenantNameText>
                        }
                        {item.occupation != "" &&
                        <TenantNameText>{item.occupation}</TenantNameText>
                        }
                    </TenantNameScollOccupationContainer>
                    
                </TenantInformationContainer>
                )}
                />
                }
                </View>
               
            </SafeAreaView>
        </View>
    )


}        