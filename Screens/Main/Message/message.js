//Lobby
import React, {useState, useEffect, useRef, useContext, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  AppState
} from 'react-native';
import {UserContext} from '../../../UserContext';
import EncryptedStorage from 'react-native-encrypted-storage';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FastImage from 'react-native-fast-image'

import Lottie from 'lottie-react-native';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { InboxTitle, FlatlistItemContainer, FlatlistUnread, FlatlistLeft, FlatlistRight, 
    LocationText,TextAndTime, LastMessageTime, DefaultPostFavText, NoUserViewContainer,
LoginContainer, SignupContainer, LoginText, SignupText, NoUserText, StyledView, SubleaseRequestContainer, SubleaseRequestSubtitle, SubleaseRequestText } from './messageStyle';

export default function MessageScreen({navigation, route}){
    const insets = useSafeAreaInsets();
    const {sb, USERID} = useContext(UserContext);

    const [convoList, setConvoList] = useState([])
    const [userId, setUserId] = useState('')
    const [receiverName, setReceiverName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [contactedBy, setContactedBy] = useState([])



    useEffect(()=>{
        // getContactByNumber()
        const unsubscribe = navigation.addListener('focus', () => {
            onChat = false
            fetchConvos()
            getFirstName()
        });
        sb.addChannelHandler('channels', channelHandler);

        return unsubscribe

        // return unsubscribe;

    }, [navigation, convoList])




    const channelHandler = new sb.ChannelHandler();
    
    channelHandler.onChannelChanged = channel => {
        fetchConvos()
    };

    const getFirstName = async()  => {
        try{

            const firstName = await EncryptedStorage.getItem("firstName");

            if(firstName != undefined){
                setFirstName(firstName)
            }
           
        }
        catch{
            console.log("ERROR ---GETFIRSTNAME")
        }
        
    }

    // async function getContactByNumber(){
       
       
    //         const accessToken = await EncryptedStorage.getItem("accessToken");
    //         let USERID = await EncryptedStorage.getItem("userId")
    
    //         if(accessToken != undefined && USERID != undefined && accessToken != null){

    //             await fetch('https://crib-llc.herokuapp.com/users/' + USERID, {
    //                 method: 'GET',
    //                 headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': 'Bearer ' + accessToken,
    //                 }
    //             }) 
    //             .then(res => res.json()).then(async userData =>{
    //                 let contactBy = userData.contactedBy;
    //                 let temp = [];
    //                 setContactedBy(
    //                     contactBy.filter((item)=> {
    //                         if(item.phoneNumber == ""){
    //                             return false;
    //                         }
    //                         if(temp.includes(item.phoneNumber)){
    //                             return false
    //                         }
    //                         temp.push(item.phoneNumber)
    //                         return true;
    //                     })
    //                 )
    //             })
    //         }
    
    // }






    const fetchConvos = useCallback(async() => {
        try{
            const accessToken = await EncryptedStorage.getItem("accessToken");

            if(accessToken != undefined){
           
                setUserId(USERID)
                let listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
                listQuery.includeEmpty = false;
                listQuery.order = 'latest_last_message'; 
                listQuery.limit = 30;   // The value of pagination limit could be set up to 100.
                
                if (listQuery.hasNext) {
                    listQuery.next(async function(groupChannels, error) {
                        if (error) {
                            // Handle error.
                            console.log("error", error)
                        }
                        var gcs = groupChannels.filter(function(item) {
                            return item.members.length == 2;
                          });
                        setConvoList(gcs)
                    });
                }
            }
        }
        catch{
            console.log("fetchconvo --- ERROR --- MESSAGE")
        }
        
    },[])

    return(
        <StyledView style={{backgroundColor:'white', flex: 1}} insets={insets}>

            
            
            {USERID != null ?
            <View style={{flex: 1}}>
                <InboxTitle>Messages</InboxTitle>
            {/* <SubleaseRequestContainer onPress={()=> navigation.navigate("CribConnectSubtenantMatches")}>
                <SubleaseRequestSubtitle>{contactedBy.length} Sublease requests </SubleaseRequestSubtitle>
                <SubleaseRequestText style={{marginTop: HEIGHT*0.01}}>These people saw your sublease and have specifically requested to book it. Get Crib Connect to connect with them.</SubleaseRequestText>
            </SubleaseRequestContainer> */}
            {convoList != null && convoList.length != 0 ?
            <FlatList
                style={{marginTop:HEIGHT*0.015}}
                data={convoList}
                contentContainerStyle={{ paddingBottom: 250 }}
                keyExtractor={item => item.url}
                renderItem={({item})=>(
                
                <FlatlistItemContainer hitSlop={WIDTH*0.05} onPress={()=> navigation.navigate("Chat", {url:item.url, id: userId})}>
                        <View style={{width:WIDTH*0.025, height: '100%', justifyContent:'center'}}>
                            {
                            item.unreadMessageCount == 0 ?
                                null
                                :
                                <FlatlistUnread>
                                    
                                </FlatlistUnread>
                            }
                        </View>
                        <FlatlistLeft>

                            <FastImage source = {{uri: item.coverUrl, priority: FastImage.priority.high}} style = {{ width: WIDTH*0.14, height: WIDTH*0.14, borderRadius: WIDTH*0.07 }}/>
                        </FlatlistLeft>
                        <FlatlistRight>
                        <LocationText numberOfLines={1}> {item.members.length < 2 ? "[DELETED] " :(item.members[0].nickname == firstName ? item.members[1].nickname : item.members[0].nickname)} - {item.name}</LocationText>

                            {item.lastMessage != undefined &&
                            <TextAndTime>
                                
                                <LastMessageTime unreadCount={item.unreadMessageCount}>{item.lastMessage.message}</LastMessageTime>
                            
                                <LastMessageTime  unreadCount={item.unreadMessageCount}>{new Date(item.lastMessage.createdAt).toLocaleTimeString()  }</LastMessageTime> 
                                
                            </TextAndTime>
                            }
                          
                        </FlatlistRight>
                        
                </FlatlistItemContainer>
                )}
            />
            :
            <View style={{paddingTop:HEIGHT*0.1}}>
                <Lottie source={require('../../../assets/nomessagenew.json')} autoPlay loop style={{width:WIDTH*0.3, height: WIDTH*0.3, alignSelf:'center'}}/>
                <DefaultPostFavText>No messages yet</ DefaultPostFavText>

            </View>
            }
            </View>
            
            :
            <NoUserViewContainer>
                <View style={{width:WIDTH*0.6, height: WIDTH*0.6, }}>
                    <Lottie source={require('../../../notLoggedIn.json')} style={{width:WIDTH*0.6, height: WIDTH*0.6, }}/>
                </View>
                <NoUserText>Login to view and post properties.</NoUserText>

                <LoginContainer hitSlop={WIDTH*0.05} onPress={()=> navigation.navigate("Login")}>
                    <LoginText>Login</LoginText>
                </LoginContainer>
                <SignupContainer hitSlop={WIDTH*0.05} onPress={()=> navigation.navigate("FirstLastName")}>
                    <SignupText>Sign up</SignupText>
                </SignupContainer>
            </NoUserViewContainer>
            }
        </StyledView>
    )
}
