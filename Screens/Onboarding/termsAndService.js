import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text,
  ScrollView
} from 'react-native';
import { User } from 'realm';


import { HEIGHT, GetFAIconWithColor, EditPagesHeaderContainer, EditPageNameContainer, EditPageBackButtonContainer, EditPageForwardButtonContainer} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, Terms, BodyContainer, HelpText } from './termsAndServiceStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function TermsAndService({navigation, route}){

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer>
                <EditPageBackButtonContainer>
                    <Pressable onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Terms and Services</Header>
                </EditPageNameContainer> 
                <EditPageForwardButtonContainer>
                   
                </EditPageForwardButtonContainer>
            </EditPagesHeaderContainer>

            <ScrollView style={{flex:1, paddingTop: HEIGHT*0.025}}>
            <RowContainer>
                    <CategoryName>Our Values</CategoryName>
                    <Terms>
                    1. Crib is a mobile application that is developed to assist in the process of subleases. We bridge the gap between people who are looking for subleases and people who are subleasing their apartment. Our vision is to provide an easy-to-use, centralized and friendly platform to achieve that goal.{"\n"}
                    </Terms>
                    <CategoryName>Guidelines</CategoryName>
                    <Terms>
                    2. Users are expected to interact mannerly and politely while using the application, violators will be subjected to further investigation and may result to account deletion if their behavior does not improve.{"\n"}
                    </Terms> 
                    <Terms>
                    3. All contents posted by users will be subject to inspection by Crib developers. Any content that violates our vision guidelines will be terminated and users will be warned. If situation does not improve, the user’s account will be permanently deleted.{"\n"}
                    </Terms>
                    <CategoryName>Liability</CategoryName>
                    <Terms>
                    4. We are not liable for any loses or damages inflected to you while using the application. Please be aware of your actions and do not give out sensitive informations to other users. Our company maintain the right to change or amend  our terms and services as needed.{"\n"}
                    </Terms>
                    <Terms>
                    5. Crib may make changes to their service or discontinue any part of the service at any time without notice. Crib makes no commitment to maintaining or updating any service.{"\n"}
                    </Terms>
            </RowContainer>
            </ScrollView>
        </SafeAreaView>
    )
}