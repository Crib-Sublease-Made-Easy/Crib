import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text
} from 'react-native';
import { User } from 'realm';

import EncryptedStorage from 'react-native-encrypted-storage';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer,NameContainer, Header, ResetButtonContainer,
    RowContainerCol, AboutMeInput, CategoryName } from './editAboutMeStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function EditAboutMeScreen({navigation, route}){
    const [aboutMe, setAboutMe] = useState(route.params.userData.password)
    
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Change Education</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} >
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}} color={PRIMARYCOLOR}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <RowContainerCol>
                <CategoryName>About me</CategoryName>
                <AboutMeInput multiline value={aboutMe} onChangeText={(value)=>setAboutMe(value)}>
                    
                </AboutMeInput>
            </RowContainerCol>
        </SafeAreaView>
    )
}