import React , {useContext, useState, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
  Image,
  Pressable,
  Animated
} from 'react-native';
import { User } from 'realm';
import { UserContext } from '../../../UserContext';

import ProfileEditModal from './profileEdit';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()


import { Header,Container, HeaderLeftContainer, HeaderRightContainer, NameText, OccupationText,EditProfilePressable,SlidingContainer,
    PostContainer, FavContainer, PostedText, FavText,  DefaultPostFavText
 } from './profileStyle';
export default function ProfileScreen(){
    const scrollviewRef = useRef(null)
    const {user, logout} = useContext(UserContext)
    const [tabPressed, setTabPressed] = useState("Posted")
    const [postedProperties, setPostedProperties] = useState([])
    const [favoriteProperties, setFavoriteProperties] = useState([])

    const [editProfileModal, setEditProfileModal] = useState(false)

    const translation = useRef(new Animated.Value(0)).current

    function PressPosted(){
        Animated.spring(translation,{
        toValue: 0,
        duration:100,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        scrollviewRef.current.scrollTo({x:0})
    }
    function PressFav(){
        Animated.spring(translation,{
        toValue: WIDTH*0.45 ,
        duration:100,
        bounciness:0,
        speed: 5,
        useNativeDriver:false,
        }).start()
        scrollviewRef.current.scrollTo({x:WIDTH})
    }
    return(
        <SafeAreaView style={{backgroundColor:'white'}}>
            <Header>
                <Pressable >
                    <FontAwesome name='gear' size={30} />
                </Pressable>
            </Header>
            <Container>
                <Image style={{width:WIDTH*0.35, height: WIDTH*0.35, borderRadius: WIDTH*0.175, alignSelf:'center', backgroundColor:'pink'}} />
            
                <NameText>Vineesh Jonarathanan</NameText>
                <OccupationText>Software engineer</OccupationText>

                <EditProfilePressable onPress={()=>setEditProfileModal(true)}>
                    <Text style={{color:'white',}}>Edit Profile</Text>
                </EditProfilePressable>
                <SlidingContainer>
                    <Animated.View style={{width:WIDTH*0.35, height: HEIGHT*0.05, borderRadius: 25, position:'absolute', left:WIDTH*0.05,
                     backgroundColor:PRIMARYCOLOR, opacity:0.2, transform:[{translateX: translation}]}}></Animated.View>
                    <PostContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Posted'), PressPosted()}}>
                        <FontAwesome name='home'  size={20} color={tabPressed == 'Posted' ? PRIMARYCOLOR : PRIMARYGREY}/>
                        <PostedText tabPressed={tabPressed} >Posted</PostedText>
                    </PostContainer>
                    <FavContainer tabPressed={tabPressed} onPress={()=> {setTabPressed('Fav'), PressFav()}}>
                        <FontAwesome name='heart' size={20} color={tabPressed == "Fav" ? PRIMARYCOLOR : PRIMARYGREY} />
                        <FavText tabPressed={tabPressed}>Favorite</FavText>
                    </FavContainer>
                </SlidingContainer>

            <ScrollView ref={scrollviewRef} horizontal snapToAlignment='start' snapToInterval={WIDTH} decelerationRate='fast'
                style={{width:WIDTH, height:HEIGHT*0.4}}>
                <View style={{ width:WIDTH, height:HEIGHT*0.4, justifyContent:'center', alignItems:'center'}}>
                    {postedProperties.length == 0 &&
                        <View style={{width:WIDTH, height:HEIGHT*0.3, alignItems:'center'}}>
                            <Image source={require('../../../assets/PostedHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.175}} />
                            <Pressable style={{width:WIDTH*0.5, height:HEIGHT*0.06, borderRadius:30,
                            backgroundColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:HEIGHT*0.0175, fontWeight:'500'}}>Start Sublease</Text>
                            </Pressable>
                        </View>
                    }
                </View>
                <View style={{width:WIDTH, height:HEIGHT*0.3}}>
                    {postedProperties.length == 0 &&
                        <View style={{width:WIDTH, height:HEIGHT*0.3,alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../../assets/FavHome.jpg')} style={{width:WIDTH*0.7, height:HEIGHT*0.2}} />
                            <DefaultPostFavText>You haven't liked any properties yet...</ DefaultPostFavText>
                        </View>
                    }
                </View>
                <ProfileEditModal editProfileModal={editProfileModal} closeModal={()=>setEditProfileModal(false)}/>
            </ScrollView>
            </Container>
        </SafeAreaView>
    )
}