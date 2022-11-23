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

import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, EditPageForwardButtonContainer} from '../../sharedUtils'

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, BodyContainer, HelpText, Terms } from './termsAndServiceStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

export default function Privacy({navigation, route}){

    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                    <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                </EditPageBackButtonContainer>
                <EditPageNameContainer>
                    <Header>Privacy</Header>
                </EditPageNameContainer>
                <EditPageForwardButtonContainer/>
            </EditPagesHeaderContainer>
          
            <ScrollView style={{flex:1, paddingTop: HEIGHT*0.025}}>
            <RowContainer>
                    <Terms style={{fontWeight: '500'}}>
                    By using Crib, you signify your acceptance of this Privacy Policy. If you do not agree to Crib's privacy policy, please do not use Crib.
                    </Terms>
                    <CategoryName>User Data</CategoryName>
                    <Terms>
                    1. We collect personally identifiable information, such as your name, email address, phone number, gender, school and occupation, and other information you directly give us on our App. Any of the information that you provide us may be publicly displayed on our platform.{"\n"}
                    </Terms>
                    <Terms>
                    2. We automatically log usage data and client information, such as time visited, tokens used, pages you viewed, how long you spent on a page, access times, internet protocol address, actions your perform, and other information about your use of and actions on our platform.
{"\n"}
                    </Terms> 
                    <CategoryName>In App Awareness</CategoryName>
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
            </ScrollView>
           
           
        </SafeAreaView>
    )
}