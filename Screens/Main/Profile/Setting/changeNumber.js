import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  Switch,
  Pressable,
  Animated,
  View
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../UserContext';


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../sharedUtils';


import Ionicons from 'react-native-vector-icons/Ionicons';



import { HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
    RowContainer, CategoryName, PhoneNumberContainer, HelpText } from './changeNumberStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function ChangeNumberScreen({navigation}){
    const [phoneNumber, setPhoneNumber] = useState('')
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Change Phone Number</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=>navigation.navigate("OTPEdit")}>
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>

            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>

            <RowContainer>
                <CategoryName>Old Phone Number</CategoryName>
                <PhoneNumberContainer editable={false} value="(608)-999-1395" />
            </RowContainer>
            <RowContainer>
                <CategoryName>New Phone Number</CategoryName>
                <PhoneNumberContainer onChangeText={(value)=> setPhoneNumber(value)}  value={phoneNumber} />
            </RowContainer>
            <HelpText>
                We will send you a one time verification code to verify this number.
            </HelpText>
        </SafeAreaView>
    )
}