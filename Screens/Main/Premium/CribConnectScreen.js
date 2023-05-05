import * as React  from 'react';
import { useState, useContext, createContext, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  AppState,
  Touchable,
  Keyboard,
  ActivityIndicator,
  Pressable
} from 'react-native';
import Modal from "react-native-modal";

import Lottie from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import MapView , { Marker }from 'react-native-maps';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DARKGREY, HEIGHT, MEDIUMGREY, PRIMARYCOLOR, WIDTH } from '../../../sharedUtils';
import {CribConnectMatchesContainer, CribConnectMatchesText, CribConnectModal, CribConnectModalContinueButton, CribConnectModalHeading, CribConnectModalSubheading, CribConnectNotifContentText, CribConnectNotifLogoView, CribConnectNotifNameText, CribConnectNotifView, CribPremiumHeaderText, CribPremiumPaidSubheaderText, CribPremiumPressable, CribPremiumPressableLeft, CribPremiumSubheadePostingText, CribPremiumSubheaderText, CustomMarker, EstimatedSavingText, MapContainer, NumberBackground, NumberText, PreferenceLabel, PreferencesInput, ProgressDots, ReferralCodeHelperText, SubmitButton, SubmitButtonOutline, SubmitText} from './CribConnectScreenStyle'




export default function CribConnectScreen({navigation}){
    
    const mapRef = useRef(null)
    const appState = useRef(AppState.currentState);
    const [propData, setPropData] = useState(null)
    const scrollviewRef = useRef(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const [cribConnectModal, setCribConnectModal] = useState(false)
    const [userData, setUserData] = useState()
    const [subleaseArea, setSubleaseArea] = useState("your area")
    const [prefetchCribConnectInterestedNumber, setPrefetchCribConnectInterestedNumber] = useState("A lot of")
    const [cribPremium, setCribPremium] = useState(false)
    const [preference, setPreference] = useState("")
    const [estimatedSaving, setEstimatedSaving] = useState("")
    const [cribConnectSavings, setCribConnectSavings] = useState(0)

    useEffect(()=>{
        getTokens()
        const unsubscribe = navigation.addListener('focus', () => {
            showCribConnectModal()
            getTokens()
        });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) 
            {
                
            }
            getTokens()
            appState.current = nextAppState;
        });
      
        return () => {
        subscription.remove();
        };


    },[])

    async function checkSubtenantMatches(){
        if(userData != undefined && userData.cribPremium.paymentDetails.status != false){
            navigation.navigate("CribConnectSubtenantMatches", {subtenantMatches: userData.cribConnectSubtenants, paidUser: cribPremium, userData: userData})
        }
        else{
            alert("Get Crib Connect to contact interested and reliable tenants!")
            navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})
        }
    }

    async function showCribConnectModal(){
        try{
            let toShow = await EncryptedStorage.getItem("postedProperty")
            if(toShow == "true"){
                setCribConnectModal(true)        
            }
            await EncryptedStorage.removeItem("postedProperty")
        }
        catch{

        }
    }
   

    async function getTokens(){
       
        const accessToken = await EncryptedStorage.getItem("accessToken");
        let USERID = await EncryptedStorage.getItem("userId")

        
      
        if(accessToken != undefined && USERID != undefined && accessToken != null){
           
            //Get user favorite properties
            // fetchFavoriteProperties(accessToken)


           
            await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            }
            }) 
            .then(res => res.json()).then(async userData =>{
                if(userData.cribPremium.paymentDetails.status == true){
                    setCribPremium(true)
                }
                setUserData(userData)
                console.log(userData.postedProperties)
                if(userData.cribPremium.paymentDetails.status == false){
                    checkIfPaid(userData)
                }


                let lastSetInterested = await EncryptedStorage.getItem("lastSetInterested")
                let curTime = new Date().getTime()
                if(userData.postedProperties != undefined && userData.postedProperties?.length != 0){
                    await fetch('https://crib-llc.herokuapp.com/properties/' + userData.postedProperties[0], {
                    method: 'POST',
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                    },
                    body:JSON.stringify({
                        viewCount: "false"
                    })
                    }) 
                    .then(async res => {
                        if(res.status == 200){
                            const data = await res.json()
                          
                            
                            let diff = new Date(data.propertyInfo.availableTo).getTime() - new Date(data.propertyInfo.availableFrom).getTime();
                           
                            let months = diff/(1000*60*60*24*30)

                            let saving = Math.floor(months * data.propertyInfo.price)

                            setEstimatedSaving(saving)
                           
                            if(data.propertyInfo.preference != null){
                                setPreference(data.propertyInfo.preference)
                            }
                            setPropData(data)
                        }
                        
                    })
                    .catch(e=>{
                        console.log("Error")
                    })
                } 
                else{
                    setEstimatedSaving("")
                    setPrefetchCribConnectInterestedNumber("A lot of");
                    setSubleaseArea("your area")
                    if(lastSetInterested == undefined || curTime - lastSetInterested > (1000*60*60*24)){
                        //Allow set the number
                        EncryptedStorage.setItem("lastSetInterested", curTime.toString())
                    }
                }
            })
            .catch(e=>{
                console.log("ERROR --- PROFILE --- GETTOKEN")
                alert(e)
            })
            
        } 

        await fetch('https://crib-llc.herokuapp.com/payments/premium/cribConnectToalSaving', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        }) 
        .then(async res => {
            if(res.status == 200){
                let data = await res.json();
                
                setCribConnectSavings(Number(data.saving))
            }
        })

        
    }

    async function updatePreference(){
        // console.log("updating")
        // console.log(preference)
        // console.log(userData.postedProperties[0])

        navigation.navigate("CribConnectPreference", {userData: userData, preference: preference})

        // if(userData.postedProperties.length == 0){
        //     alert("Post a property first!")
        //     navigation.navigate("Profile")
        // }
        // const accessToken = await EncryptedStorage.getItem("accessToken");
      

        //     if(accessToken != undefined){
        //         fetch('https://crib-llc.herokuapp.com/properties/' + userData.postedProperties[0], {
        //             method: 'PUT',
        //             headers: {
        //                 Accept: 'application/json',
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + accessToken,
        //             },
        //             body: JSON.stringify({
        //                 preference: preference
                    
        //             })
        //         })
        //         .then(async res => {
        //             if(res.status == 200){
        //                 alert("Preference successfully updated!")
        //             }
        //             else{
        //                 alert("Error occured please try again later!")
        //             }
        //         })
        //         .catch(e => {
        //             console.log(e)
        //         })

        //     }
       
    }

    async function handleSubmitClick(){
        let at = await EncryptedStorage.getItem("accessToken")
        if(at == undefined){
            alert("Please login or sign up!")
            navigation.navigate("Profile")
            return
        }
        //Don't have a property posted
        if(userData != undefined && userData.postedProperties?.length == 0){
            navigation.navigate("PropertyPosting", {userData: userData})
            return
        }
        //Not a crib connect user yet
        else if(!cribPremium){
            let uid = await EncryptedStorage.getItem("userId")
            if(userData.cribConnectEnrolled == false){
                //Change enroll to true
                await fetch("https://crib-llc.herokuapp.com/users/enrollCribConnect",{
                    method: "POST",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: uid
                    })
                })
                .then(async res => {
                    if(res.status == 200){
                        getTokens()
                        setCribConnectModal(false)
                    }
                    else{
                        return
                    }
                })
            }
            navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})

        } 
        //Is a Crib Connect user
        else{
            updatePreference()
        }
        setCribConnectModal(false)
    }

    async function checkIfPaid(user){
        let at = await EncryptedStorage.getItem("accessToken")
        let uid = await EncryptedStorage.getItem("userId")
        if(user?.cribPremium?.paymentDetails?.orderId == undefined){
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
                orderId: user?.cribPremium?.paymentDetails?.orderId,
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
        setActiveIdx(parseInt(event.nativeEvent.contentOffset.x/(WIDTH*0.8)));
    }

    return(
        <View style={{height: HEIGHT, width:WIDTH, backgroundColor:'white', flex:1, position:'relative', paddingTop: HEIGHT*0.075}}>
            <SafeAreaView style={{flex: 1}}>
               
                    
                    
            {/* {!cribPremium ? */}
            
            <CribPremiumSubheaderText>
                <Text style={{color:PRIMARYCOLOR, fontWeight:'600'}}>Crib Connect</Text> instantly {'\n'}finds best tenants {'\n'}for your sublease
            </CribPremiumSubheaderText>


            {userData != undefined && userData.cribConnectSubtenants != undefined &&
            userData.postedProperties != 0 &&
                <Lottie source={require("../../../assets/cribreferralcode.json")} autoPlay loop style={{height:HEIGHT*0.2, alignSelf:'center',}}/>
            }
            


            {(userData == undefined || (userData != undefined && userData.postedProperties.length == 0))?
            <View style={{height: HEIGHT*0.4 ,justifyContent:'center'}}>
                <CribPremiumHeaderText>Save thousands in <Text style={{color: PRIMARYCOLOR, textDecorationLine:"underline"}}>30 seconds</Text> {'\n'}post your sublease right now</CribPremiumHeaderText>
            </View>
            :
            <View>
                <EstimatedSavingText style={{marginTop: HEIGHT*0.025}}>You could save{'\n'}<Text style={{fontSize:HEIGHT*0.08, fontWeight:'600'}}>${estimatedSaving}</Text> {'\n'}right now</EstimatedSavingText>
            </View>
            }
            {((userData != undefined && userData.postedProperties.length != 0)) &&
                <Text style={{alignSelf:'center', fontWeight:'600', fontSize: HEIGHT*0.0175, width: WIDTH*0.9, textAlign:'center', marginTop: HEIGHT*0.05}}>We saved Crib Connect users <Text style={{fontWeight:'600', color: PRIMARYCOLOR, textDecorationLine:'underline'}}>${cribConnectSavings.toLocaleString("en-US")}</Text> in rent</Text>
            }

            
            
           
            <View style={{position:'absolute', bottom:HEIGHT*0.025, alignSelf:'center'}}>  
            {(userData != undefined && userData.postedProperties.length != 0 && propData != undefined && propData != null) ?
            
                <></>
                :
                <>
                    <Lottie source={require("../../../assets/cibprofilepremium.json")} autoPlay loop style={{height: HEIGHT*0.2, alignSelf:'center'}}/>
                </>
                }
                { userData != undefined && userData.postedProperties != 0 && 
                 <CribConnectMatchesContainer  onPress={checkSubtenantMatches}>
                    <Lottie source={require("../../../assets/cribconnectfire.json")} autoPlay loop style={{height:HEIGHT*0.04}}/>
                    <CribConnectMatchesText>{userData.cribConnectSubtenants.length == 0 ? "" : userData.cribConnectSubtenants.length} {userData.cribConnectSubtenants.length == 0 ? "Finding a subtenant ..." : "subtenant matches"}</CribConnectMatchesText>
                    <Ionicons name={'arrow-forward'} color={'white'} size={HEIGHT*0.02} style={{opacity: userData.cribConnectSubtenants.length == 0 ? 0 : 1}}/>
                </CribConnectMatchesContainer>
                }
                <SubmitButton onPress={handleSubmitClick}>
                    <SubmitText >{cribPremium ? "Edit my preference" : (userData == undefined || userData?.postedProperties?.length == 0) ? "Post my sublease" : (userData != undefined && !userData.cribConnectEnrolled) ? "I AM INTERESTED" : "CHECK OUT CRIB CONNECT"}</SubmitText>           
                </SubmitButton>
            </View>
            <Modal isVisible={cribConnectModal} style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                {/* <Modal isVisible={true} style={{flex: 1, justifyContent:'center', alignItems:'center'}}> */}

                <CribConnectModal>
                    <CribConnectModalHeading style={{fontSize: HEIGHT*0.02, fontWeight:'700', color:'#e3cc24', alignSelf:'center'}}>Get Crib Connect</CribConnectModalHeading>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}  pagingEnabled ref={scrollviewRef} onScroll={onScroll} scrollEventThrottle={16} >
                        <View style={{height: HEIGHT*0.2, width: WIDTH*0.8,paddingTop: HEIGHT*0.015, paddingHorizontal: WIDTH*0.05}}>
                            <Lottie source={require("../../../assets/cribenterreferralcode.json")} autoPlay loop style={{height:HEIGHT*0.125, alignSelf:'center', backgroundColor:'red'}}/>
                            <View style={{marginTop: HEIGHT*0.02}}>
                                <CribConnectModalHeading style={{color:'black'}}>Property <Text style={{color:'#e3cc24', fontWeight: '700'}}>posted</Text> 🎉</CribConnectModalHeading>
                                <CribConnectModalSubheading style={{marginTop: HEIGHT*0.01}}>Please check back frequently on Crib Connect page for recommened tenants! We will start finding tenants for you ...</CribConnectModalSubheading>
                            </View>
                        </View>
                        <View style={{height: HEIGHT*0.2, width: WIDTH*0.8,paddingTop: HEIGHT*0.015, paddingHorizontal: WIDTH*0.05}}>
                            <Lottie source={require("../../../assets/cribconnectfindingtenants.json")} autoPlay loop style={{height:HEIGHT*0.125, alignSelf:'center'}}/>
                            <View style={{marginTop: HEIGHT*0.02}}>
                                <CribConnectModalHeading style={{color:'black'}}>We do <Text style={{color:'#e3cc24', fontWeight:'700'}}>all the work</Text></CribConnectModalHeading>
                                <CribConnectModalSubheading style={{marginTop: HEIGHT*0.01}}>We find reliable and interested tenants for you, so you can sit back and relax. Only engage with our trusted tenants!</CribConnectModalSubheading>
                            </View>
                        </View>
                        <View style={{height: HEIGHT*0.2, width: WIDTH*0.8,paddingTop: HEIGHT*0.015, paddingHorizontal: WIDTH*0.05}}>
                            <Lottie source={require("../../../assets/cribconnecttenantrefund.json")} autoPlay loop style={{height:HEIGHT*0.125, alignSelf:'center'}}/>
                            <View style={{marginTop: HEIGHT*0.02}}>
                                <CribConnectModalHeading style={{color:'black'}}><Text style={{color:'#e3cc24', fontWeight:'700'}}>Maximize</Text> savings</CribConnectModalHeading>
                                <CribConnectModalSubheading style={{marginTop: HEIGHT*0.01}}>We prioritize tenants who covers your {'\n'}entire sublease so you can save most!</CribConnectModalSubheading>
                            </View>
                        </View>
                        <View style={{height: HEIGHT*0.2, width: WIDTH*0.8,paddingTop: HEIGHT*0.015, paddingHorizontal: WIDTH*0.05}}>
                            <Lottie source={require("../../../assets/cribconnectenantslide2.json")} autoPlay loop style={{height:HEIGHT*0.125, alignSelf:'center'}}/>
                            <View style={{marginTop: HEIGHT*0.02}}>
                                <CribConnectModalHeading style={{color:'black'}}><Text style={{color:'#e3cc24', fontWeight:'700'}}>Verified</Text> tenants</CribConnectModalHeading>
                                <CribConnectModalSubheading style={{marginTop: HEIGHT*0.01, }}>We verify all tenants to ensure the best {'\n'}subleasing experience for you! We are truly for students by students!</CribConnectModalSubheading>
                            </View>
                        </View>
                        <View style={{height: HEIGHT*0.2, width: WIDTH*0.8,paddingTop: HEIGHT*0.015, paddingHorizontal: WIDTH*0.05}}>
                            <Lottie source={require("../../../assets/cribconnecttenantslide3.json")} autoPlay loop style={{height:HEIGHT*0.15, alignSelf:'center'}}/>
                            <View style={{marginTop: HEIGHT*0.02}}>
                                <CribConnectModalHeading style={{color:'black'}}>Find the <Text style={{color:'#e3cc24', fontWeight:'700'}}>BEST</Text> tenant</CribConnectModalHeading>
                                <CribConnectModalSubheading style={{marginTop: HEIGHT*0.01, }}>Don't settle for okay tenants, we find the best match who fits your sublease!</CribConnectModalSubheading>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{width:WIDTH*0.175, flexDirection:'row', justifyContent:'space-between', alignSelf:'center', paddingBottom: HEIGHT*0.05}}>
                        <ProgressDots style={{backgroundColor: activeIdx == 0 ? '#e3cc24' : '#E0E0E0'}}/>
                        <ProgressDots style={{backgroundColor: activeIdx == 1 ? '#e3cc24' : '#E0E0E0'}}/>
                        <ProgressDots style={{backgroundColor: activeIdx == 2 ? '#e3cc24' : '#E0E0E0'}}/>
                        <ProgressDots style={{backgroundColor: activeIdx == 3 ? '#e3cc24' : '#E0E0E0'}}/>
                        <ProgressDots style={{backgroundColor: activeIdx == 4 ? '#e3cc24' : '#E0E0E0'}}/>
                    </View>

                    <CribConnectModalContinueButton onPress={handleSubmitClick}>
                        <CribConnectModalHeading style={{color: 'white', fontWeight:'500', fontSize: HEIGHT*0.02}}>Find tenants faster</CribConnectModalHeading>
                    </CribConnectModalContinueButton>
                   
                    {/* <CribConnectModalHeading style={{color: DARKGREY, marginTop: HEIGHT*0.015, fontSize}}>MAYBE LATER</CribConnectModalHeading> */}
                    


                </CribConnectModal>
                <Pressable onPress={()=>setCribConnectModal(false)}>
                    <Text style={{marginTop: HEIGHT*0.05, fontSize: HEIGHT*0.02, fontWeight:'600', color: MEDIUMGREY, textDecorationLine:'underline'}}>Skip</Text>
                </Pressable>
            </Modal>
            
            </SafeAreaView>
        </View>
    )
}