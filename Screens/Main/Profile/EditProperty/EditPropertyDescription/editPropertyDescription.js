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

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header,} from '../../../../../sharedUtils'

import DatePicker from 'react-native-date-picker'

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, LIGHTGREY, MEDIUMGREY} from '../../../../../sharedUtils'

import { DescriptionInput, RowContainer, CategoryName } from './editPropertyDescriptionStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Router } from 'express';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
FontAwesome.loadFont()

export default function EditPropertyDescriptionScreen({navigation, route}){

    const [description, setDescription] = useState(route.params.description);

    return(
        <SafeAreaView style={{flex:1}}>
            
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
            <RowContainer >
                <CategoryName>Property Description</CategoryName>
                <DescriptionInput multiline value={description} onChangeText={(value)=>setDescription(value)}>
                        
                </DescriptionInput>
            </RowContainer>
           
        </SafeAreaView>
    )
}