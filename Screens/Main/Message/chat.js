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
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import {UserContext} from '../../../UserContext';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import {GiftedChat, Actions, Bubble , InputToolbar, Send} from 'react-native-gifted-chat';
import { ifIphoneX , getBottomSpace} from 'react-native-iphone-x-helper'

import FastImage from 'react-native-fast-image'

import EncryptedStorage from 'react-native-encrypted-storage';

import PropertyOptionsModal from './PropertyOptions';


const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header, LIGHTGREY, PRIMARYCOLOR} from '../../../sharedUtils'

import { MessageInput, MessageContainer, SendButton, PreviewContainer, PreviewInfoContainer, PreviewLocaitonText, PreviewDateText } from './chatStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ChatImageSettingContainer } from './chatStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function ChatScreen({navigation, route}){
 
    const {sb, USERID} = useContext(UserContext);
  
    const { url, id } = route.params;

    const GiftedChatRef = useRef();
    const [query, setQuery] = useState('')
    const [propertyInfo, setPropertyInfo] = useState(null)
    const [messages, setMessages] = useState([])
    const [typingText, setTypingText] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [recipient, setRecipient] = useState(null)
    const [optionsModal, setOptionsModal] = useState(false)

    

    const [channel, setChannel] = useState(null)

    const [receiverID, setReceiverID] = useState('')

    useEffect(()=>{
      onChat = true
      getGroupChannel()
     
      sb.addChannelHandler('channels', channelHandler);     
      
    }, [])

    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = async (targetChannel, m) => {
      await targetChannel.markAsRead()
      
      if (targetChannel.url === url) {
        m._id = m.messageId
        m.text = m.message
        m.user = {}
        m.user._id = m._sender.userId
        m.user.avatar = m._sender.plainProfileUrl
       
        
        setMessages(previousMessages => GiftedChat.append(previousMessages, [m]))
       
      }
    }


    const assignRecipient = () =>{
      if(channel != null && channel.members.length == 2){
        if(channel.members[0].userId == USERID){
          console.log("INSIDEEEE")
        
          setRecipient(channel.members[1].nickname)
        }else{
        
          setRecipient(channel.members[0].nickname)
        }
      } else{
        deletedChat(channel)
      }
    }
    const onSend = useCallback(async (messages = []) => {
      setSending(true)
      

      const params = new sb.UserMessageParams();
      params.message = messages[0].text;
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      sb.GroupChannel.getChannel(url, async function(groupChannel, error) {
        if (error) {
            console.log("ERROR CHANNEL 1")
        }
        else if(groupChannel.members.length ==2){
          await groupChannel.markAsRead()
          await groupChannel.sendUserMessage(params, async function(message, error) {
            if (error) {
              console.log("ERROR CHANNEL 2")
              console.log(error)
            }else{
           
            // The message is successfully sent to the channel.
            // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
              console.log("Message was successfully sent")
              // console.log(messages[0].text)
              const accessToken = await EncryptedStorage.getItem("accessToken")
              const uid = await EncryptedStorage.getItem("userId")
            
              if(accessToken != null){
                fetch('https://crib-llc.herokuapp.com/notifications/sendMessage', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'bearer ' + accessToken,

                },
                body: JSON.stringify({
                    participant1: groupChannel.members[0].userId,
                    participant2: groupChannel.members[1].userId,
                    senderId: uid,
                    message: messages[0].text
                })
                }).then(async res => {
                  
                })
              }
          }
          });
        } 
        else{
          deletedChat(groupChannel)
        }
      })
      setTypingText("")
      setSending(false)
    }, [])


    const getGroupChannel = async() => {
      await sb.GroupChannel.getChannel(url, async function(groupChannel, error) {
        if (error) {
            // Handle error.
            console.log("ERROR --- CHAT --- GETGROUPCHANNEL")
        }else{
          if(groupChannel.members.length < 2){
            deletedChat(groupChannel)
          } else{
            await groupChannel.markAsRead();
          setChannel(groupChannel)
          setReceiverID(groupChannel.members[0].userId == USERID ? groupChannel.members[1].userId : groupChannel.members[0].userId)   
          await getPropertyInfo(groupChannel.data, groupChannel)
          var listQuery = groupChannel.createPreviousMessageListQuery();
            setQuery(listQuery);
            fetchConvos(listQuery)
          }
        }
        setLoading(false)


        if(groupChannel != null && groupChannel.members.length == 2){
          if(groupChannel.members[0].userId == USERID){
            console.log("INSIDEEEE")
            setRecipient(groupChannel.members[1].nickname)
          }else{
            setRecipient(groupChannel.members[0].nickname)
          }
        } else{
          deletedChat(groupChannel)
        }
      })

    }

    const deletedChat = async (groupChannel) => {
      console.log("delete chat" , groupChannel)
      onChat= false
    
      await groupChannel.leave()
      navigation.navigate("Message")
      alert("The other user has left the chat.")
    }

    const getPropertyInfo = async (propId, gc) =>{
      await fetch('https://crib-llc.herokuapp.com/properties/' + propId, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(async e => e.json()).then(async (response) => {
        // console.log(response.propertyInfo.deleted)
        if(response.propertyInfo.deleted == true){
          if(loading == true){
            onChat = false
            alert("This property is unavailable.")
            await gc.leave()
            navigation.goBack()
          } 
        } else {
          setPropertyInfo(response)
        }
      })
      .catch(e=>{
        console.log("CATCHHHHHH", e)
      })

    }

    const loadMore = (listQuery) => {
      
      listQuery.limit = 20;
      listQuery.reverse = true;

      // Retrieving previous messages.
      listQuery.load(function(messages, error) {
        if (error) {
            // Handle error.
            console.log("ERROR CHANNEL")
        } else{
        messages.map(m => {
          m._id = m.messageId
          m.text = m.message
          m.user = {}
          m.user._id = m._sender.userId
          m.user.avatar = m._sender.plainProfileUrl
          

        })
        setMessages(previousMessages => GiftedChat.append(messages, previousMessages))
        }
        

    });
  }
    const fetchConvos = async (listQuery) => {
      
      listQuery.limit = 20;
      listQuery.reverse = true;
      // Retrieving previous messages.
      listQuery.load(async function(messages, error) {
        
          
        
       
        if (error) {
            // Handle error.
            console.log("ERROR --- CHAT --- FETCHCONVO")
        } 
        else{
         
            console.log("UPDATE --- CHAT --- FETCHCONVO")
            messages.map(m => {
              m._id = m.messageId
              m.text = m.message
              m.user = {}
              m.user._id = m._sender.userId
              m.user.avatar = m._sender.plainProfileUrl
            })
            setMessages(messages)
           
         
        // console.log(messages)
        }
        

    });
  }
 
    //navigation.navigate("PAGENAME",{userData: userData})

    //route.params.userData 

    async function leaveChat(){
        onChat= false
        await channel.leave()
      
        alert("You have successfully left this chat.")
        navigation.goBack()
    }

    const optionViewer = {
      viewProp : () => navigation.navigate("PropertyDetail", {data: propertyInfo}),
      viewRepUsr: () => navigation.navigate("ReportUser")

    }
    return(
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
    <HeaderContainer>
          <BackButtonContainer>
              <Pressable hitSlop={WIDTH*0.05} onPress={()=> { onChat=false, navigation.goBack()}}>
                  <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
              </Pressable>
          </BackButtonContainer>
          <NameContainer>
            <Header>{recipient}</Header>
          </NameContainer>
             
         
          <ChatImageSettingContainer>
              <Pressable hitSlop={WIDTH*0.1} onPress={()=> setOptionsModal(true)}>
                <Ionicons name="ellipsis-horizontal" size={25} />
              </Pressable>
          </ChatImageSettingContainer>
    </HeaderContainer>
    {propertyInfo != null &&
    <PreviewContainer onPress={()=>optionViewer.viewProp()}>
      
      <FastImage  
      source={{
        uri: propertyInfo.propertyInfo.imgList[0],
        priority: FastImage.priority.high,
      }}  
      style={{width:WIDTH*0.15, height:WIDTH*0.15, borderRadius:10, backgroundColor:LIGHTGREY,
      opacity: 1,
      }}
      />
     
      <PreviewInfoContainer >
        <PreviewLocaitonText numberOfLines={1}>{propertyInfo.propertyInfo.loc.secondaryTxt}</PreviewLocaitonText>
        <PreviewDateText>
        {new Date(propertyInfo.propertyInfo.availableFrom).toDateString().split(" ")[2]} {}
        {new Date(propertyInfo.propertyInfo.availableFrom).toDateString().split(" ")[1]} {}
        {new Date(propertyInfo.propertyInfo.availableFrom).toDateString().split(" ")[3]} {}
        - {}
        {new Date(propertyInfo.propertyInfo.availableTo).toDateString().split(" ")[2]} {}
        {new Date(propertyInfo.propertyInfo.availableTo).toDateString().split(" ")[1]} {}
        {new Date(propertyInfo.propertyInfo.availableTo).toDateString().split(" ")[3]} {}
        </PreviewDateText>
        <PreviewDateText>
          ${propertyInfo.propertyInfo.price} / month
        </PreviewDateText>
      </PreviewInfoContainer>


    </PreviewContainer>
    }

    {loading ?
      <ActivityIndicator size="large" color= {PRIMARYCOLOR} style={{marginTop: HEIGHT*0.1}} />
    :

      <GiftedChat
        
        ref={GiftedChatRef}
        bottomOffset={getBottomSpace()}
       
        renderInputToolbar={(props)=>(
          <MessageContainer>
              <MessageInput multiline value={typingText} onChangeText={(value)=> setTypingText(value)} placeholder="Enter a message ..." />
            
              <TouchableOpacity disabled={sending} hitSlop={WIDTH*0.05} onPress={()=> typingText != "" && props.onSend({text: typingText})}>
                <Ionicons name="arrow-up-circle" size={40} color={PRIMARYCOLOR}/>
              </TouchableOpacity>
              
          </MessageContainer>
        )}
        messages={messages}
        onSend={messages => onSend(messages)}
        loadEarlier = {true}
        infiniteScroll={true}
        onLoadEarlier = {() => loadMore(query)}
        renderLoadEarlier = {() => <View/>}
        user={{
          _id: USERID
        }}
      />  
      
      }
    <PropertyOptionsModal visible={optionsModal} close={()=>setOptionsModal(false)} leaveChat={leaveChat} optionViewer={optionViewer}/>
    </SafeAreaView>
    )
}