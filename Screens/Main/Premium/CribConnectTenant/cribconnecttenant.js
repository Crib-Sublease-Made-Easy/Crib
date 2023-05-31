import React, {useRef, useState, useEffect, useContext} from 'react'
import Modal from "react-native-modal";
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';
import { DARKGREY, EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, MEDIUMGREY, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils';
import {Header, ProgressDots, SubmitButton, SubmitText, ProContainer, ProText, SubtitleText, PriceContainer, PriceText, PriceAndBreakDownContainer, PriceBreakDownText} from './cribconnecttenantstyle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { TitleText, ReferralCodeHelperText, ReferralCodeText } from './cribconnecttenantstyle'
import Clipboard from '@react-native-clipboard/clipboard';
import EncryptedStorage from 'react-native-encrypted-storage';
import {UserContext} from '../../../../UserContext'
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { getDeviceToken } from 'react-native-device-info';


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
    const [cribConnectUserNumber, setCribConnectUserNumber] = useState(0)
    const [numOfViewers, setNumOfViewers] = useState(0)
    useEffect(() => {
        getNumViewers()
        getCribConnectUserNumber()
        getCribConnectPrice()
        // getUserData()
        const unsubscribe = navigation.addListener('focus', () => {
            getUserData()
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
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


    async function getNumViewers(){
        let x = Math.floor(Math.random()*3) 
        setNumOfViewers(x)
    }


    async function getCribConnectUserNumber(){
        await fetch('https://crib-llc.herokuapp.com/payments/premium/getprice', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({propId: route.params.userData.postedProperties[0]})
        }).then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setCribConnectPrice(data)
            }
        })
    }
   

    async function getCribConnectPrice(){
        await fetch('https://crib-llc.herokuapp.com/payments/premium/getCribConnectUserNumber', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        }).then(async res => {
            if(res.status == 200){
                let data = await res.json()
                setCribConnectUserNumber(data.data)
            }
            else{
                setCribConnectUserNumber(120)
            }
        })
        .catch(e =>{
            console.log("Error")
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
        let at = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")
        if(data.cribPremium?.paymentDetails?.orderId == undefined){
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
            if(res.status == 200){
                let data = await res.json();
                if(data.order.state == "OPEN" &&  data.order.net_amount_due_money.amount == 0){
                    setCribPremium(true)
                }
            }
        })
        .catch(e=>{
            console.log("ERROR  ", e)
        })
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
        let uid = await EncryptedStorage.getItem("userId")

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
            await fetch("https://crib-llc.herokuapp.com/payments/premium/status",{
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
                body: JSON.stringify({
                    orderId: userData.cribPremium?.paymentDetails?.orderId,
                    userId: uid
                })
            })
            .then(async res=> {
                if(res.status == 200){
                    let data = await res.json();
                    let diffInAmount = Math.abs(data.order.net_amount_due_money.amount - Number(cribConnectPrice.price).toFixed(2)*1000);
                    if(diffInAmount > 5){
                        await fetch("https://crib-llc.herokuapp.com/payments/premium/generatelink", {
                            // await fetch("https://crib-llc.herokuapp.com/payments/premium/generatetestinglink", {
                            method: 'POST',
                            headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken,
                            },
                            body: JSON.stringify({
                                referralCode: referralCode,
                                userId: USERID,
                                price: Number(cribConnectPrice.price).toFixed(2)
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
                    else{
                        const supported = await Linking.canOpenURL(paymentLink);
                        if(supported){
                            await Linking.openURL(paymentLink);
                            
                        }
                        navigation.goBack()

                    }
                }
            })
            .catch(e=>{
                setLoading(false)
                console.log("ERROR  ", e)
            })
            setLoading(false)
            
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
                    userId: USERID,
                    price: Number(cribConnectPrice.price).toFixed(2)
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
                    <View style={{paddingHorizontal: WIDTH*0.025, backgroundColor:'#E2CA13', paddingVertical: HEIGHT*0.01, borderRadius:10}}>
                        <Header style={{color:'white', fontWeight:'500'}}>{cribConnectUserNumber} users used Crib Connect</Header>
                    </View>
                    </EditPageNameContainer>
                   
                </EditPagesHeaderContainer>
               
               
                <ScrollView  showsHorizontalScrollIndicator={false} pagingEnabled horizontal ref={scrollviewRef} onScroll={onScroll} scrollEventThrottle={16} >

                    {/* Page 1, just in case user have premium already */}

                    <View style={{width:WIDTH,paddingHorizontal: WIDTH*0.05,}}>
                        <View>
                            <Lottie source={require('../../../../assets/cribtenantsubscription.json')} autoPlay style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.02}}>
                            
                            <TitleText>We do <Text style={{color:PRIMARYCOLOR}}>all the work</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03, }}>We advertise your sublease in all of our groups. Instantly access contact info to thousands of users in our database. </SubtitleText>
                        </View>
                    </View>

                    {/* Page 2, this is for tenant */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05, }}>
                        <View >
                            <Lottie source={require('../../../../assets/cribconnectenantslide2.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.02}}>
                            <TitleText><Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>Get notified </Text>right away</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>We immediately recommend your sublease to all new members. Be the first post they see when they look for a sublease</SubtitleText>
                        </View>
                    </View>

                    {/* Page 3 */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View>
                            <Lottie source={require('../../../../assets/cribconnecttenantrefund.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.02}}>
                            <TitleText>Money back <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>guaranteed</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>Found a perfect tenant? Great! If we can't help you save more than what you paid for, money back guaranteed!</SubtitleText>
                        </View>
                    </View>

                    {/* Page 4 */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View >
                            <Lottie source={require('../../../../assets/cribreferralsubtenant.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.02}}>
                            <TitleText><Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>Maximize </Text>your savings</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>We prioritize tenants who can cover your entire sublease, so you can save maximize savings and spend it elsewhere.</SubtitleText>
                        </View>
                    </View>
                   
                </ScrollView>
               
                <View style={{marginTop: HEIGHT*0.035}}>
                <View style={{width:WIDTH*0.2, flexDirection:'row', justifyContent:'space-between', alignSelf:'center', paddingBottom: HEIGHT*0.025}}>
                    <ProgressDots style={{backgroundColor: activeIdx == 0 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 1 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 2 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 3 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',width: WIDTH*0.9, alignSelf:'center' }}>
                <Pressable onPress={()=>navigation.navigate("CribConnectFAQ")} style={{flexDirection: 'row', alignItems:'center', paddingVertical: 5, paddingHorizontal:10, backgroundColor: PRIMARYCOLOR, borderRadius:5, marginTop: HEIGHT*0.01}}>
                    <Ionicons name="help-circle-outline" color="white" size={HEIGHT*0.02}/>
                    <Text style={{color: 'white', fontWeight:'600', marginLeft:5}}>
                        FAQ
                    </Text>
                </Pressable>
                { numOfViewers != 0 &&
                <View style={{alignSelf:'center', flexDirection:'row', alignItems:'center', justifyContent:'flex-end' }}>
                    <Lottie source={require('../../../../assets/cribconnectfire.json')} autoPlay style={{height: WIDTH*0.075,}}/>
                   
                    <Text style={{marginTop: HEIGHT*0.01, color: DARKGREY}}><Text style={{color:PRIMARYCOLOR, fontWeight:'700'}}>{numOfViewers} {numOfViewers == 1 ? "user" : "users"}</Text> {numOfViewers == 1 ? "is viewing" : "are viewing"}</Text>
                    
                </View>
                }
                </View>
                
                {!cribPremium && 
                <View style={{marginTop: HEIGHT*0.015}}>
                    <View>
                        <PriceContainer>
                            <PriceAndBreakDownContainer>
                                <PriceText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>Just</Text> ${Number(cribConnectPrice.price).toFixed(2)}</PriceText>
                                <Pressable onPress={()=>navigation.navigate("CribConnectPriceBreakdown", {userData:userData, cribConnectPrice: cribConnectPrice, estimatedSaving: route.params.estimatedSaving})} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                
                                    <PriceBreakDownText>Price Breakdown</PriceBreakDownText>
                                
                                    <Ionicons name="arrow-forward" color={PRIMARYCOLOR}/>
                                </Pressable>
                            </PriceAndBreakDownContainer>
                        
                            <SubtitleText style={{marginTop: HEIGHT*0.0375, fontWeight: '600', fontSize: HEIGHT*0.025}}><Text style={{fontWeight:'700', color: PRIMARYCOLOR, textDecorationLine:'underline'}}>Money back</Text> guaranteed</SubtitleText>
                            <Text style={{fontSize:HEIGHT*0.0175, alignSelf:'center', width: WIDTH*0.85, marginTop: HEIGHT*0.015}}>If we can’t find a tenant for your sublease, money back guaranteed!</Text>
                        
                        </PriceContainer>

                        {/* <ReferralCodeHelperText>Crib Connect must be enabled 30 days bofore start of sublease</ReferralCodeHelperText> */}
                    </View>
                
                    
                    <SubmitButton disabled={loading} onPress={()=>getPaymentLink()}>
                    {loading?
                        <ActivityIndicator size='small' color='white' />
                    :
                        <SubmitText>GET CRIB CONNECT</SubmitText>
                    }
                    </SubmitButton>
                    
                </View>     
                }
                </View>
           
                
            </SafeAreaView>
        </View>
    )
} 