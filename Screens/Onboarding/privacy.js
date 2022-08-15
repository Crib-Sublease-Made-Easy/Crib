import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, BodyContainer, HelpText } from './termsAndServiceStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function Privacy({navigation, route}){

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
                    1. We collect personally identifiable information, such as your name, email address, phone number, gender, school and occupation, and other information you directly give us on our App. Any of the information that you provide us may be publicly displayed on our platform.
                    </Text>
                    <Text>
                    2. Users are expected to interact mannerly and politely while using the application, violators will be subjected to further investigation and may result to account deletion if their behavior does not improve.
                    </Text> 
                    <Text>
                    3. You can contribute to Crib in several different ways, including uploading photos, engaging in chats, posting properties, creating a public profile, and viewing other posted properties. We may store these contributions on our server and display them to other users. Note that if you include Personal Information in your profile, it can be used and viewed by other users of Crib. We are not responsible for the information you choose to include in your public profile.
                    </Text>
                    <Text>
                    4. You may not disclose to us the personal information of another person by directly creating an account for them or indirectly disclosing their information in some other way.
                    </Text>
                    <Text>
                    5. We allow property owners/management firms that list their properties on our app access to your personal information by only for the purpose of and to the extent necessary to connect users with property listings.
                    </Text>
                </BodyContainer>
            </RowContainer>
           
        </SafeAreaView>
    )
}