import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View,
  Text
} from 'react-native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, BodyContainer, HelpText, Terms } from './termsAndServiceStyle';

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
                    <Header>Privacy</Header>
                </NameContainer>
            </HeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>
            <RowContainer>
                    <Terms>
                    By using Crib, you signify your acceptance of this Privacy Policy. If you do not agree to the terms of this privacy policy, please do not use Crib.
                    </Terms>
                    <Terms>
                    1. We collect personally identifiable information, such as your name, email address, phone number, gender, school and occupation, and other information you directly give us on our App. Any of the information that you provide us may be publicly displayed on our platform.{"\n"}
                    </Terms>
                    <Terms>
                    2. We do automatically log usage data and client information, such as time visited, tokens used, pages you viewed, how long you spent on a page, access times, internet protocol address, actions your perform, and other information about your use of and actions on our platform.
{"\n"}
                    </Terms> 
                    <Terms>
                    3. You can contribute to Crib in several different ways, including uploading photos, engaging in chats, posting properties, creating a public profile, and viewing other posted properties. We may store these contributions on our server and display them to other users. Note that if you include Personal Information in your profile, it can be used and viewed by other users of Crib. We are not responsible for the information you choose to include in your public profile.{"\n"}
                    </Terms>
                    <Terms>
                    4. You may not disclose to us the personal information of another person by directly creating an account for them or indirectly disclosing their information in some other way.{"\n"}
                    </Terms>
                    <Terms>
                    5. We allow property owners/management firms that list their properties on our app access to your personal information by only for the purpose of and to the extent necessary to connect users with property listings.{"\n"}
                    </Terms>
            </RowContainer>
           
           
        </SafeAreaView>
    )
}