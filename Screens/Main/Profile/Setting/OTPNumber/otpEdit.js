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


import { HEIGHT, WIDTH, PRIMARYCOLOR, DARKGREY} from '../../../../../sharedUtils'

import { Heading, HeaderContainer, BackButtonContainer, NameContainer, Header, ResetButtonContainer,
        HelpText, SubtitleText} from './otpEditStyle';

const MAX_CODE_LENGTH = 6;

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


export default function OTPEditScreen({navigation}){
    const [phoneNumber, setphoneNumber] = useState('')
    const [code, setCode] = useState('')
    const [pinReady, setpinReady] = useState(false)
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <HeaderContainer>
                <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.navigate("Setting")}>
                        <Ionicons name='close-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </BackButtonContainer>
                <NameContainer>
                    <Header>Enter OTP</Header>
                </NameContainer>
                <ResetButtonContainer>
                    <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=>navigation.navigate("OTPEdit")}>
                        <Ionicons name='checkmark-done' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
                    </Pressable>
                </ResetButtonContainer>
            </HeaderContainer>
            <View style={{width:WIDTH, height: HEIGHT*0.03}}/>
            
            <Heading>Enter OTP</Heading>
            <HelpText>
                Please enter the 6 digit code sent to the number you've provided.
            </HelpText>
            <OTPInputField
                setPinReady={pinReady}
                code={code}
                setCode={setCode}
                maxLength={MAX_CODE_LENGTH}
            />
            <Pressable>
                <SubtitleText>Didn't recieve SMS?</SubtitleText>
            </Pressable>
        </SafeAreaView>
    )
}