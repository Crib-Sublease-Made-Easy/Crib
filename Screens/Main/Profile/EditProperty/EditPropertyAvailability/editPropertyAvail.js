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
  FlatList
} from 'react-native';


import DatePicker from 'react-native-date-picker'

import { HEIGHT, WIDTH, PRIMARYCOLOR, 
    EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import { RowContainer, CategoryName, DateContainer } from './editPropertyAvailStyle';

import EncryptedStorage from 'react-native-encrypted-storage';

export default function EditPropertyAvailScreen({navigation, route}){
    const [availFrom, setAvailFrom] = useState( new Date(route.params.from))
    const [availTo, setAvailTo] = useState( new Date(route.params.to))
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false)

    async function update(){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        fetch('https://crib-llc.herokuapp.com/properties/' + route.params.uid, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                availableFrom: availFrom,
                availableTo: availTo
            })
        })
            .then((response) => response.json()).then(data => {
                navigation.navigate('EditProperty', {propertyData: route.params.propertyData})
            })
            .catch(e => {
                console.log(e)
            })
    }
    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        <EditPagesHeaderContainer>
            <EditPageBackButtonContainer>
                <Pressable onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='black'/>
                </Pressable>
            </EditPageBackButtonContainer>
            <EditPageNameContainer>
                <Header>Property Availability</Header>
            </EditPageNameContainer> 
            <EditPageForwardButtonContainer>
                <Pressable onPress={update}>
                    <Ionicons name='checkmark-outline' size={25}color={PRIMARYCOLOR}/>
                </Pressable>
            </EditPageForwardButtonContainer>
        </EditPagesHeaderContainer>
        <RowContainer>
            <CategoryName>Available From</CategoryName>
            <DateContainer onPress={()=>setOpenFrom(true)}>
                <Text style={{color:'black'}}>
                {availFrom.toDateString()}
                </Text>
            </DateContainer>
        </RowContainer>
        <RowContainer >
            <CategoryName>Available To</CategoryName>
            <DateContainer onPress={()=>setOpenTo(true)}>
                <Text style={{color:'black'}}>
                    {availTo.toDateString()}
                </Text>
            </DateContainer>
        </RowContainer>
        <DatePicker
           
            modal
            mode='date'
            open={openFrom}
            date={availFrom}
            onConfirm={(date) => {
                if(date.getTime() +1000000< new Date().getTime()){
                   alert("Invalid available from date.")
                }
                else if(date.getTime() > availTo.getTime()){
                    alert("Avilable from cannot be after available to")
                }
                else{
                    setAvailFrom(date)
                }
                setOpenFrom(false)
                  
            }}
            onCancel={() => {
                setOpenFrom(false)
            }}
        />
        <DatePicker
            
            modal
            mode='date'
            open={openTo}
            date={availTo}
            onConfirm={(date) => {
                if(date.getTime() < new Date().getTime()){
                    alert("Invalid available to date.")
                }
                else if(date.getTime() < availFrom.getTime() + 2000000){
                    alert("Available to cannot be before available from.")
                }
                else{
                    setAvailTo(date)
                }
                setOpenTo(false)
                    
            }}
            onCancel={() => {
                setOpenTo(false)
            }}
        />
        </SafeAreaView>
    )
}