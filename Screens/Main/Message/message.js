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
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'


import Lottie from 'lottie-react-native';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { InboxTitle, FlatlistItemContainer, FlatlistUnread, FlatlistLeft, FlatlistRight, 
    LocationText,TextAndTime, LastMessageTime, DefaultPostFavText, NoUserViewContainer,
LoginContainer, SignupContainer, LoginText, SignupText, NoUserText } from './messageStyle';

export default function MessageScreen({navigation, route}){

    const {sb, USERID, user} = useContext(UserContext);

    const [convoList, setConvoList] = useState([])
    const [userId, setUserId] = useState('')
    const [receiverName, setReceiverName] = useState('')
   


    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("FOCUSSSSSS")            
            fetchConvos()
            
        });
        sb.addChannelHandler('channels', channelHandler);

        return unsubscribe

        // return unsubscribe;

    }, [navigation, convoList])

    const channelHandler = new sb.ChannelHandler();
    
    channelHandler.onChannelChanged = channel => {
        console.log("rEFRESH")

        fetchConvos()
      };

  
    const fetchConvos = useCallback(async() => {

        const refreshToken = await SecureStorage.getItem("refreshToken");

        if(refreshToken != undefined){
       
            setUserId(USERID)
            let listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
            
            listQuery.includeEmpty = false;
            listQuery.order = 'latest_last_message'; 
            listQuery.limit = 15;   // The value of pagination limit could be set up to 100.
            
            if (listQuery.hasNext) {
                listQuery.next(async function(groupChannels, error) {
                    if (error) {
                        // Handle error.
                        console.log("error", error)
                    }

                    setConvoList(groupChannels)

                });
            }
        }
        return;
    },[])

    //navigation.navigate("PAGENAME",{userData: userData})

    //route.params.userData 


    return(
        <SafeAreaView style={{backgroundColor:'white', flex: 1}}>

            
            
            {user != null ?
            <View style={{flex: 1}}>
                <InboxTitle>Messages</InboxTitle>
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

                            <Image source = {{uri: item.coverUrl}} style = {{ width: WIDTH*0.14, height: WIDTH*0.14, borderRadius: WIDTH*0.07 }}/>
                        </FlatlistLeft>
                        <FlatlistRight>
                        <LocationText numberOfLines={1}>{item.name}</LocationText>

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
                <Lottie source={require('../../../noMessage.json')} autoPlay loop={false} style={{width:WIDTH*0.3, height: WIDTH*0.3, alignSelf:'center'}}/>
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
        </SafeAreaView>
    )
}
