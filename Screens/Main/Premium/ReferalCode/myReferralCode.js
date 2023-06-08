import React, {useRef, useState, useEffect, useContext} from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils';
import {Header, ProgressDots, SubmitButton, SubmitText, ProContainer, ProText, SubtitleText} from './myReferralCodeStyle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, ReferralCodeHelperText, ReferralCodeText } from './myReferralCodeStyle'
import Clipboard from '@react-native-clipboard/clipboard';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserContext} from '../../../../UserContext'
import { useIsFocused } from '@react-navigation/native';


const randomstring = require("randomstring");

export default function MyReferralCodeScreen({navigation, route}){
    const appState = useRef(AppState.currentState);
    const {sb, USERID} = useContext(UserContext);
    const [loading, setLoading] = useState(false)
    const cribPremiumDeatils = route.params.userData.cribPremium;
    const [referralCode, setReferralCode] = useState(route.params.userData.referralCode)
    const [codeCopiedStatus, setCodeCopiesStatus] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const scrollviewRef = useRef(null)
    const [cribPremium, setCribPremium] = useState(route.params.userData?.cribPremium?.paymentDetails?.status || false)
    const [paymentLink, setPaymentLink] = useState(route.params.userData?.cribPremium?.paymentDetails?.paymentLink)
    useEffect(() => {
        checkIfPaid()
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) 
            {
                
            }
            checkIfPaid()
            appState.current = nextAppState;
        });
      
        return () => {
        subscription.remove();
        };
        
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

          

                {/* Page 1, just in case user have premium already */}
                
                <View style={{width:WIDTH, paddingVertical:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
                    {/* { cribPremium ? 
                     <View>
                        <TitleText>Welcome back! {'\n'}Get your <Text style={{textDecorationLine:'underline', textDecorationColor: PRIMARYCOLOR}}>money back</Text> by inviting two friends.</TitleText>
                        <Lottie source={require('../../../../assets/cribreferralcode.json')} loop style={{width:WIDTH*0.8, height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>

                        <ReferralCodeHelperText style={{fontWeight: '700', color:'#545454', marginTop: HEIGHT*0.05}}>YOUR REFERRAL CODE</ReferralCodeHelperText>
                        <ReferralCodeText selectable={true} >{referralCode}</ReferralCodeText>
                        <ReferralCodeHelperText style={{fontWeight: '500', color:'#545454', marginTop: HEIGHT*0.05, width: WIDTH*0.87, alignSelf:'center', textAlign:'center'}}>Your friends can enter the referral code in settings page and you will be refunded within 2 business days</ReferralCodeHelperText>

                    </View>
                    : */}
                    <View>
                        <Lottie source={require('../../../../assets/cribreferralcode.json')} loop style={{width:WIDTH*0.8, height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        <ReferralCodeHelperText style={{fontWeight: '700', color:'#545454', marginTop: HEIGHT*0.05}}>YOUR CODE</ReferralCodeHelperText>
                        {
                            cribPremium ? 
                            <ReferralCodeText selectable={true} >{referralCode == undefined ? null : referralCode}</ReferralCodeText>
                            :
                            <>
                            <SubmitButton onPress={getPaymentLink}>
                                <SubmitText>Join Crib Connect</SubmitText>
                            </SubmitButton>
                            <ReferralCodeHelperText style={{color:'#545454', marginTop: HEIGHT*0.015}}>Only Crib Connect members have referral code</ReferralCodeHelperText>

                            </>
                        }
                        
                        <SubtitleText >Get a <Text style={{color:PRIMARYCOLOR, fontWeight:'600'}}>full refund</Text> on Crib Connect when you refer 3 friends! A refund will be issued to you once the referred user sign up for Crib Connect and input your referral code in the "Enter Referral Code" tab in settings page</SubtitleText>
                    </View>
                    
                </View>

            
            {/* // Currently is a Crib Premium member
            // <View style={{width:WIDTH, paddingVertical:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
            //     <TitleText>Welcome back! {'\n'}Get your <Text style={{textDecorationLine:'underline', textDecorationColor: PRIMARYCOLOR}}>money back</Text> by inviting two friends.</TitleText>
            //     <Lottie source={require('../../../../assets/cribreferralcode.json')} loop style={{width:WIDTH*0.8, height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>

            // <ReferralCodeText selectable={true} >{referralCode}</ReferralCodeText>
            // <ReferralCodeHelperText style={{fontWeight: '500', color:'#545454', marginTop: HEIGHT*0.05, width: WIDTH*0.87, alignSelf:'center', textAlign:'center'}}>Your friends can enter the referral code in settings page and you will be refunded within 2 business days</ReferralCodeHelperText>

            // </View> */}
            

            
            
           
            </SafeAreaView>
            {/* <View style={{position:'absolute', bottom: HEIGHT*0.075, alignSelf:'center'}}> */}
                {/* <View style={{width:WIDTH*0.15, flexDirection:'row', justifyContent:'space-between', alignSelf:'center'}}>
                    <ProgressDots style={{backgroundColor: activeIdx == 0 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 1 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 2 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                </View> */}
                {/* {codeCopiedStatus &&
                <ReferralCodeHelperText>Code copied!</ReferralCodeHelperText>
                }  */}
                {/* <SubmitButton onPress={cribPremium ? copyReferralCode :  getPaymentLink}>
                    <SubmitText>{cribPremium ? "COPY CODE" : loading ? <ActivityIndicator color='white'/> : "GET PREMIUM"}</SubmitText>
                </SubmitButton> */}
            {/* </View> */}
        </View>
    )
}