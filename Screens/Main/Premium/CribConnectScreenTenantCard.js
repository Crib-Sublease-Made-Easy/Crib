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
  Image,
  Linking
} from 'react-native';
import Modal from "react-native-modal";
import EncryptedStorage from 'react-native-encrypted-storage';
import styled from 'styled-components';
import { Header, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../sharedUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from "@react-native-community/blur";


const CardContainer = styled.Pressable`
    width: 47.5%
    height: ${HEIGHT*0.3}px
    background-color: white
    border-radius: 10px
    margin-top: 15px
    shadow-offset: 0 0
    shadow-color: black;
    shadow-radius: 5px;
    shadow-opacity: 0.2;
    elevation: 5
`
const FilterModalSubmitButton = styled.Pressable`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 15px
    align-self: center
    justify-content: center
    align-items: center
    position: absolute
    bottom: ${HEIGHT*0.05}px
`

const FilterModalSubmitText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: white
    font-weight: 500
`

const NameText = styled.Text`
`

const SubtenantInfoText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
`

const SubtenantInfoSubtext = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    margin-top: ${HEIGHT*0.01}px
`
const SubtenantRowSection = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
`

export default function CribConnectScreenTenantCard(props){
    let subtenant = props.data.item;
    const [subtenantModalVis, setSubtenantModalVis] = useState(false)
    async function sms(item){
       
        if(props.cribConnectUser){
            const UID = await EncryptedStorage.getItem("userId")
            const at = await EncryptedStorage.getItem("accessToken")
            await fetch("https://crib-llc.herokuapp.com/users/cribconnect/contactSubtenants",{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + at
            },
            body:JSON.stringify({
                userId: UID,
                subtenantID: item._id
            })
            })
            .then(async res =>{
            })
            .catch( e => {
                console.log("Error")
            })
            await Linking.openURL(`sms:${item.phoneNumber}${getSMSDivider()}body=Hello ${item.name}, this is `)
        }
        else{
            alert("Get Crib Connect to message interested tenants.")
            props.nav()
        }
        setSubtenantModalVis(false)
    }

    function getSMSDivider(){
        return Platform.OS === "ios" ? "&" : "?";
    }

    function handleCardPress(){
        if(!props.cribConnectUser){
            props.nav()
        }
        else{
            setSubtenantModalVis(true)
        }
    }
    
    
    return (
        <CardContainer onPress={handleCardPress}>
            <View style={{flex: 1, padding: 15}}>
                <NameText numberOfLines={1} style={{color: PRIMARYCOLOR, fontWeight: '600', fontSize: HEIGHT*0.02}}>{subtenant.name}</NameText>
                <View style={{flexDirection:'row', marginTop: HEIGHT*0.01}}>
                    { subtenant.gender == "Female" || subtenant.gender == "Male" ?
                        <NameText>{subtenant.gender}</NameText>
                        :
                        <NameText>Prefer not to say</NameText>
                    }
                    <NameText style={{marginLeft: WIDTH*0.05}}>{subtenant.age}</NameText>
                </View>
                <View style={{marginTop: HEIGHT*0.015}}>
                    <NameText style={{fontWeight: '600'}}>Requested dates: </NameText>
                    <Text numberOfLines={1} style={{fontWeight:'400', marginTop: HEIGHT*0.01}}>{new Date(subtenant.subleaseStart).toLocaleString().split(",")[0]} - {new Date(subtenant.subleaseEnd).toLocaleString().split(",")[0]}</Text>
                </View>
                <View style={{marginTop: HEIGHT*0.015}}>
                    <NameText style={{fontWeight: '600'}}>Budget: <Text style={{fontWeight:'400'}}>${subtenant.budget}</Text></NameText>
                </View>
                <View style={{marginTop: HEIGHT*0.015}}>
                    <NameText style={{fontWeight: '600'}}>Bio: </NameText>
                    <Text numberOfLines={3} style={{fontWeight:'400', marginTop: HEIGHT*0.01}}>{subtenant.bio}</Text>
                </View>
            </View>
            <BlurView
                style={{position:'absolute', top:0, bottom:0,  flex: 1, width: '100%', height: '100%', borderRadius:15, display: props.cribConnectUser ? "none" : props.data.index > 1 ? "flex" : 'none'}}
                blurType="light"
                blurAmount={5}
                reducedTransparencyFallbackColor="white"
            />     

            <Pressable onPress={()=>sms(subtenant)} style={{ backgroundColor:PRIMARYCOLOR, width: 40, height: 40, borderRadius:100, position:'absolute', bottom: HEIGHT*0.01, right: WIDTH*0.025, justifyContent:'center', alignItems:'center'}}>
                <Ionicons name="chatbox-ellipses" color='white' size={20}/>
            </Pressable>


            <Modal onBackdropPress={()=> setSubtenantModalVis(false)} isVisible={subtenantModalVis} style={{padding:0, margin: 0, justifyContent:'flex-end'}}>
                <View style={{backgroundColor:'white', height: HEIGHT*0.6,  width: WIDTH, borderTopLeftRadius: 15, borderTopRightRadius: 15, paddingTop: HEIGHT*0.02, paddingHorizontal: WIDTH*0.05,}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Pressable onPress={()=>setSubtenantModalVis(false)}>
                            <Ionicons name='arrow-back-outline' size={25} color='#545454'/>
                        </Pressable>
                        <Header style={{alignSelf:'center'}}>Subtenant Information</Header>
                        <Pressable>
                            <Ionicons name='arrow-back-outline' size={25} color='#545454' style={{opacity:0}}/>
                        </Pressable>
                        
                    </View>
                    <View style={{paddingTop: HEIGHT*0.02}}>
                        <SubtenantRowSection>
                            <SubtenantInfoText>{subtenant.name}      {subtenant.gender}      {subtenant.age}</SubtenantInfoText>
                        </SubtenantRowSection>
                        <SubtenantRowSection>
                            <SubtenantInfoText >Requested dates:</SubtenantInfoText>
                            <SubtenantInfoSubtext>{new Date(subtenant.subleaseStart).toLocaleString().split(",")[0]} - {new Date(subtenant.subleaseEnd).toLocaleString().split(",")[0]}</SubtenantInfoSubtext>
                        </SubtenantRowSection>
                        <SubtenantRowSection>
                            <SubtenantInfoText >Budget:</SubtenantInfoText>
                            <SubtenantInfoSubtext>${subtenant.budget} /month</SubtenantInfoSubtext>
                        </SubtenantRowSection>
                        <SubtenantRowSection >
                            <SubtenantInfoText >Bio:</SubtenantInfoText>
                            <ScrollView style={{height: HEIGHT*0.15}}>
                                <SubtenantInfoSubtext>{subtenant.bio}</SubtenantInfoSubtext>
                            </ScrollView>
                        </SubtenantRowSection>
                    </View>
                    <FilterModalSubmitButton onPress={()=>sms(subtenant)}>
                        <FilterModalSubmitText>
                            Message 
                        </FilterModalSubmitText>
                    </FilterModalSubmitButton>
                </View>
                
            </Modal>
        </CardContainer>
    )
}