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
    useEffect(() => {
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


    async function getCribConnectPrice(){
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
                if(data.order.state == "OPEN"){
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
            <SafeAreaView style={{position:'relative', flex: 1}}>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header>How it works</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer>

                        {/* <Pressable onPress={()=>navigation.navigate("CribConnectReviews")} style={{backgroundColor: '#c99200', paddingVertical: HEIGHT*0.01, paddingHorizontal: WIDTH*0.02, borderRadius:20}}>
                            <Text style={{color:'white'}}>
                                Reviews
                            </Text>
                        </Pressable> */}
                    </EditPageForwardButtonContainer>
                </EditPagesHeaderContainer>
               
               
                <ScrollView style={{paddingTop:cribPremium? HEIGHT*0.075: 0, }} showsHorizontalScrollIndicator={false} pagingEnabled horizontal ref={scrollviewRef} onScroll={onScroll} scrollEventThrottle={16}>

                    {/* Page 1, just in case user have premium already */}

                    <View style={{width:WIDTH,paddingHorizontal: WIDTH*0.05,}}>
                        <View>
                            <Lottie source={require('../../../../assets/cribtenantsubscription.json')} autoPlay  style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005, alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            
                            <TitleText>1. Enroll in Crib Connect for <Text style={{color:PRIMARYCOLOR}}>FREE</Text></TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03, }}>Post a sublease and we will find suitable tenants to take over your sublease</SubtitleText>
                        </View>
                    </View>

                    {/* Page 2, this is for tenant */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05, }}>
                        <View >
                            <Lottie source={require('../../../../assets/cribconnectenantslide2.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>2. Crib will <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>search</Text> for tenants</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>We will message you when we found a suitable tenant. Check back soon!</SubtitleText>
                        </View>
                    </View>

                    {/* Page 3 */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View>
                            <Lottie source={require('../../../../assets/cribconnecttenantrefund.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>3. <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>Connect</Text> with them</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>Get Crib Connect to message the tenant we found and future potential tenants until you found the perfect one</SubtitleText>
                        </View>
                    </View>

                    {/* Page 4 */}
                    <View style={{width:WIDTH, paddingHorizontal: WIDTH*0.05}}>
                        <View >
                            <Lottie source={require('../../../../assets/cribreferralsubtenant.json')} autoPlay loop style={{height: WIDTH*0.6,  marginTop: HEIGHT*0.005,alignSelf:'center'}}/>
                        </View>
                        <View style={{marginTop: HEIGHT*0.03}}>
                            <TitleText>4. Trusted by <Text style={{fontWeight:'800', color:PRIMARYCOLOR}}>2000+</Text> students</TitleText>
                            <SubtitleText style={{marginTop: HEIGHT*0.03}}>We have a network of 90,000 students from 75 universities with more than 400+ students joining everyday</SubtitleText>
                        </View>
                    </View>
                   
                </ScrollView>
               
            <View style={{position:'absolute', bottom:HEIGHT*0.1, alignSelf:'center',}}>
                <View style={{width:WIDTH*0.2, flexDirection:'row', justifyContent:'space-between', alignSelf:'center', paddingBottom: HEIGHT*0.05}}>
                    <ProgressDots style={{backgroundColor: activeIdx == 0 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 1 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 2 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                    <ProgressDots style={{backgroundColor: activeIdx == 3 ? PRIMARYCOLOR : '#E0E0E0'}}/>
                </View>
            {!cribPremium && 
            <View>
                <View>
                    <PriceContainer>
                        <PriceAndBreakDownContainer>
                            <PriceText><Text style={{fontWeight:'800', color: PRIMARYCOLOR}}>Just</Text> ${Number(cribConnectPrice.price).toFixed(2)}</PriceText>
                            <Pressable onPress={()=>navigation.navigate("CribConnectPriceBreakdown", {userData:userData, cribConnectPrice: cribConnectPrice, estimatedSaving: route.params.estimatedSaving})} style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            
                                <PriceBreakDownText>Price Breakdown</PriceBreakDownText>
                            
                                <Ionicons name="arrow-forward" color={PRIMARYCOLOR}/>
                            </Pressable>
                        </PriceAndBreakDownContainer>
                        {userData.cribConnectEnrolled ?
                            <SubtitleText style={{marginTop: HEIGHT*0.035}}><Text style={{fontWeight:'700', color: PRIMARYCOLOR}}>You've enrolled in Crib Connect</Text> {'\n'}<Text style={{fontSize:HEIGHT*0.0175}}>We will message you as soon as we found a suitable tenant</Text></SubtitleText>

                        :
                            <SubtitleText style={{marginTop: HEIGHT*0.035}}><Text style={{fontWeight:'700', color: PRIMARYCOLOR}}>Its FREE to enroll</Text> {'\n'}<Text style={{fontSize:HEIGHT*0.0175}}>Pay only if you want to connect with suitable tenants we found for you</Text></SubtitleText>
                        }
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