import * as React  from 'react';
import { useState, useContext, createContext, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  AppState,
  Pressable,
  Image,
  FlatList
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Modal from "react-native-modal";
import Lottie from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Slider} from '@miblanchard/react-native-slider';

import { bkxml } from '../../../assets/gradientBackground.js';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DARKGREY, EXTRALIGHT, Header, HEIGHT, MEDIUMGREY, PRIMARYCOLOR, WIDTH } from '../../../sharedUtils';
import { ContinueBallsView, ContinueButton, ContinueText,CribConnectMatchesContainer, CribConnectMatchesText, CribConnectModal, CribConnectModalContinueButton, CribConnectModalHeading, CribConnectModalSubheading, CribConnectNotifContentText, CribConnectNotifLogoView, CribConnectNotifNameText, CribConnectNotifView, CribPremiumHeaderText, CribPremiumPaidSubheaderText, CribPremiumPressable, CribPremiumPressableLeft, CribPremiumSubheadePostingText, CribPremiumSubheaderText, CustomMarker, EstimatedSavingText, FilterModalGenderOptions, FilterModalOptionContainer, FilterModalOptionTitle, FilterModalSubmitButton, FilterModalSubmitText, FilterOptionContainer, FilterOptionText, MapContainer, MatchesNumberContainer, NumberBackground, NumberText, PreferenceLabel, PreferencesInput, ProgressDots, ReferralCodeHelperText, SubmitButton, SubmitButtonOutline, SubmitText} from './CribConnectScreenStyle'
import SubtenantCard from './SubtenantCard'
import CribConnectScreenTenantCard from './CribConnectScreenTenantCard.js';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const GENDEROPTIONS = ["Male", "Female", "Both"]


