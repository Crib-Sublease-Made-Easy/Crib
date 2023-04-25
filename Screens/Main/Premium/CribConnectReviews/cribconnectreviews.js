import React, {useRef, useState, useEffect, useContext} from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH, Header } from '../../../../sharedUtils'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, ReferralCodeHelperText, ReferralCodeText } from './cribconnectreviewsstyle'
import Clipboard from '@react-native-clipboard/clipboard';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserContext} from '../../../../UserContext'
import { CribPremiumSubheaderText } from './cribconnectreviewsstyle';

export default function CribConnectReviewsScreen({navigation}){
    return(
        <View>
            <SafeAreaView>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header>Reviews</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                <View style={{paddingTop: HEIGHT*0.035}}>
                    <CribPremiumSubheaderText>Trusted by <Text style={{fontWeight:'700', color: PRIMARYCOLOR}}>2000+</Text> students {'\n'}from over 65 schools</CribPremiumSubheaderText>
                </View>
            </SafeAreaView>
        </View>
    )
}