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



export default function EditPropertyAvailScreen({navigation, route}){
    const [availFrom, setAvailFrom] = useState( new Date(route.params.from))
    const [availTo, setAvailTo] = useState( new Date(route.params.to))
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false)
    console.log(new Date(route.params.from))
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        <HeaderContainer>
            <BackButtonContainer>
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                </Pressable>
            </BackButtonContainer>
            <NameContainer>
                <Header>Edit Availability</Header>
            </NameContainer>
            <ResetButtonContainer>
                <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} >
                    <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
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
        <DatePicker
           
            modal
            mode='date'
            open={openFrom}
            date={availFrom}
            onConfirm={(date) => {
                const correctDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
                setOpenFrom(false),
                    setAvailFrom(correctDate)
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
                const correctDate = new Date(date.getFullYear(), date.getMonth() % 12, date.getDate())
                setOpenTo(false),
                    setAvailTo(correctDate)
            }}
            onCancel={() => {
                setOpenTo(false)
            }}
        />
        </SafeAreaView>
    )
}