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
  Pressable,
  Linking,
} from 'react-native';
import Lottie from 'lottie-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { EditPageBackButtonContainer, EditPageForwardButtonContainer, EditPageNameContainer, EditPagesHeaderContainer, HEIGHT, PRIMARYCOLOR, WIDTH, Header } from '../../../../sharedUtils';
import { SubtenantContainer, SubtenantDetailText, SubtenantNameText, Title } from './cribConnectSubtenantMatchesStyle';

export default function CribConnectSubtenantMatchesScreen({navigation, route}){
    const [subtenantMatches, setSubtenantMatches] = useState([])

    useEffect(()=>{
        fetchSubtenants()
    },[])


    async function convertTime(item){
       
        let curTime = new Date().getTime();
        let itemTime = new Date(item.createdAt).getTime();

        if(curTime - itemTime < 1000*60*60*24){
            return 1;
        }
        return 0;
        
    }

    async function fetchSubtenants(){
        
        let data = route.params.subtenantMatches;
        await data.forEach(async (id)=>{
            await fetch("https://crib-llc.herokuapp.com/subtenants/getone",{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                subtenantId: id
            })
            })
            .then(async res =>{
                if(res.status == 200){
                
                    let data = await res.json();
                    setSubtenantMatches(subtenantMatches => [...subtenantMatches, data[0]])
                }
            })
        })
    }

    async function sms(item){
        if(route.params.paidUser){
            await Linking.openURL(`sms:${item.phoneNumber}${getSMSDivider()}body=Hello ${item.name}, this is `)
        }
        else{
            alert("Get Crib Connect to message verified and interested tenants.")
            navigation.navigate("CribConnectTenant", {userData: route.params.userData})
        }
    }
    function getSMSDivider(){
        return Platform.OS === "ios" ? "&" : "?";
      }

    return(
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <SafeAreaView style={{flex: 1}}>
                <EditPagesHeaderContainer style={{borderBottomWidth: 0}}>
                    <EditPageBackButtonContainer>
                    <Pressable hitSlop={WIDTH*0.025} onPress={()=> navigation.goBack()} >
                        <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                    </Pressable>
                    </EditPageBackButtonContainer>
                    <EditPageNameContainer>
                    <Header></Header>
                    </EditPageNameContainer>
                    <EditPageForwardButtonContainer>

                        {/* <Pressable onPress={()=>navigation.navigate("CribConnectReviews")} style={{backgroundColor: '#c99200', paddingVertical: HEIGHT*0.01, paddingHorizontal: WIDTH*0.02, borderRadius:20}}>
                            <Text style={{color:'white'}}>
                                Reviews
                            </Text>
                        </Pressable> */}
                    </EditPageForwardButtonContainer>
                </EditPagesHeaderContainer>
                <View style={{paddingTop:HEIGHT*0.015}}>
                    <View style={{flexDirection: 'row', paddingHorizontal: WIDTH*0.05, justifyContent:'space-between', alignItems:'center'}}>
                        <Title>My matches</Title>
                        <View style={{backgroundColor: PRIMARYCOLOR, borderRadius:100, height: WIDTH*0.1, width: WIDTH*0.1, justifyContent:'center', alignItems:'center'}}>
                            <Title style={{color:'white', fontSize: HEIGHT*0.02}}>{subtenantMatches.length}</Title>
                        </View>
                    </View>
                    <ScrollView style={{paddingHorizontal: WIDTH*0.05, height: HEIGHT*0.8}}>
                        {
                            subtenantMatches.map((item)=>{
                                return (
                                    <SubtenantContainer key={item._id}>
                                        <Text style={{color:'#D4AF37', fontSize: HEIGHT*0.0175, fontWeight: '600'}}>Matched {(new Date().getTime() - new Date(item.createdAt).getTime()) < (1000*60*60*24) ? "today" : (new Date().getTime() - new Date(item.createdAt).getTime()) < (1000*60*60*24*2) ? "yesterday" : `on ${new Date(item.createdAt).toDateString()}`}</Text>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                            <SubtenantNameText>{item.name.split(" ")[0]}  {item.gender}   {item.age}</SubtenantNameText>
                                            <Pressable onPress={()=>sms(item)} style={{padding: 7, borderRadius:100, backgroundColor:PRIMARYCOLOR}}>
                                                <Ionicons name="chatbox-ellipses"  size={HEIGHT*0.025} color={'white'}/>
                                            </Pressable>
                                        </View>
                                        <SubtenantDetailText><Text style={{fontWeight:'600'}}>Requested dates:</Text></SubtenantDetailText>
                                        <SubtenantDetailText style={{marginTop: HEIGHT*0.005}}>{new Date(item.subleaseStart).toDateString().split(" ")[1]} {new Date(item.subleaseStart).toDateString().split(" ")[2]} -  {new Date(item.subleaseEnd).toDateString().split(" ")[1]} {new Date(item.subleaseEnd).toDateString().split(" ")[2]} {new Date(item.subleaseEnd).toDateString().split(" ")[3]} (Flexible)</SubtenantDetailText>
                                        <SubtenantDetailText style={{marginTop: HEIGHT*0.01}}><Text style={{fontWeight:'600'}}>Budget:</Text></SubtenantDetailText>
                                        <SubtenantDetailText style={{marginTop: HEIGHT*0.005}}>${item.budget} /month</SubtenantDetailText>
                                        <SubtenantDetailText style={{marginTop: HEIGHT*0.01}}><Text style={{fontWeight:'600'}}>About me:</Text></SubtenantDetailText>
                                        <SubtenantDetailText style={{marginTop: HEIGHT*0.005}}>{item.bio}</SubtenantDetailText>


                                    </SubtenantContainer>
                                )
                            })
                        }

                    </ScrollView>
                </View>

            </SafeAreaView>
        </View>
    )
}