//Lobby
import React, {useState, useEffect, useRef, useContext} from 'react';
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
  Image
} from 'react-native';
import {UserContext} from '../../../UserContext';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { InboxTitle, FlatlistItemContainer, FlatlistLeft, FlatlistRight, LocationText,TextAndTime, LastMessageTime } from './messageStyle';

export default function MessageScreen({navigation, route}){
    const {sb} = useContext(UserContext);

    const [convoList, setConvoList] = useState('')
    const [userId, setUserId] = useState('')
    const [receiverName, setReceiverName] = useState('')

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            sb.addChannelHandler('channels', channelHandler);
            fetchConvos()
        });
        return unsubscribe
      
    }, [])

    const channelHandler = new sb.ChannelHandler();
    channelHandler.onChannelChanged = channel => {
        fetchConvos()
      };
    const fetchConvos = async() => {
        const UID = await SecureStorage.getItem("userId");
        setUserId(UID)
        var listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
        listQuery.includeEmpty = true;
        listQuery.order = 'latest_last_message'; 
        listQuery.limit = 15;   // The value of pagination limit could be set up to 100.
        
        if (listQuery.hasNext) {
            listQuery.next(function(groupChannels, error) {
                if (error) {
                    // Handle error.
                }
                setConvoList(groupChannels)
                // A list of group channels is successfully retrieved.
                // console.log("new console list")
                groupChannels.forEach(channel => {
                    // console.log(channel)
                    // console.log("===============")
                    // console.log(channel.memberMap.
                   
                  
                });
        
            });
        }
    }

    //navigation.navigate("PAGENAME",{userData: userData})

    //route.params.userData 


    return(
        <SafeAreaView style={{backgroundColor:'white', flex: 1}}>
            <InboxTitle>Messages</InboxTitle>
            <FlatList
                style={{marginTop:HEIGHT*0.015}}
                data={convoList}
                contentContainerStyle={{ paddingBottom: 250 }}
                keyExtractor={item => item.url}
                renderItem={({item})=>(
                
                <FlatlistItemContainer onPress={()=> navigation.navigate("Chat", {url:item.url, id: userId, receiverName:Object.values(item.memberMap)[0].nickname})}>
                        <FlatlistLeft>
                            <Image source = {{uri: item.coverUrl}} style = {{ width: WIDTH*0.14, height: WIDTH*0.14, borderRadius: WIDTH*0.07 }}/>
                        </FlatlistLeft>
                        <FlatlistRight>
                            <LocationText>{item.name}</LocationText>
                            
                            {item.lastMessage != undefined &&
                            <TextAndTime>
                                <LastMessageTime>{item.lastMessage.message}</LastMessageTime>
                                <LastMessageTime>{new Date(item.lastMessage.createdAt).toLocaleTimeString()  }</LastMessageTime> 
                            </TextAndTime>
                            }
                          
                        </FlatlistRight>
                </FlatlistItemContainer>
                )}
            />
            <TouchableOpacity >

                </TouchableOpacity>
        </SafeAreaView>
    )
}
