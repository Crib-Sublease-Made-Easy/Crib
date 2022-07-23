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

const Item = ({ item }) => (
    <View >
      <Text >{item}</Text>
    </View>
  );

export default function MessageScreen({navigation, route}){
    const {sb} = useContext(UserContext);

    const [convoList, setConvoList] = useState('')
    const [userId, setUserId] = useState('')

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            sb.addChannelHandler('channels', channelHandler);
            fetchConvos()
        });
        
        
      
    }, [])

    const renderItem = ({ item }) => (
        <View >
        <Text >{item}</Text>
        </View>
    );

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
                console.log("new console list")
                groupChannels.forEach(channel => {
                    console.log(channel)
                });
        
            });
        }
    }

    //navigation.navigate("PAGENAME",{userData: userData})

    //route.params.userData 


    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            <View style={{width:WIDTH, height:HEIGHT*0.3,justifyContent:'center'}}>
                <Text>Inbox</Text>
            </View>
            <FlatList
                 data={convoList}
                 contentContainerStyle={{ paddingBottom: 250 }}
                keyExtractor={item => item.url}
                renderItem={({item})=>(
                
                    <TouchableOpacity style={{width: WIDTH * 0.9,justifyContent:'center', paddingRight:10}} onPress={()=> navigation.navigate("Chat", {url:item.url, id: userId})}>
                        <View style={{ flex:1,flexDirection:'row'}}>
                        <Image source = {{uri: item.coverUrl}}
   style = {{ width: 50, height: 50 }}
   />
                        <Text numberOfLines={1}>Vinesh - {item.name}{item.name} </Text>
                        
                        </View>
                        <Text>{item.lastMessage.message}</Text>
                        <Text>{new Date(item.lastMessage.createdAt).toLocaleTimeString()  }</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity >

                </TouchableOpacity>
        </SafeAreaView>
    )
}
