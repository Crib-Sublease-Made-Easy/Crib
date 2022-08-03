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
  Pressable
} from 'react-native';
import {UserContext} from '../../../UserContext';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
import {GiftedChat, Actions, Bubble , InputToolbar, Send} from 'react-native-gifted-chat';
import { ifIphoneX , getBottomSpace} from 'react-native-iphone-x-helper'

import PropertyOptionsModal from './PropertyOptions';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import { HeaderContainer, BackButtonContainer,  NameContainer, ResetButtonContainer , Header} from '../../../sharedUtils'

import { MessageInput, MessageContainer, SendButton } from './chatStyle';

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { ChatImageSettingContainer } from './chatStyle';

export default function ChatScreen({navigation, route}){
    const {sb} = useContext(UserContext);
    const { url, id } = route.params;

    const GiftedChatRef = useRef();
    const [query, setQuery] = useState('')
    const [propertyInfo, setPropertyInfo] = useState(null)
    const [messages, setMessages] = useState('')
    const [typingText, setTypingText] = useState('')
    const [loading, setLoading] = useState(true)

    const [optionsModal, setOptionsModal] = useState(false)

    const [channel, setChannel] = useState(null)
    useEffect(()=>{
      
      sb.addChannelHandler('channels', channelHandler);
      getGroupChannel()
      console.log("USE EFFECYT")
    }, [channel])

    const channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = async (targetChannel, m) => {
      await channel.markAsRead()

      if (targetChannel.url === url) {
        m._id = m.messageId
        m.text = m.message
        m.user = {}
        m.user._id = m._sender.userId
        m.user.avatar = m._sender.plainProfileUrl
        setMessages(previousMessages => GiftedChat.append(previousMessages, [m]))
      }
    }


    const onSend = useCallback((messages = []) => {
      const params = new sb.UserMessageParams();
      params.message = messages[0].text;
      console.log(params.message)
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
      sb.GroupChannel.getChannel(url, async function(groupChannel, error) {
        if (error) {
            console.log("ERROR CHANNEL 1")
        }else{
          await groupChannel.markAsRead()
          groupChannel.sendUserMessage(params, function(message, error) {
            if (error) {
              console.log("ERROR CHANNEL 2")
              console.log(error)
            }else{
            // The message is successfully sent to the channel.
            // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
              console.log("Message was successfully sent")
            
            
          }
          });
        }
      })
      setTypingText("")
    }, [])


    const getGroupChannel = async() => {
      sb.GroupChannel.getChannel(url, async function(groupChannel, error) {
        if (error) {
            // Handle error.
            console.log("ERROR CHANNEL")
        }else{
          await groupChannel.markAsRead()

          await setChannel(groupChannel)
          console.log("GROUP CHANNEL", groupChannel.data)
          await getPropertyInfo(groupChannel.data)
          var listQuery = groupChannel.createPreviousMessageListQuery();
          await setQuery(listQuery)
          fetchConvos(listQuery)
        }
      })
    }

    const getPropertyInfo = async (propId) =>{
      console.log("RENDEREDDDDDDDDD")
      
      await fetch('https://sublease-app.herokuapp.com/properties/' + propId, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(async e => e.json()).then(async (response) => {
        console.log(response.propertyInfo.deleted)
        
        if(response.propertyInfo.deleted == true){
          if(loading == true){
            alert("This property is unavailable.")
            channel.leave()
            navigation.goBack()
            setLoading(false)

          } else {
            setLoading(false)
          }
        } else {
          setPropertyInfo(response)
        }
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
        console.log("messages fetched")
        messages.map(m => {
          m._id = m.messageId
          m.text = m.message
          m.user = {}
          m.user._id = m._sender.userId
          m.user.avatar = m._sender.plainProfileUrl
        })
        setMessages(previousMessages => GiftedChat.append(messages, previousMessages))
        console.log(messages)
        }
        

    });
  }
    const fetchConvos = (listQuery) => {
      
      listQuery.limit = 20;
      listQuery.reverse = true;

    // Retrieving previous messages.
      listQuery.load(function(messages, error) {
        if (error) {
            // Handle error.
            console.log("ERROR CHANNEL")
        } else{
        console.log("messages fetched")
        messages.map(m => {
          m._id = m.messageId
          m.text = m.message
          m.user = {}
          m.user._id = m._sender.userId
          m.user.avatar = m._sender.plainProfileUrl
        })
        setMessages(messages)
        console.log(messages)
        }
        

    });
      console.log(listQuery)
    //   fetch('https://api-14BD0602-4159-48D7-9292-66136C479B46.sendbird.com/v3/group_channels/'+'205308348_48a354561b8903d19eaa9d4c91b23fdb3cd98264'+'/messages')
    //   .then(response => response.json())
    //   .then(data => console.log(data));
  
  }

    //navigation.navigate("PAGENAME",{userData: userData})

    //route.params.userData 


    return(
    <SafeAreaView style={{backgroundColor:'white', flex:1}}>
    <HeaderContainer>
          <BackButtonContainer>
              <Pressable style={{height:'50%', width:'50%', alignItems:'center'}} onPress={()=> navigation.goBack()}>
                  <Ionicons name='arrow-back-outline' size={25} style={{paddingHorizontal:WIDTH*0.02}}/>
              </Pressable>
          </BackButtonContainer>
          {channel != null ? 
            channel.members[0].userId == id ?
              <NameContainer>
                  <Header>{channel.members[1].nickname}</Header>
              </NameContainer>
              :
              <NameContainer>
              <Header>{channel.members[0].nickname}</Header>
               </NameContainer>
          :
          null
          }
          {channel != null ?
          <ChatImageSettingContainer>
              {/* <Pressable disabled={loading} style={{alignItems:'center'}} >
                <Image source={{uri:channel.coverUrl}} style={{height:HEIGHT*0.035, width:HEIGHT*0.035, borderRadius:HEIGHT*0.025/2, backgroundColor:'grey'}}/>
              </Pressable> */}
              <Pressable onPress={()=> setOptionsModal(true)}>
                <Ionicons name="ellipsis-horizontal" size={25} />
              </Pressable>
          </ChatImageSettingContainer>
          : null}
          
      </HeaderContainer>
    
    <GiftedChat
      
      ref={GiftedChatRef}
      bottomOffset={getBottomSpace()}
      renderInputToolbar = {(props)=>(
       
          <MessageContainer>
            <MessageInput value={typingText} onChangeText={(value)=> setTypingText(value)} placeholder="Enter a message ..." />
           
            <TouchableOpacity onPress={()=> typingText != "" && props.onSend({text: typingText} )}>
              <Ionicons name="arrow-up-circle" size={40} color='#24a2fe'/>
            </TouchableOpacity>
            
          </MessageContainer>
       
      )}
        // renderSend = {(props)=>(
        //   <TouchableOpacity onPress={()=> props.onSend({text: "Hello"})}>
        //     <Ionicons name="arrow-up-circle" size={40} color='#24a2fe'/>
        //   </TouchableOpacity>
        // )}
     
      
      
      messages={messages}
      onSend={messages => onSend(messages)}
      loadEarlier = {true}
      infiniteScroll={true}
      onLoadEarlier = {() => loadMore(query)}
      renderLoadEarlier = {() => <View></View>}
      user={{
        _id: id
      }}
    />
    <PropertyOptionsModal visible={optionsModal} close={()=>setOptionsModal(false)} viewProp={()=> navigation.navigate("PropertyDetail", {data: propertyInfo})}/>
    </SafeAreaView>
    )
}
