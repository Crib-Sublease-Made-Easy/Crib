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

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY} from '../../../../../sharedUtils'

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
    const [flexible, setFlexible] = useState(route.params.availabilityFlexibility)

    async function update(){

        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");
            if(accessToken != undefined){{
                fetch('https://crib-llc.herokuapp.com/properties/' + route.params.uid, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken,
                    },
                    body: JSON.stringify({
                        availabilityFlexibility: flexible,
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
            }}
        }
        catch{
            alert("Error has occured!")
        }
    }
    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        <HeaderContainer>
            <BackButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                    <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                </Pressable>
            </BackButtonContainer>
            <NameContainer>
                <Header>Edit Availability</Header>
            </NameContainer>
            <ResetButtonContainer>
                <Pressable hitSlop={WIDTH*0.025} onPress={update}>
                    <Ionicons name='checkmark' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                </Pressable>
            </ResetButtonContainer>
        </HeaderContainer>
        <RowContainer>
            <CategoryName>Available From</CategoryName>
            <DateContainer onPress={()=>setOpenFrom(true)}>
                <Text>
                    {availFrom.getDate().toString() + " " + availFrom.toLocaleString("en-US", { month: "short" }).toString() + " " + availFrom.getFullYear().toString()}
                </Text>
            </DateContainer>
        </RowContainer>
        <RowContainer >
            <CategoryName>Available To</CategoryName>
            <DateContainer onPress={()=>setOpenTo(true)}>
                <Text>
                {availTo.getDate().toString() + " " + availTo.toLocaleString("en-US", { month: "short" }).toString() + " " + availTo.getFullYear().toString()}
                </Text>
            </DateContainer>
        </RowContainer>
        <RowContainer style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: HEIGHT*0.02}}>
            <CategoryName>Flexible?</CategoryName>
            <Pressable hitSlop={WIDTH*0.05} onPress={()=>setFlexible(!flexible)}>
                <Ionicons name='checkbox' color={flexible ? PRIMARYCOLOR : MEDIUMGREY} size={30} />
            </Pressable>
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