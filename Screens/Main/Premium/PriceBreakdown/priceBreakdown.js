import React, {useRef, useState, useEffect, useContext} from 'react'
import {Text, View, Pressable, Linking, AppState, ActivityIndicator } from 'react-native'
import { EditPagesHeaderContainer,EditPageBackButtonContainer,EditPageNameContainer,Header, EditPageForwardButtonContainer, WIDTH, HEIGHT, PRIMARYCOLOR } from '../../../../sharedUtils'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PriceBreakdownHeader, SubtitleText, TitleText, PriceBreakdownRow, PriceRowTitle, PriceRowPrice, PriceSubtitleText, MoneyBackText, BottomContainer, SubmitText } from './priceBreakdownStyle';
import { SubmitButton } from '../CribConnectScreenStyle';
import EncryptedStorage from 'react-native-encrypted-storage';

const randomstring = require("randomstring");


export default function PriceBreakDownScreen({navigation, route}){
    console.log(route.params.cribConnectPrice.loc == "")
    const [userData, setUser] = useState(route.params.userData)
    const [paymentLink, setPaymentLink] = useState(route.params.userData?.cribPremium?.paymentDetails?.paymentLink)

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
                console.log(res.status)
                if(res.status == 200){
                    let data = await res.json();
                    let diffInAmount = Math.abs(data.order.net_amount_due_money.amount - Number(route.params.cribConnectPrice.price).toFixed(2)*1000);
                    if(diffInAmount > 5){
                        let referralCode = randomstring.generate(7);
                        console.log("gen new link");
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
                                userId: uid,
                                price: Number(route.params.cribConnectPrice.price).toFixed(2)
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
            let USERID = await EncryptedStorage.getItem("userId")
            console.log(route.params.cribConnectPrice.price)
            
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
                    price: String(Number(route.params.cribConnectPrice.price).toFixed(2))

                })
            })
            .then(async res => {
                console.log(res)
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

    const [loading, setLoading] = useState(false)
    return(
        <View style={{flex: 1, backgroundColor:'white'}}>
            <SafeAreaView>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='black'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header>Price Breakdown</Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer/>
                </EditPagesHeaderContainer>
                <View style={{marginTop: HEIGHT*0.05}}>
                    <TitleText><Text style={{fontWeight:'600', textDecorationLine:'underline', color: PRIMARYCOLOR}}>Save ${route.params.estimatedSaving}</Text> with just ${Number(route.params.cribConnectPrice.price).toFixed(2)}</TitleText>
                    <SubtitleText>Your sublease starts <Text style={{fontWeight:'600', color: PRIMARYCOLOR}}>{route.params.cribConnectPrice.days <= 1 ? "now" : `in ${route.params.cribConnectPrice.days} days`}</Text>, don't risk {'\n'}paying rent for an empty room!</SubtitleText>
                </View>

                <PriceBreakdownHeader>
                    <SubtitleText>Price Breakdown</SubtitleText>
                </PriceBreakdownHeader>
                <View style={{marginTop: HEIGHT*0.030}}>
                    <PriceBreakdownRow>
                        <PriceRowTitle>Base Price</PriceRowTitle>
                        <PriceRowPrice>${route.params.cribConnectPrice.basePrice}</PriceRowPrice>
                    </PriceBreakdownRow>
                </View>
                {route.params.cribConnectPrice.loc != undefined &&

                <View style={{marginTop: HEIGHT*0.030}}>
                    <PriceBreakdownRow>
                        <PriceRowTitle>Location</PriceRowTitle>
                        <PriceRowPrice>${Number(route.params.cribConnectPrice.locPrice).toFixed(2)}</PriceRowPrice>
                    </PriceBreakdownRow>
                    <PriceSubtitleText>
                    There are not a lot of people looking {'\n'}for subleases in {route.params.cribConnectPrice.loc}.
                    </PriceSubtitleText>
                </View>

                }
                
                {route.params.cribConnectPrice.daysToBegin != undefined &&
                    <View style={{marginTop: HEIGHT*0.03}}>
                        <PriceBreakdownRow>
                            <PriceRowTitle>Dates</PriceRowTitle>
                            <PriceRowPrice>${Number(route.params.cribConnectPrice.daysToBeginPrice).toFixed(2)}</PriceRowPrice>
                        </PriceBreakdownRow>
                        <PriceSubtitleText>
                        Sublease post is in {route.params.cribConnectPrice.daysToBegin} notice, {'\n'}sublease starts {route.params.cribConnectPrice.days <= 1 ? "now" : `in ${route.params.cribConnectPrice.days} days`}
                        </PriceSubtitleText>
                    </View>
                }
                {route.params.cribConnectPrice.daysToBegin != undefined &&
                    <View style={{marginTop: HEIGHT*0.03}}>
                        <PriceBreakdownRow>
                            <PriceRowTitle style={{color: PRIMARYCOLOR}}>Sublease soon to get better result!</PriceRowTitle>
                       </PriceBreakdownRow>
                    </View>
                }
                
            </SafeAreaView>
            <BottomContainer>
                <MoneyBackText><Text style={{fontWeight:'700', color: PRIMARYCOLOR}}>Money Back</Text> guaranteed</MoneyBackText>
                <SubtitleText style={{marginTop: HEIGHT*0.02}}>If we can’t find a tenant before your sublease start date, Money back!</SubtitleText>
                <SubmitButton disabled={loading} onPress={()=>getPaymentLink()}>
                {loading?
                    <ActivityIndicator size='small' color='white' />
                :
                    <SubmitText>GET CRIB CONNECT</SubmitText>
                }
                </SubmitButton>
            </BottomContainer>

        </View>
    )
}