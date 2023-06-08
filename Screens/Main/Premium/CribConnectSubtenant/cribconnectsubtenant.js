import React, {useRef, useState, useEffect, useContext} from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils';
import {Header, ProgressDots, SubmitButton, SubmitText, ProContainer, ProText, SubtitleText, PriceContainer, PriceText} from './cribconnectsubtenantstyle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, ReferralCodeHelperText, ReferralCodeText } from './cribconnectsubtenantstyle'
import Clipboard from '@react-native-clipboard/clipboard';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserContext} from '../../../../UserContext'
import { useIsFocused } from '@react-navigation/native';


const randomstring = require("randomstring");

export default function CribConnectSubtenantScreen({navigation, route}){
    console.log(route.params )
    const appState = useRef(AppState.currentState);
    const {sb, USERID} = useContext(UserContext);
    const [loading, setLoading] = useState(false)
    // const cribPremiumDeatils = route.params.userData.cribPremium;
    // const [referralCode, setReferralCode] = useState(route.params.userData.referralCode)
    const [codeCopiedStatus, setCodeCopiesStatus] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const scrollviewRef = useRef(null)
    // const [cribPremium, setCribPremium] = useState(route.params.userData?.cribPremium?.paymentDetails?.status || false)
    // const [paymentLink, setPaymentLink] = useState(route.params.userData?.cribPremium?.paymentDetails?.paymentLink)
    useEffect(() => {
       
    }, []);

    async function checkIfPaid(){
        let at = await EncryptedStorage.getItem("accessToken")
        if(route.params.userData?.cribPremium?.paymentDetails?.orderId == undefined){
            return;
        }
        await fetch("https://crib-llc.herokuapp.com/payments/premium/status",{
            method: "POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + at,
            },
            body: JSON.stringify({
                orderId: route.params.userData?.cribPremium?.paymentDetails?.orderId,
                userId: USERID
            })
        })
        .then(async res=> {
            console.log(res.status)
            if(res.status == 200){
                let data = await res.json();
                if(data.order.state == "OPEN"){
                    setCribPremium(true)
                }
            }
        })
        .catch(e=>{
            console.log("ERROR  ", e)
        })
        console.log("happy")
    }


    // This changes which index (above the submit button) should be active 
    function onScroll(event){
        setActiveIdx(parseInt(event.nativeEvent.contentOffset.x/WIDTH));
    }

    //This copies the referral code to user clipboard 
    function copyReferralCode(event) {
        setCodeCopiesStatus(true)
        Clipboard.setString(referralCode)
    }

    //This checks if the user already has a premium payment link, if yes, direct to old link, if not, create and direct to new
    async function getPaymentLink(){
        setLoading(true)
        if(paymentLink!= null){
            
            const supported = await Linking.canOpenURL(paymentLink);
            if(supported){
                await Linking.openURL(paymentLink);
                navigation.goBack()
            }
        }
        else{
            //Generate random referral code
            let referralCode = randomstring.generate(7);

            //TODO CALL API
           
            const at = await EncryptedStorage.getItem("accessToken")
            await fetch("https://crib-llc.herokuapp.com/payments/premium/generatelink", {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + at,
                },
                body: JSON.stringify({
                    referralCode: referralCode,
                    userId: USERID
                })
            })
            .then(async res => {
                if(res.status == 200){
                    const data = await res.json()
                    const supported = await Linking.canOpenURL(data.payment_link.url);
                    if(supported){
                        setPaymentLink(data.payment_link.url)
                        await Linking.openURL(data.payment_link.url);
                        navigation.goBack()
                    }

                }
            })
            .catch( e => {
                setLoading(false)
                console.log("Error")
            })
        }
        setLoading(false)
    }

    return(
        <View style={{height: HEIGHT, width: WIDTH, backgroundColor:'white', position:'relative'}}>
            <SafeAreaView style={{position:'relative'}}>
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
                <ScrollView showsHorizontalScrollIndicator={false} pagingEnabled horizontal ref={scrollviewRef} onScroll={onScroll} scrollEventThrottle={16}>

                    {/* Page 1, just in case user have premium already */}

                    <View style={{width:WIDTH,paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribreferralcode.json')} loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Let us do the work</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We automatically find you subleases that fits your needs</SubtitleText>
                        </View>
                    </View>

                    {/* Page 2, this is for tenant */}
                    <View style={{width:WIDTH, paddingBottom:HEIGHT*0.1, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribreferraltenant.json')} loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Find a safe sublease</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We background check tenants so you {'\n'}don't save to worry</SubtitleText>
                        </View>
                    </View>
                    {/* Page 3, this is for subtenant */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribreferralsubtenant.json')} autoPlay style={{height: WIDTH*0.6, marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Save thousands right now</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We compare prices and offer you the best options possible</SubtitleText>
                        </View>
                    </View>
                </ScrollView>
                <View style={{width:WIDTH*0.15, flexDirection:'row', justifyContent:'space-between', alignSelf:'center'}}>
                    <ProgressDots style={{backgroundColor: activeIdx == 0 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 1 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 2 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                </View>
            </SafeAreaView>
            <PriceContainer>
                <PriceText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>Just</Text> $9.99</PriceText>
                <SubtitleText style={{marginTop: HEIGHT*0.015}}>If we can’t find you a suitable sublease, {'\n'}<Text style={{textDecorationLine:'underline', textDecorationColor: PRIMARYCOLOR}}>Money back</Text> guaranteed!</SubtitleText>
            </PriceContainer>
            <View style={{position:'absolute', bottom: HEIGHT*0.075, alignSelf:'center'}}>
                {codeCopiedStatus &&
                <ReferralCodeHelperText>Code copied!</ReferralCodeHelperText>
                } 
                <SubmitButton>
                    <SubmitText>GET CRIB CONNECT</SubmitText>
                </SubmitButton>
            </View>
        </View>
    )
} 