export default function CribConnectScreen({navigation}){
    
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
    const [twoSubtenants, setTwoSubtenants] = useState([])
    const [cribConnectSubtenants, setCribConnectSubtenants] = useState([])


    //Filter Modal
    const [filterModalVis, setFilterModalVis] = useState(false)
    const [filterGender, setFilterGender] = useState("Both")
    const [filterBudget, setFilterBudget] = useState(0)
    const [filterOccupy, setFilterOccupy] = useState(50)


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


    },[filterGender, filterBudget, filterOccupy])

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

        // console.log("ACCESS", accessToken)
        // console.log(USERID)

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
                if(userData.cribPremium.paymentDetails.status == false){
                    checkIfPaid(userData)
                }

                if(userData.postedProperties.length != 0 && userData.cribConnectSubtenants.length != 0){

                
                    await fetch('https://crib-llc.herokuapp.com/users/lastTwoSubtenants', {
                        method: 'POST',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "userId" : userData._id
                        })
                    })
                    .then(async res => {
                        if(res.status == 200){
                            let data = await res.json();
                           
                            setTwoSubtenants(data.data)
                        }
                    })
                    .catch( e => {
                        console.log(e)
                    })

                    

                    fetchSubtenants(userData)
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

    async function fetchSubtenants(userData){
        let accessToken = await EncryptedStorage.getItem("accessToken")
        let USERID = await EncryptedStorage.getItem("userId")
        await fetch('https://crib-llc.herokuapp.com/subtenants/getallmatches', {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify({
                "userId" : USERID,
                "subArr": userData.cribConnectSubtenants
            })
        })
        .then(async res => {
            if(res.status == 200){
                let data = await res.json();

                let filteredArr = data.filter(subtenant => subtenant.deleted == false)

                
                if(filterGender == "Male"){
                    filteredArr = filteredArr.filter(subtenant => subtenant.gender == "Male")
                }
                else if(filterGender == "Female"){
                    filteredArr = filteredArr.filter(subtenant => subtenant.gender == "Female")
                }



                filteredArr = filteredArr.filter(subtenant => subtenant.budget > filterBudget)
    
                return filteredArr
            }
        })
        .then((data) => {
            setCribConnectSubtenants(data)
        })
        .catch( e => {
            console.log("Error")
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
                if(data.order.state == "OPEN" &&  data.order.net_amount_due_money.amount == 0){
                    setCribPremium(true)
                }
            }
        })
        .catch(e=>{
            console.log("ERROR  ", e)
        })
    }

    async function handleFilterClick(){
        let at = await EncryptedStorage.getItem("accessToken")
        if(userData == undefined || at == undefined){
            alert("Please sign in or login.")
            navigation.navigate("Profile")
        }
        else if(userData.postedProperties.length == 0){
            alert("Please post a property first.")
            navigation.navigate("PropertyPosting", {userData: userData})
        }
        else if(userData.cribPremium.paymentDetails.status){
            setFilterModalVis(true)
        }
        else{
            alert("Get Crib Connect to message interested tenants.")
            navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})
        }
    }

       // This changes which index (above the submit button) should be active 
    function onScroll(event){
        setActiveIdx(parseInt(event.nativeEvent.contentOffset.x/(WIDTH*0.8)));
    }

    function filterSubtenants(){
        setFilterModalVis(false)
    }

    function resetFilter(){
        setFilterGender("Both")
        setFilterBudget(0)
        setFilterOccupy(50)
        fetchSubtenants(userData)
        setFilterModalVis(false)
    }


    return(
        <View style={{height: HEIGHT, width:WIDTH, backgroundColor:'white', flex:1, position:'relative', }}>
            <View style={{width: WIDTH, height: HEIGHT*0.225, alignItems:'center', justifyContent:'center', }}>
                {/* < source={require('../../../assets/g')}/> */}
                <SvgXml
                    width= '100%'
                    height= '100%'
                    preserveAspectRatio="xMinYMin slice" 
                    style={{position:'absolute'}}
                    xml={bkxml}
                />
                <View style={{position:'absolute', bottom: HEIGHT*0.0225}}>
                    <CribPremiumSubheaderText>🎉 Crib Connect</CribPremiumSubheaderText>
                            <Text style={{alignSelf:'center', fontSize: HEIGHT*0.0175, textAlign:'center', color:'white'}}>Sublease easier than ever!</Text>
                    <MatchesNumberContainer>
                        {userData != undefined ?
                            <Text style={{fontWeight: '700'}}>{userData.cribConnectSubtenants.length == 0 ? "no matches yet" : userData.postedProperties.length == 0 ? "Post a sublease first" : `${userData.cribConnectSubtenants.length} matches`}</Text>
                            :
                            <Text style={{fontWeight: '700'}}>Waiting ...</Text>
                        }
                    </MatchesNumberContainer>
                </View>
                
            </View>
           
            <View style={{paddingVertical: HEIGHT*0.02,width: WIDTH, justifyContent:'center'}}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: WIDTH*0.05}}>
                    <Pressable onPress={handleFilterClick} style={{flexDirection:'row'}}>
                        <View style={{width: 35, height: 35,  borderWidth:1, borderRadius:50, justifyContent:'center', alignItems:'center', borderColor: DARKGREY, backgroundColor: EXTRALIGHT}}>
                            <Ionicons name="filter" color={DARKGREY} size={15} style={{alignSelf:'center'}}/>
                        </View>
                        <FilterOptionContainer style={{backgroundColor: filterGender == "Both" ? EXTRALIGHT : PRIMARYCOLOR}} >
                            <FilterOptionText style={{color: filterGender == "Both" ? '#333333' : 'white'}}>{filterGender == "Both" ? "Gender" : filterGender}</FilterOptionText>
                        </FilterOptionContainer>
                        <FilterOptionContainer style={{backgroundColor: filterBudget == 0 ? EXTRALIGHT : PRIMARYCOLOR}} >
                            <FilterOptionText  style={{color: filterBudget == 0 ? '#333333' : 'white'}}>{filterBudget == 0 ? "Budget" : `> $${filterBudget}`}</FilterOptionText>
                        </FilterOptionContainer>
                        {/* <FilterOptionContainer>
                            <FilterOptionText>Duration</FilterOptionText>
                        </FilterOptionContainer> */}
                    </Pressable>
                    <Pressable onPress={resetFilter}>
                        <Text style={{alignSelf:'center', color: DARKGREY, fontWeight: '600'}}>Reset filter</Text>
                    </Pressable>
                </View>
                {userData != undefined && userData.postedProperties.length != 0 && userData.cribPremium.paymentDetails.status != true &&
                    <Text style={{alignSelf:'center', fontWeight:'600', fontSize: HEIGHT*0.0175, width: WIDTH*0.9, textAlign:'center', color:DARKGREY, marginTop: HEIGHT*0.02 }}>Get Crib Connect to connect with {'\n'}interested subtenants before it's too late!</Text>
                }
            </View>
            <SafeAreaView style={{flex: 1, }}>
                { userData == undefined || userData.postedProperties.length == 0 ?
                <View style={{flex: 1, paddingTop: HEIGHT*0.075}}>
                    <CribPremiumHeaderText >Post a sublease to see current and{'\n'}future potential tenant matches</CribPremiumHeaderText>
                    <Lottie source={require("../../../assets/cibprofilepremium.json")} autoPlay loop style={{height: HEIGHT*0.2, alignSelf:'center', marginTop: HEIGHT*0.02}}/>
                </View>
                :
                <FlatList
                    numColumns={2}
                    style={{ flex: 1}}
                    data={cribConnectSubtenants}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{justifyContent: 'space-between', alignItems:'center', paddingHorizontal: WIDTH*0.025}}
                    renderItem={(item, index) => {
                        if(!item.item.deleted){
                            return (
                                <CribConnectScreenTenantCard data={item} cribConnectUser={userData.cribPremium.paymentDetails.status} nav={()=>{ alert("Get Crib Connect to message interested tenants."), navigation.navigate("CribConnectTenant", {userData: userData, prefetchInterestedNumber: prefetchCribConnectInterestedNumber, subleaseArea: subleaseArea, estimatedSaving: estimatedSaving})}}/>   
                            )
                        }
                        else{
                            return null
                        }
                    }}
                />
                }



               
                  
            {/* {!cribPremium ? */}
            
            {/* <CribPremiumSubheaderText>
                <Text style={{color:PRIMARYCOLOR, fontWeight:'600'}}>Crib Connect</Text> instantly {'\n'}finds best tenants {'\n'}for your sublease
            </CribPremiumSubheaderText> */}


            {/* {userData != undefined && userData.cribConnectSubtenants != undefined &&
            userData.postedProperties != 0 &&
                <Lottie source={require("../../../assets/cribreferralcode.json")} autoPlay loop style={{height:HEIGHT*0.2, alignSelf:'center',}}/>
            }  */}
            


            {/* {(userData == undefined || (userData != undefined && userData.postedProperties.length == 0))?
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
            } */}

            
            
           
            {/* <View style={{position:'absolute', bottom:HEIGHT*0.025, alignSelf:'center'}}>  
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
                <SubmitButton onPress={()=> setCribConnectModal(true)}>
                    <SubmitText >{cribPremium ? "Edit my preference" : (userData == undefined || userData?.postedProperties?.length == 0) ? "Post my sublease" : (userData != undefined && !userData.cribConnectEnrolled) ? "I AM INTERESTED" : "CHECK OUT CRIB CONNECT"}</SubmitText>           
                </SubmitButton>
            </View>
             */}

               {userData == undefined || userData.postedProperties.length == 0 ?

                <View style={{position:'absolute', bottom: HEIGHT*0.025, alignSelf:'center'}}>
                    <ContinueButton onPress={handleSubmitClick}>
                        <ContinueText>
                            POST A SUBLEASE
                        </ContinueText>
                    </ContinueButton>
                </View> 

                :
                userData != undefined && userData.cribPremium.paymentDetails.status == true ?

                null

                :
                <View style={{position:'absolute', bottom: HEIGHT*0.025, alignSelf:'center'}}>
                    <ContinueButton onPress={handleSubmitClick}>
                        <ContinueText>
                            CONNECT WITH THEM
                        </ContinueText>
                    </ContinueButton>
                </View> 

                }
                
            
            </SafeAreaView>
            








            
            <Modal animationInTiming={500} backdropColor='white' isVisible={cribConnectModal} style={{flex: 1, justifyContent:'center', alignItems:'center', margin:0, padding:0, position:'relative'}}>

                {/* <Modal isVisible={true} style={{flex: 1, justifyContent:'center', alignItems:'center'}}> */}
            
                <View style={{position:'relative', height: HEIGHT*0.3, alignSelf:'center', width: WIDTH, justifyContent:'center', alignItems:'center'}}>
                    <Image source={require('../../../assets/nynight.png')} style={{width:WIDTH, height:HEIGHT*0.3, position:'absolute', top: 0}}></Image>
                            <Text style={{color:'white', fontSize: HEIGHT*0.035, fontWeight:'700', textAlign:'center', alignSelf:'center' }}>Sublease your room {'\n'}faster and easier</Text>
                        {/* <View style={{width: WIDTH*0.8, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white', fontSize: HEIGHT*0.03, fontWeight:'700', textAlign:'center', alignSelf:'center' }}>Priorize your sublease to show interested tenant</Text>
                        </View>
                        <View style={{width: WIDTH*0.8, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white', fontSize: HEIGHT*0.03, fontWeight:'700', textAlign:'center', alignSelf:'center' }}>Advertise your sublease on all our platforms</Text>
                        </View> */}
                    <Text style={{position:'absolute', bottom: HEIGHT*0.015, color:'white', fontWeight:'700', }}>Crib Connect</Text>
                    
                </View>
                <CribConnectModal>
                    <ScrollView>
                        <CribConnectModalSubheading style={{color: PRIMARYCOLOR}}>We find tenants for you,</CribConnectModalSubheading>
                        <CribConnectModalSubheading style={{marginTop: HEIGHT*0.005}}>match with them instantly</CribConnectModalSubheading>
                        
                        {
                            twoSubtenants != undefined && twoSubtenants.map((subtenant, index) => {
                                return (
                                    <SubtenantCard key={index} data={subtenant} />
                                )
                            })
                        }
                        <View style={{paddingVertical:HEIGHT*0.0125}}>
                            <ContinueBallsView style={{backgroundColor:'#D9D9D9'}}/>
                            <ContinueBallsView style={{backgroundColor:'#EDEDED', marginTop:5}}/>
                            <ContinueBallsView style={{backgroundColor:'#F8F8F8',  marginTop:5}}/>
                        </View>
                        <Text style={{color:PRIMARYCOLOR, fontWeight:'700', alignSelf:'center' }}>{userData != undefined && userData.cribConnectSubtenants.length} subtenants match your sublease</Text>
                        
                        {/* <CribConnectModalHeading style={{fontSize: HEIGHT*0.02, fontWeight:'700', color:'#e3cc24', alignSelf:'center'}}>Get Crib Connect</CribConnectModalHeading>
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
                    
                        <CribConnectModalHeading style={{color: DARKGREY, marginTop: HEIGHT*0.015, fontSize}}>MAYBE LATER</CribConnectModalHeading> */}
                    </ScrollView>
                    <View style={{position:'absolute', bottom: HEIGHT*0.045, alignSelf:'center'}}>
                        <ContinueButton onPress={()=>setCribConnectModal(false)}>
                            <ContinueText>Check out Crib Connect</ContinueText>
                        </ContinueButton>
                        <Pressable onPress={()=>setCribConnectModal(false)}>
                            <Text style={{alignSelf:'center', fontWeight:'500', color:'#ABABAB'}}>maybe later</Text>
                        </Pressable>
                    </View>   
                </CribConnectModal>
            </Modal>  

            <Modal onBackdropPress={()=> setFilterModalVis(false)} animationOutTiming={300} animationInTiming={300} isVisible={filterModalVis} style={{margin: 0, padding: 0, flex: 1, display: 'flex'}}>  
              
                <View style={{ height: HEIGHT*0.6, backgroundColor:'white', position:'absolute', bottom:0, alignSelf:'center', width:WIDTH, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: HEIGHT*0.02, paddingHorizontal: WIDTH*0.05, display:'flex', flex: 1}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Pressable onPress={()=>setFilterModalVis(false)}>
                            <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                        </Pressable>
                        <Header style={{alignSelf:'center'}}>Filter</Header>
                        <Pressable onPress={resetFilter}>
                            <Header style={{alignSelf:'center', color: DARKGREY}}>Reset</Header>
                        </Pressable>
                    </View>
                     
                    <FilterModalOptionContainer>
                        <View >
                            <FilterModalOptionTitle>Gender</FilterModalOptionTitle>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: HEIGHT*0.02}}>
                        {
                            GENDEROPTIONS.map((item)=>{
                                return(
                                    <FilterModalGenderOptions onPress={()=>setFilterGender(item)} style={{backgroundColor: item == filterGender ? PRIMARYCOLOR: 'white'}} key={item}>
                                        <Text style={{fontWeight:'500', color: item == filterGender ? 'white' : 'black'}}>{item}</Text>
                                    </FilterModalGenderOptions>
                                )
                            })
                        }
                        </View>
                    </FilterModalOptionContainer>
                  
                    <FilterModalOptionContainer>
                       
                        <View style={{width: WIDTH*0.9, alignSelf:'center', justifyContent:'space-between', flexDirection:'row'}}>
                            <FilterModalOptionTitle>Minimum budget</FilterModalOptionTitle>
                            <FilterModalOptionTitle>${filterBudget}</FilterModalOptionTitle>
                        </View>
                        <View style={{justifyContent:'center', marginTop: HEIGHT*0.015, width: WIDTH*0.9, height: HEIGHT*0.05,}}>
                            <Slider
                                minimumValue={0}
                                maximumValue={10000}
                                step={100}
                                thumbTintColor={PRIMARYCOLOR}
                                minimumTrackTintColor={PRIMARYCOLOR}
                                maximumTrackTintColor={MEDIUMGREY}
                                value={filterBudget}
                                onValueChange={value => {
                                    setFilterBudget(value)
                                }}
                            />
                        </View>
                    </FilterModalOptionContainer>
                    
                    {/* <FilterModalOptionContainer>
                        
                        <View style={{width: WIDTH*0.9, alignSelf:'center', justifyContent:'space-between', flexDirection:'row'}}>
                            <FilterModalOptionTitle>Occupancy</FilterModalOptionTitle>
                            <FilterModalOptionTitle>{filterOccupy}%</FilterModalOptionTitle>
                        </View>                            
                        <Text>Minimum stay duration</Text>
                        <View style={{justifyContent:'center', marginTop: HEIGHT*0.015, width: WIDTH*0.9, height: HEIGHT*0.05,}}>
                            <Slider
                                minimumValue={0}
                                maximumValue={90}
                                step={10}
                                thumbTintColor={PRIMARYCOLOR}
                                minimumTrackTintColor={PRIMARYCOLOR}
                                maximumTrackTintColor={MEDIUMGREY}
                                value={filterOccupy}
                                onValueChange={value => {
                                    setFilterOccupy(value)
                                }}
                            />
                        </View> 
                    </FilterModalOptionContainer> */}
                    <FilterModalSubmitButton onPress={filterSubtenants}>
                        <FilterModalSubmitText>
                            Filter results
                        </FilterModalSubmitText>
                    </FilterModalSubmitButton>
                </View>
                
            </Modal>
        </View>
    )
}