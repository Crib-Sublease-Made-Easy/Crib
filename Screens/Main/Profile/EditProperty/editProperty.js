import React , {useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';
import { User } from 'realm';

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY} from '../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import PropTypesScreen from './EditPropTypeModal/propertyTypeModal';
import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    HeaderImageContainer, PropertyPhotoContainer, PhotoContainer, RowContainer, RowName, CategoryName,
    DatePriceText } from './editPropertyStyle';
import { ScrollView } from 'react-native-gesture-handler';

export default function EditPropertyScreen({navigation, route}){
    const propData = route.params.propertyData
    console.log(propData)
    const [propType, setPropType] = useState(route.params.propertyData.type)
    const [propLocation, setPropLocation] = useState(route.params.propertyData.loc.streetAddr)
    const [propPrice, setPropPrice] = useState(route.params.propertyData.price)
    const [propDateFrom, setPropDateFrom] = useState(route.params.propertyData.availableFrom)
    const [propDateTo, setPropDateTo] = useState(route.params.propertyData.availableTo)
    const [propDescription, setPropDescription] = useState(route.params.propertyData.postedBy)
    const [propAmen, setPropAmen] = useState(route.params.propertyData.amenities)
    const [headerImage, setHeaderImage] = useState(route.params.propertyData.imgList[0])

    const [typeModal, setTypeModal] = useState(false)


    // useEffect(()=>{

    // },[])
    
    return(
      
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Edit Property</Header>
                </NameContainer>
                {/* <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} >
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer> */}
            </HeaderContainer>
            <ScrollView>
            <HeaderImageContainer>
                <Image key={"defaultPropPic"} source={{ uri: headerImage}}
                    style={{ width: WIDTH * 0.9, height: HEIGHT * 0.25, borderRadius: 10, alignSelf:'center' }} />
            </HeaderImageContainer>

            <PropertyPhotoContainer >
            {propData.imgList.map((value, index)=>(
                <TouchableOpacity key={"bedroomPic" + index} onPress={() => setHeaderImage(propertyBedroomImage.uri)}>
                    <PhotoContainer >
                        <Image source={{ uri: value }}
                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                    </PhotoContainer>
                </TouchableOpacity>
            ))}
            </PropertyPhotoContainer>
            <CategoryName>Location</CategoryName>
            <RowContainer>
                <RowName>{propLocation}</RowName>
                {/* <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/> */}
            </RowContainer>
            <CategoryName>Type</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyType", {type: propData.price})}>
                <RowName>{propType}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Price</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyPrice", {price: propData.price})}>
                <RowName>$ {propPrice}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Availability</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditPropertyAvail",{from: propData.availableFrom, to: propData.availableTo})}>
                <DatePriceText>
                    {new Date(propDateFrom).getUTCMonth()}- 
                    {new Date(propDateFrom).getFullYear()}
                    {" "} to {" "}
                    {new Date(propDateTo).getUTCMonth()}- 
                    {new Date(propDateTo).getFullYear()}
                </DatePriceText>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Description</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditPropertyDescription",{description: "Hello"})}>
                <RowName>{propDescription}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Amenities</CategoryName>
            <RowContainer  onPress={()=> navigation.navigate("EditPropertyAmenities",{amenities: propData.amenities})}>
                <RowName>
                    Swimming Pool, Furnished, Wifi
                </RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
        </ScrollView>
       
        </SafeAreaView>
      
    )
}