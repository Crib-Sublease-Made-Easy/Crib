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
  TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Lottie from 'lottie-react-native';
import { PRIMARYCOLOR, WIDTH, HEIGHT, EditPagesHeaderContainer, EditPageBackButtonContainer, EditPageNameContainer, Header, EditPageForwardButtonContainer } from '../../../../sharedUtils';
import { CribPremiumSubheaderText, PriceBreakDownText, PriceContainer, PriceText, SubtitleText } from './cribPaidMessagingStyle';

export default function CribPaidMessagingScreen({navigation}){

    return(
        <View style={{flex: 1, backgroundColor:'white'}}>
            <SafeAreaView>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                        <Header></Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                   
                </EditPagesHeaderContainer>
                <CribPremiumSubheaderText>Connect with thousands of tenants in <Text style={{fontWeight:'700', color: PRIMARYCOLOR, textDecorationLine:"underline"}}>1 click</Text></CribPremiumSubheaderText>
                <Lottie source={require('../../../../assets/cribPaidMessaging.json')}  autoPlay loop style={{width:WIDTH*0.9, height: WIDTH*0.7, alignSelf:'center', marginTop:HEIGHT*0.01}}/>
                
                <View style={{marginTop: HEIGHT*0.025}}>
                    <View>
                        <PriceContainer>
                                <View style={{width: WIDTH*0.85, alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                    <PriceText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>Just</Text> $19.99</PriceText>
                                    <PriceBreakDownText >Unlimited Messaging</PriceBreakDownText>
                                </View>
                           
                        
                            <SubtitleText style={{marginTop: HEIGHT*0.0375, fontWeight: '600', fontSize: HEIGHT*0.025}}><Text style={{fontWeight:'700', color: PRIMARYCOLOR, textDecorationLine:'underline'}}>Money back</Text> guaranteed</SubtitleText>
                            <Text style={{fontSize:HEIGHT*0.0175, alignSelf:'center', width: WIDTH*0.85, marginTop: HEIGHT*0.015}}>If we can’t find a tenant before the start of your sublease, money back guaranteed!</Text>
                        
                        </PriceContainer>

                        {/* <ReferralCodeHelperText>Crib Connect must be enabled 30 days bofore start of sublease</ReferralCodeHelperText> */}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}