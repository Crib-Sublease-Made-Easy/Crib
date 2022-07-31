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

import ImagePicker from 'react-native-image-crop-picker';

import PropTypesScreen from './EditPropTypeModal/propertyTypeModal';
import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    HeaderImageContainer, PropertyPhotoContainer, PhotoContainer, RowContainer, RowName, CategoryName,
    DatePriceText } from './editPropertyStyle';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

export default function EditPropertyScreen({navigation, route}){

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });
        return unsubscribe; 
    },[navigation])
   
    // console.log(propData)

    const [propAPIData, setPropAPIData] = useState('')
    const [propID, setPropID] = useState('')
    const [propType, setPropType] = useState('')
    const [propLocation, setPropLocation] = useState('')
    const [propPrice, setPropPrice] = useState('')
    const [propDateFrom, setPropDateFrom] = useState('')
    const [propDateTo, setPropDateTo] = useState('')
    const [propDescription, setPropDescription] = useState('')
    const [propImg, setPropImg] = useState([])
    const [propAmen, setPropAmen] = useState('')
    const [headerImage, setHeaderImage] = useState(null)

    const [propFloorplanImage, setPropFloorplanImage] = useState(null)



    async function getTokens(){
        const accessToken = await SecureStorage.getItem("refreshToken");
        const UID = await SecureStorage.getItem("userId");

        fetch('https://sublease-app.herokuapp.com/properties/' + route.params.propertyData._id, {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async propData =>{
            // console.log(propData)
            setPropAPIData(propData) 

            //Set the default varaibles 
            setPropLocation(propData.propertyInfo.loc.streetAddr + " , " + propData.propertyInfo.loc.secondaryTxt)
            setPropType(propData.propertyInfo.type)
            setPropPrice(propData.propertyInfo.price)
            setPropDateFrom(propData.propertyInfo.availableFrom)
            setPropDateTo(propData.propertyInfo.availableTo)
            setPropDescription(propData.propertyInfo.description)
            setPropAmen(propData.propertyInfo.amenities)
            setPropID(propData.propertyInfo._id)
            setPropImg(propData.propertyInfo.imgList)

        })
        .catch(e=>{
            alert(e)
        })
    }

    async function SelectProfilePic(index){
        const accessToken = await SecureStorage.getItem("refreshToken");
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping:true,
            compressImageQuality: 0.3
          }).then(image => {
           

            setProfilePic(image.path)
            fetch('https://sublease-app.herokuapp.com/users/' + route.params.userData._id, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({
                    profilePic: image.path,
                })
            })
            .catch((error) => {
                if (error.code === 'E_PICKER_CANCELLED') { // here the solution
                  return false;
                }
            });
          });
        
        
    }   
    
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
            {/* <HeaderImageContainer>
                <Image key={"defaultPropPic"} source={{ uri: headerImage}}
                    style={{ width: WIDTH * 0.9, height: HEIGHT * 0.25, borderRadius: 10, alignSelf:'center' }} />
            </HeaderImageContainer> */}
            <View style={{width:WIDTH, height: HEIGHT*0.025}}>

            </View>
            <CategoryName>Image Gallery</CategoryName>
            <PropertyPhotoContainer >
            {propImg.map((value, index)=>(
                <TouchableOpacity key={"imgList" + value} onPress={() => SelectProfilePic(index)}>
                    <PhotoContainer >
                        <Image source={{ uri: value }}
                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                        {/* <Text>{propertyphotoGallery[index]}</Text> */}
                    </PhotoContainer>
                </TouchableOpacity>
            ))}
            {
                propImg.length == 4 &&

                <TouchableOpacity key={"imgList" + "floorplan"} onPress={() => SelectProfilePic(4)}>
                    <PhotoContainer >
                       {propFloorplanImage != null ?
                        <Image source={{ uri: propFloorplanImage == null ? null : setPropFloorplanImage  }}
                            style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                        :
                        <Ionicons name="add" size={20} color='white'/>
                        }
                    </PhotoContainer>
                </TouchableOpacity>

            }
            </PropertyPhotoContainer>
            <CategoryName>Location</CategoryName>
            <RowContainer>
                <RowName>{propLocation}</RowName>
                {/* <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/> */}
            </RowContainer>
            <CategoryName>Type</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyType", {type: propPrice, uid: propID })}>
                <RowName>{propType}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Price</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyPrice", {price: propPrice, uid: propID})}>
                <RowName>$ {propPrice}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Availability</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditPropertyAvail",{from: propDateFrom, to: propDateTo, uid: propID})}>
                <DatePriceText>
                    {new Date(propDateFrom).getUTCMonth()% 12 + 1}- 
                    {new Date(propDateFrom).getFullYear()}
                    {" "} to {" "}
                    {new Date(propDateTo).getUTCMonth() % 12 + 1}- 
                    {new Date(propDateTo).getFullYear()}
                </DatePriceText>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Description</CategoryName>
            <RowContainer onPress={()=> navigation.navigate("EditPropertyDescription",{description: propDescription, uid:propID})}>
                <RowName>{propDescription}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Amenities</CategoryName>
            <RowContainer  onPress={()=> navigation.navigate("EditPropertyAmenities",{amenities: propAmen, uid: propID})}>
                <RowName>
                    Select Amenities
                </RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
        </ScrollView>
       
        </SafeAreaView>
      
    )
}