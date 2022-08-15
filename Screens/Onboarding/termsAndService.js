import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

import { UserContext } from '../../../../../UserContext'

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, BodyContainer, HelpText } from './editOccupationStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function TermsAndService({navigation, route}){

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
          <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Terms and Service</Header>
                </NameContainer>
            </HeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>
            <RowContainer>
                <BodyContainer>
                    <Text>
                    1. Crib is a mobile application that is developed to assist in the process of subleases. We bridge the gap between people who are looking for subleases and people who are subleasing their apartment. Our vision is to provide an easy-to-use, centralized and friendly platform to achieve that goal.  
                    </Text>
                    <Text>
                    2. Users are expected to interact mannerly and politely while using the application, violators will be subjected to further investigation and may result to account deletion if their behavior does not improve.
                    </Text> 
                    <Text>
                    3. All contents posted by users will be subject to inspection by Crib developers. Any content that violates our vision guidelines will be terminated and users will be warned. If situation does not improve, the user’s account will be permanently deleted.
                    </Text>
                    <Text>
                    4. We are not liable for any loses or damages inflected to you while using the application. Please be aware of your actions and do not give out sensitive informations to other users. Our company maintain the right to change or amend  our terms and services as needed.
                    </Text>
                    <Text>
                    5. Crib may make changes to their service or discontinue any part of the service at any time without notice. Crib makes no commitment to maintaining or updating any service
                    </Text>
                </BodyContainer>
            </RowContainer>
           
        </SafeAreaView>
    )
}