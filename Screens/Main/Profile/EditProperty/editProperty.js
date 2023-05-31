import React , {setState, useContext, useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';

import Modal from "react-native-modal";

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, EXTRALIGHT, MEDIUMGREY} from '../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// FontAwesome.loadFont()

import ImagePicker from 'react-native-image-crop-picker';

import { UserContext } from '../../../../UserContext';

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    HeaderImageContainer, PropertyPhotoContainer, PhotoContainer, RowContainer, RowName, CategoryName,
    DatePriceText, DeleteContainer,DeleteText, DeletePropertyModal, DPMHeader, DPMSubHeader, YNContainer, DeletePropertyContainer } from './editPropertyStyle';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPropertyScreen({navigation, route}){

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getTokens()
        });
        return unsubscribe; 
    },[navigation, ])
    const {numOfSubtenants, setNumOfSubtenants} = useContext(UserContext);
    const [loading, setLoading] = useState(false)
    const [successfulLease, setSuccess] = useState(null)
    const [propAPIData, setPropAPIData] = useState('')
    const [propID, setPropID] = useState(route.params.propertyData._id)
    const [propType, setPropType] = useState(route.params.propertyData.type)
    const [propLocation, setPropLocation] = useState(route.params.propertyData.loc.streetAddr + " , " + route.params.propertyData.loc.secondaryTxt)
    const [propPrice, setPropPrice] = useState(route.params.propertyData.price)
    const [propDateFrom, setPropDateFrom] = useState(route.params.propertyData.availableFrom)
    const [propDateTo, setPropDateTo] = useState(route.params.propertyData.availableTo)
    const [propDescription, setPropDescription] = useState(route.params.propertyData.description)
    const [propImg, setPropImg] = useState(route.params.propertyData.imgList)
    const [propAmen, setPropAmen] = useState(route.params.propertyData.amenities)
    const [moveModal, setMoveModal] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [feedbackModalVis, setFeedbackModalVis] = useState(false)


    //User feedback

    const [propFloorplanImage, setPropFloorplanImage] = useState(null)



    async function getTokens(){
        console.log("refresh")
        const accessToken = await EncryptedStorage.getItem("accessToken");

        fetch('https://crib-llc.herokuapp.com/properties/' + route.params.propId, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        }
        }) 
        .then(res => res.json()).then(async propData =>{
            setPropAPIData(propData) 

            //Set the default varaibles 
            if(route.params.propertyData.type == undefined || propType != propData.propertyInfo.type){
                console.log("UPDATE --- API --- propType")
                setPropType(propData.propertyInfo.type)
            }
            else{
                console.log("UPDATE --- PARAMS --- propType")
            }
            if(route.params.propertyData.price == undefined || propPrice != propData.propertyInfo.price){
                console.log("UPDATE --- API --- propPrice")
                setPropPrice(propData.propertyInfo.price)
            }
            else{
                console.log("UPDATE --- PARAMS --- propPrice")
            }
            if(route.params.propertyData.propDateFrom == undefined || propDateFrom != propData.propertyInfo.availableFrom){
                console.log("UPDATE --- API --- propavailFrom")
                setPropDateFrom(propData.propertyInfo.availableFrom)
            }
            else{
                console.log("UPDATE --- PARAMS --- propavailableFrom")
            }
            if(route.params.propertyData.propDateTo == undefined != propData.propertyInfo.availableTo){
                console.log("UPDATE --- API --- propavailTo")
                setPropDateTo(propData.propertyInfo.availableTo)
            }
            else{
                console.log("UPDATE --- PARAMS --- propavailableTo")
            }
            if(route.params.propertyData.description == undefined || propDescription != propData.propertyInfo.description){
                console.log("UPDATE --- API --- propDescription")
                setPropDescription(propData.propertyInfo.description)
            }
            else{
                console.log("UPDATE --- PARAMS --- propDescription")
            }
            if(route.params.propertyData._id == undefined ||  propID != propData.propertyInfo._id){
                console.log("UPDATE --- API --- propID")
                setPropID(propData.propertyInfo._id)
            }
            else{
                console.log("UPDATE --- PARAMS --- propID")
            }
            if(route.params.propertyData.amenities == undefined || new Object(propAmen).toLocaleString() != new Object(propData.propertyInfo.amenities).toLocaleString()){
                console.log("UPDATE --- API --- propAmen")
                setPropAmen(propData.propertyInfo.amenities)
            }
            else{
                console.log("UPDATE --- PARAMS --- propAmen")
            }
            if(route.params.propertyData.imgList == undefined || new Object(propImg).toLocaleString() != new Object(propData.propertyInfo.imgList).toLocaleString()){
                console.log("UPDATE --- API --- propImg")
                setPropImg(propData.propertyInfo.imgList)
            }
            else{
                console.log("UPDATE --- PARAMS --- propImg")
            }
            //console.log(propData.propertyInfo.imgList)

        })
        .catch(e=>{
            alert(e)
        })
    }

    async function SelectPropPic(index){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        ImagePicker.openPicker({
            width: 812,
            height: 812,
            cropping:true,
            compressImageQuality: 0.8
          }).then(image => {

            const formData = new FormData();
            var array = image.path.split(".");      
            formData.append("propertyImage" , {
                uri: image.path,
                type: 'image/' + array[1],
                name: 'someName',
            }); 
            formData.append("changeIdx", index);
           
           
            fetch('https://crib-llc.herokuapp.com/properties/propertyImages/' + propID, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: formData
            })
            .then(res => res.json()).then(async data=>{
                setPropImg([...propImg.slice(0, index),data.propertyImage,...propImg.slice(index + 1),])
                await AsyncStorage.removeItem('postedProperty')
                console.log(data)
            })
            .catch((error) => {
                console.log(error)
            });
        }).catch(e=>{
            console.log("Canceled")
        })
        
        
    }   


    async function deletePropertyAlert(){
        Alert.alert(
            'Are you sure you want to delete this property?',
            'This action cannot be reversed.',
            [
              {text: 'No', onPress: () => {}, style: 'cancel'},
              {text: 'Delete', onPress: () => {setFeedbackModalVis(true)}, style: 'destructive'},
            ],
            { 
              cancelable: true 
            }
          );
    }
    async function checkSuccess() {
        Alert.alert(
            'Were you able to sublease on Crib?',
            'Let us know, help us make Crib better.',
            [
              {text: 'No', onPress: () => {
                setSuccess(true)
                deletePropertyRequest()
              }},
              {text: 'Yes', onPress: () => {
                setSuccess(false);

                deletePropertyRequest();
              }}
            ]
          );  
    }
    async function deletePropertyRequest(){
        setLoading(true)
        const accessToken = await EncryptedStorage.getItem("accessToken");

        console.log("ACCESS TOKEN ", accessToken, " PROPID ", propID)
        await fetch('https://crib-llc.herokuapp.com/properties/internal/subleased', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body:JSON.stringify({
                propId: propID
            })
        }).then(async res => {
           
        })
        .catch((error) => {
            console.log("ERROR in registered sublease")
        });
        
        await fetch('https://crib-llc.herokuapp.com/properties/' + propID, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }
        }).then(async res => {
            await EncryptedStorage.removeItem('postedProperty');
            if(res.status == 200){
                setTimeout(()=>{
                    navigation.navigate("Profile")
                },500)
            }
            else{
                alert('Unable to delete this property. Please try again later.')
            }
            
        })
        .catch((error) => {

        });
        const UID = await EncryptedStorage.getItem("userId");
        if(UID != null && UID != undefined){
            await fetch('https://crib-llc.herokuapp.com/users/' + UID, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({
                    cribConnectSubtenants: []
                })
            }).then((res) => {
                console.log(res.status)
            })
            .catch((error) => {
    
            });
        }
        setLoading(false)

    }   

    async function editSubtenants(){

        await fetch('https://crib-llc.herokuapp.com/automation/generatesubtenantarrayforuser', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            propId: propID
        })
        }).then(async e => {
            
        })
        .catch( e => {
        console.log("Error in sending message")
        })


        navigation.goBack()
    }
    
    return(
        
        <SafeAreaView style={{flex:1, backgroundColor:'white'}} >
            <KeyboardAvoidingView behavior='position' style={{flex: 1}}>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={editSubtenants}>
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
        <ScrollView scrollEnabled={false}>
            {/* <HeaderImageContainer>
                <Image key={"defaultPropPic"} source={{ uri: headerImage}}
                    style={{ width: WIDTH * 0.9, height: HEIGHT * 0.25, borderRadius: 10, alignSelf:'center' }} />
            </HeaderImageContainer> */}
            <View style={{width:WIDTH, height: HEIGHT*0.025}}>

            </View>
            <CategoryName>Image Gallery</CategoryName>
            <PropertyPhotoContainer >
            
            <TouchableOpacity key={"imgListChange" + propImg[0]} onPress={() => SelectPropPic(0)}>
                <PhotoContainer >
                    <Image source={{ uri: propImg[0] }}
                        style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                    {/* <Text>{propertyphotoGallery[index]}</Text> */}
                </PhotoContainer>
            </TouchableOpacity>
            <TouchableOpacity key={"imgLisChange" + propImg[1]} onPress={() => SelectPropPic(1)}>
                <PhotoContainer >
                    <Image source={{ uri: propImg[ 1] }}
                        style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                    {/* <Text>{propertyphotoGallery[index]}</Text> */}
                </PhotoContainer>
            </TouchableOpacity>
            <TouchableOpacity key={"imgListChange" +propImg[2] } onPress={() => SelectPropPic(2)}>
                <PhotoContainer >
                    <Image source={{ uri: propImg[2] }}
                        style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                    {/* <Text>{propertyphotoGallery[index]}</Text> */}
                </PhotoContainer>
            </TouchableOpacity>
            <TouchableOpacity key={"imgListChange" + propImg[3]} onPress={() => SelectPropPic(3)}>
                <PhotoContainer >
                    <Image source={{ uri: propImg[3] }}
                        style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                    {/* <Text>{propertyphotoGallery[index]}</Text> */}
                </PhotoContainer>
            </TouchableOpacity>
            
            

            <TouchableOpacity key={"imgList" + "floorplan"} onPress={() => SelectPropPic(4)}>
                <PhotoContainer >
                   
                    <Image source={{ uri: propImg.length ==  4 ? null : propImg[4]  }}
                        style={{ height: '100%', width: '100%', backgroundColor: LIGHTGREY, borderRadius: 15 }} />
                   
                   
                </PhotoContainer>
            </TouchableOpacity>

            
            </PropertyPhotoContainer>
            <CategoryName>Location</CategoryName>
            <RowContainer>
                <RowName>{propLocation}</RowName>
                {/* <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/> */}
            </RowContainer>
            <CategoryName>Type</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyType", {type: propPrice, uid: propID, propertyData: route.params.propertyData })}>
                <RowName>{propType}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Price</CategoryName>
            <RowContainer onPress={()=>navigation.navigate("EditPropertyPrice", {price: propPrice, uid: propID, propertyData: route.params.propertyData})}>
                <RowName>$ {propPrice}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Availability</CategoryName>
            <RowContainer onPress={()=> {route.params.cribConnectUser ? alert("Can't adjust availability after Crib Connect payment. Please contact us!") : navigation.navigate("EditPropertyAvail",{from: propDateFrom, to: propDateTo, uid: propID, propertyData: route.params.propertyData})}}>
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
            <RowContainer onPress={()=> navigation.navigate("EditPropertyDescription",{description: propDescription, uid:propID, propertyData: route.params.propertyData})}>
                <RowName>{propDescription}</RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            <CategoryName>Amenities</CategoryName>
            <RowContainer  onPress={()=> navigation.navigate("EditPropertyAmenities",{amenities: propAmen, uid: propID, propertyData: route.params.propertyData})}>
                <RowName>
                    Select Amenities
                </RowName>
                <Ionicons name='chevron-forward-outline' size={25}  style={{paddingLeft: WIDTH*0.05}}/>
            </RowContainer>
            
        </ScrollView>
        <DeleteContainer onPress={()=> deletePropertyAlert()}>
            <DeleteText>Delete Property</DeleteText>
        </DeleteContainer>
        
        <Modal onBackdropPress={()=>{ setFeedbackModalVis(false), setMoveModal(false)}} isVisible={feedbackModalVis} backdropOpacity={0.5} style={{flex: 1, margin: 0, padding: 0,  alignItems:'center', position:'relative'}}>
       
            <DeletePropertyModal style={{marginBottom: !moveModal ? 0 : HEIGHT*0.35}}>
                <DPMHeader>Thanks for posting on Crib 🎉</DPMHeader>
                <DPMSubHeader style={{marginTop: HEIGHT*0.025, fontWeight: '600'}}>Are you able to successfully sublease?</DPMSubHeader>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: HEIGHT*0.02}}>
                    <YNContainer onPress={()=>setSuccess(true)} style={{backgroundColor: successfulLease ? PRIMARYCOLOR : EXTRALIGHT}}>
                        <DPMSubHeader style={{fontWeight: '600', color: successfulLease ? 'white' : DARKGREY}}>Yes</DPMSubHeader>

                    </YNContainer>
                    <YNContainer onPress={()=>setSuccess(false)}  style={{backgroundColor: !successfulLease && successfulLease != null ? PRIMARYCOLOR : EXTRALIGHT}}>
                        <DPMSubHeader style={{fontWeight: '600', color: !successfulLease && successfulLease != null ? 'white' : DARKGREY}}>No</DPMSubHeader>
                    </YNContainer>
                </View>
                <View style={{marginTop: HEIGHT*0.025}}>
                    <DPMSubHeader style={{fontWeight: '600'}}>
                        We are always improving. Do you have any feedback or comments?
                    </DPMSubHeader>
                    <TextInput onChangeText={(val)=>setFeedback(val)} onPressIn={()=>setMoveModal(true)} onEndEditing={()=> {Keyboard.dismiss(), setMoveModal(false)}}  multiline style={{height: HEIGHT*0.1, width: '100%', borderRadius: 5, marginTop: HEIGHT*0.015, borderWidth: 1, borderColor: MEDIUMGREY, backgroundColor: EXTRALIGHT, textAlignVertical: 'top', paddingHorizontal: WIDTH*0.025, paddingVertical:HEIGHT*0.02}}/>
                </View>

                <DeletePropertyContainer disabled={loading} onPress={deletePropertyRequest}>
                    <Text style={{color: 'white', fontWeight:'600'}}>Delete</Text>
                </DeletePropertyContainer>
            </DeletePropertyModal>

            
        </Modal>
        
        </KeyboardAvoidingView>
        </SafeAreaView>
       
      

    )
}