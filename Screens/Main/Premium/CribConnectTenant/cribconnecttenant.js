import React, {useRef, useState, useEffect, useContext} from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils';
import {Header, ProgressDots, SubmitButton, SubmitText, ProContainer, ProText, SubtitleText, PriceContainer, PriceText, PriceAndBreakDownContainer, PriceBreakDownText} from './cribconnecttenantstyle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, ReferralCodeHelperText, ReferralCodeText } from './cribconnecttenantstyle'
import Clipboard from '@react-native-clipboard/clipboard';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserContext} from '../../../../UserContext'


const randomstring = require("randomstring");

export default function CribConnectTenantScreen({navigation, route}){
    const appState = useRef(AppState.currentState);
    const {sb, USERID} = useContext(UserContext);
    const [loading, setLoading] = useState(false)
    const cribPremiumDeatils = route.params.userData?.cribPremium;
    const [referralCode, setReferralCode] = useState(route.params.userData?.referralCode)
    const [codeCopiedStatus, setCodeCopiesStatus] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const scrollviewRef = useRef(null)
    const [cribPremium, setCribPremium] = useState(route.params.userData?.cribPremium?.paymentDetails?.status || false)
    const [paymentLink, setPaymentLink] = useState(route.params.userData?.cribPremium?.paymentDetails?.paymentLink)
    const [userData, setUserData] = useState(route.params.userData == undefined ? null : route.params.userData)
    const [cribConnectPrice, setCribConnectPrice] = useState ("")
    useEffect(() => {
        getCribConnectPrice()
        // getUserData()
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData()
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
            console.log("chexking")
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) 
            {
                
            }
            getUserData();
            appState.current = nextAppState;
        });
      
        return () => {
        subscription.remove();
        };
    }, []);


    async function getCribConnectPrice(){
        await fetch('https://crib-llc.herokuapp.com/payments/premium/getprice', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({propId: route.params.userData.postedProperties[0]})
        }).then(async res => {
            console.log(res)
            if(res.status == 200){
                let data = await res.json()
                console.log(data)
                setCribConnectPrice(data)
            }
        })
    
    }

    async function getUserData(){
        let accessToken = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")

        if(accessToken != undefined && uid != undefined && accessToken != null){
            console.log("feting")
            //Get user favorite properties
            // fetchFavoriteProperties(accessToken)
        
            await fetch('https://crib-llc.herokuapp.com/users/' + uid, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                // console.log(userData)

                setUserData(userData)
                checkIfPaid(userData)

            })
            .catch(e=>{
                console.log("ERROR --- PROFILE --- GETTOKEN")
                alert(e)
            })
            
        } 
    }

    async function checkIfPaid(data){
        console.log("checking")
        let at = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")
        console.log(at)
        if(data.cribPremium?.paymentDetails?.orderId == undefined){
            console.log("undefined")
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
                orderId: data.cribPremium?.paymentDetails?.orderId,
                userId: uid
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
        let accessToken = await EncryptedStorage.getItem("accessToken")
        console.log(accessToken)

        if(accessToken == null || accessToken == undefined){
            alert("Please login or sign in to use Crib Connect!")
            navigation.navigate("Profile")
            return;
        }

        if(userData == undefined){
            navigation.navigate("Profile")
            return;
        }

        if(userData.postedProperties.length == 0){
            navigation.navigate("PropertyPosting")
            return
        }

       
        setLoading(true)
        if(paymentLink!= null){
            
            const supported = await Linking.canOpenURL(paymentLink);
            if(supported){
                await Linking.openURL(paymentLink);
                
            }
            navigation.goBack()
        }
        else{
            //Generate random referral code
            let referralCode = randomstring.generate(7);

            //TODO CALL API
           
            const at = await EncryptedStorage.getItem("accessToken")
            
            await fetch("https://crib-llc.herokuapp.com/payments/premium/generatelink", {
                // await fetch("https://crib-llc.herokuapp.com/payments/premium/generatetestinglink", {
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
               
               
                <ScrollView style={{paddingTop:cribPremium? HEIGHT*0.075: 0,}} showsHorizontalScrollIndicator={false} pagingEnabled horizontal ref={scrollviewRef} onScroll={onScroll} scrollEventThrottle={16}>

                    {/* Page 1, just in case user have premium already */}

                    <View style={{width:WIDTH,paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/test3.json')} autoPlay loop={false} style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>{route.params.prefetchInterestedNumber == undefined ? "A lot of" : route.params.prefetchInterestedNumber}</Text> people looking for subleases in {route.params.subleaseArea == undefined ? "your area" : route.params.subleaseArea} daily</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We will find and send you reliable tenants to take over your room</SubtitleText>
                        </View>
                    </View>

                    {/* Page 2, this is for tenant */}
                    <View style={{width:WIDTH, paddingBottom:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribconnectenantslide2.json')} autoPlay loop={false} style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText><Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>Verified</Text> recommended tenants</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We make sure tenants are  {'\n'}truly interested and verified so you {'\n'}don't have to waste your time</SubtitleText>
                        </View>
                    </View>
                    {/* Page 3 */}
                    <View style={{width:WIDTH, paddingBottom:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribconnecttenantslide3.json')} style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Tell us your <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>preferences</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>Only want to sublease to a college student? A specific gender? A specific age range? We got you!</SubtitleText>
                        </View>
                    </View>
                    <View style={{width:WIDTH, paddingBottom:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribconnecttenantslide4.json')} autoPlay loop={false} style={{height: WIDTH*0.5,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Timing is <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>#1</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We will find you a suitable tenant before the start of your sublease so you can save thousands</SubtitleText>
                        </View>
                    </View>
                    <View style={{width:WIDTH, paddingBottom:HEIGHT*0.05, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribconnecttenantslide5.json')} autoPlay loop style={{height: WIDTH*0.5,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Check your messages</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>We will send you a message everytime {'\n'}we found a potential match. So you can {'\n'}find the best fit!</SubtitleText>
                        </View>
                    </View>
                    {/* Page 3, this is for subtenant */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribreferralsubtenant.json')} autoPlay style={{height: WIDTH*0.5, marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Money back <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>guaranteed</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>If we can’t find a tenant before {'\n'}the start of your sublease. Money back!</SubtitleText>
                        </View>
                    </View>
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View style={{height: HEIGHT*0.275}}>
                            <Lottie source={require('../../../../assets/cribconnecttenantrefund.json')} autoPlay style={{height: WIDTH*0.5, marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>Refer 3 friends for a refund</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.01}}>Once you join Crib Connect, you will get a referral code. Refer 3 friends and get a refund once you they sign up for Crib Connect!</SubtitleText>
                        </View>
                    </View>
                </ScrollView>
                <View style={{width:WIDTH*0.275, flexDirection:'row', justifyContent:'space-between', alignSelf:'center', paddingBottom: HEIGHT*0.05}}>
                    <ProgressDots style={{backgroundColor: activeIdx == 0 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 1 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 2 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 3 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 4 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 5 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 6 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                </View>
            <View style={{marginTop: HEIGHT*0.025}}>
            {!cribPremium && 
            <View>
                <PriceContainer>
                    <PriceAndBreakDownContainer>
                        <PriceText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>Just</Text> ${Number(cribConnectPrice.price).toFixed(2)}</PriceText>
                        <Pressable onPress={()=>navigation.navigate("CribConnectPriceBreakdown", {userData:userData, cribConnectPrice: cribConnectPrice, estimatedSaving: route.params.estimatedSaving})} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                           
                            <PriceBreakDownText>Price Breakdown</PriceBreakDownText>
                           
                            <Ionicons name="arrow-forward" color={PRIMARYCOLOR}/>
                        </Pressable>
                    </PriceAndBreakDownContainer>
                    <SubtitleText style={{marginTop: HEIGHT*0.035}}>If we can't find a tenant before your sublease start date, <Text style={{textDecorationLine:'underline', textDecorationColor: PRIMARYCOLOR}}>Money back</Text>!</SubtitleText>
                </PriceContainer>

                {/* <ReferralCodeHelperText>Crib Connect must be enabled 30 days bofore start of sublease</ReferralCodeHelperText> */}
            </View>
            }
            <View>
                {!cribPremium && 
                    <SubmitButton disabled={loading} onPress={()=>getPaymentLink()}>
                    {loading?
                        <ActivityIndicator size='small' color='white' />
                    :
                        <SubmitText>GET CRIB CONNECT</SubmitText>
                    }
                    </SubmitButton>
                }
            </View>
            </View>
                
            </SafeAreaView>
        </View>
    )
} 