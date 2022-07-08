import React, {useState, useRef, useEffect} from 'react'
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

import Modal from "react-native-modal";
import { SlideInUp, SlideOutDown } from 'react-native-reanimated';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
FontAwesome.loadFont()

import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()


import { HeaderContainer, BackButtonContainer, NameContainer, Header, DoneButtonContainer } from './profileEditStyle';

export default function ProfileEditModal({editProfileModal, closeModal}){
    return(
        <Modal isVisible={editProfileModal} style={{padding: 0, margin: 0}} animationIn="slideInUp" animationOut='slideOutDown'
         backdropOpacity={0} hideModalContentWhileAnimating>
        <SafeAreaView style={{flex: 1, backgroundColor:'white'}}>
           
                <HeaderContainer>
                    <BackButtonContainer>
                    <Pressable style={{height:'50%', width:'50%'}} onPress={()=>closeModal()}>
                        {/* <FontAwesome name='arrow-left' size={25} /> */}
                        <Ionicons name='arrow-back-outline' size={25} />
                    </Pressable>
                    </BackButtonContainer>
                    <NameContainer>
                        <Header>Edit Profile</Header>
                    </NameContainer>
                    <DoneButtonContainer>
                    <Pressable style={{height:'50%', width:'50%'}} onPress={()=>close()}>
                        <FontAwesome name='check' size={25} />
                    </Pressable>
                    </DoneButtonContainer>
                </HeaderContainer>
           
        </SafeAreaView>
        </Modal>
    )
}