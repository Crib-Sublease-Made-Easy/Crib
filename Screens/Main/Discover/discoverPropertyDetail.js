import React, {useState, useEffect, useRef} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Dimensions,
    Button,
    Keyboard,
    TextInput,
    Image,
    Pressable
  } from 'react-native';


import { SharedElement } from 'react-navigation-shared-element';
import Ionicons from 'react-native-vector-icons/Ionicons';
Ionicons.loadFont()

import { Container, PropertyDescription, ImageStyle, CardSectionOne, CardTitle, LocationDistanceContainer,
        LocationText, BedAndBathContainer, BedBathLogo, Divider, CardSectionTwo, InfoHeaderText,
            InfoContainer, BothInfoContainer, InfoText, DescriptionText, AmenitiesItem, Footer,
            PricePerMonth, ContactTanentButton, TenantInfoContainer, TenantInfo, ProfileImageContainer,
            CardSectionFour, CardSectionFive, DateContainer, DateText, DescriptionContainer} from './discoverPDStyle'
import { FlatList } from 'react-native-gesture-handler';
import { LIGHTGREY } from '../../../sharedUtils';

const PRIMARYCOLOR = '#4050B5'
const PRIMARYGREY = '#5e5d5d'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;


export default function PropertyDetailScreen({navigation, route}){
    useEffect(()=>{
        console.log("Detail")
        console.log(route.params.data)
    }, [])
    const flatListRef = useRef(null)
    const propertyAmenities = (["Furnished", "Pets Allowed", "Able to renew", "On-site waher and dryer"]);
    const propData = route.params.data.propertyInfo;
    const postedUserData = route.params.data.postedUserInfo;
    const viewabilityConfigCallbackPairs = useRef([
        { onViewableItemsChanged: testFuction },
    ]);
    const [flatingScrolling, setFlatlistScrolling] = useState(false)
    
   
    const testFuction = ({
        viewableItems,
      }) => {
        console.log(viewableItems)
      };

    return(
       
        <Container>             
            <PropertyDescription>
    
                <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={{height:HEIGHT*0.35, width:WIDTH}}>
                        <FlatList 
                        horizontal 
                        style={{position:'absolute', width:WIDTH, height:HEIGHT*0.35, overflow:'hidden'}}
                        data={propData.imgList}
                        ref={flatListRef}
                        renderItem={({item})=>(
                           
                            <View style={{width:WIDTH, height:HEIGHT*0.35,justifyContent:'center'}}>
                                <Image source={{uri: item}} style={{width:WIDTH, height:HEIGHT*0.35,}} />
                                
                            </View>
                        )}
                        snapToAlignment="center"
                        decelerationRate={"fast"}
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        snapToInterval={WIDTH}
                        viewabilityConfigCallbackPairs={
                            viewabilityConfigCallbackPairs.current
                        }
                        />
                            
                            {/* <Image style={ImageStyle} source={{uri: data.imgList[0]}}/> */}
                        <View style={{width: WIDTH, height: HEIGHT*0.02, position:'absolute', bottom:HEIGHT*0.05, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                            {propData.imgList.map((data, index)=>(
                                <View key={"img"+ index} style={{marginLeft:WIDTH*0.02, marginRight:WIDTH*0.02, height:HEIGHT*0.015, width:HEIGHT*0.015, 
                                borderRadius:HEIGHT*0.0075,backgroundColor:'white' }}>
                                </View>
                            ))

                            }

                        </View>
                        <Pressable  style={{backgroundColor:'rgba(43,43,43,0.8)',justifyContent:'center', alignItems:'center',
                         position:'absolute',top:HEIGHT*0.05, left:WIDTH*0.05, width:WIDTH*0.1, height:WIDTH*0.1, borderRadius: WIDTH*0.05 }} onPress={()=>navigation.goBack()}>
                            <Ionicons  name="arrow-back-outline" size={25} color='white'></Ionicons>
                        </Pressable>
                    </View>
                    
                    <CardSectionOne>
                        <CardTitle>{propData.loc.streetAddr}</CardTitle>
                        <LocationDistanceContainer>
                            <Ionicons name="location-outline" size={20} />
                            <LocationText>Mountain View , CA</LocationText>
                            {/* <LocationText>3 miles away</LocationText> */}
                        </LocationDistanceContainer>
                        <BedAndBathContainer>
                            <BedBathLogo>
                                <Ionicons name="bed-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bed} bedroom</LocationText>
                            </BedBathLogo>
                            <BedBathLogo>
                                <Ionicons name="eye-off-outline" size={25} color={PRIMARYGREY}></Ionicons>
                                <LocationText>{propData.bath} bathroom</LocationText>
                            </BedBathLogo>
                        </BedAndBathContainer>
                    </CardSectionOne>   
                    <Divider></Divider>
                    <CardSectionTwo>
                        <BothInfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Property Type:</InfoHeaderText>
                                <InfoText>{propData.type}</InfoText>
                            </InfoContainer>
                            <InfoContainer> 
                                <InfoHeaderText>Availability:</InfoHeaderText>
                                <DateContainer>
                                    <DateText>{new Date(propData.availableFrom).toDateString()}</DateText>
                                    <Ionicons name="repeat" size={25} />
                                    <DateText>{new Date(propData.availableTo).toDateString()}</DateText>
                                </DateContainer>
                            </InfoContainer>
                        </BothInfoContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    <CardSectionTwo>
                        <InfoHeaderText>Descriptions:</InfoHeaderText>
                        <DescriptionContainer>
                            <Text>
                                {propData.description}
                            </Text>
                        </DescriptionContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    
                    <CardSectionTwo>
                        <InfoHeaderText>Teanant Information:</InfoHeaderText>
                        <TenantInfoContainer>
                            <ProfileImageContainer>
                                <Image source={{uri:postedUserData.profilePic}} style={{height:HEIGHT*0.125, width:HEIGHT*0.125, borderRadius:HEIGHT*0.125/2, backgroundColor:LIGHTGREY}}/>
                            </ProfileImageContainer>
                            <TenantInfo>
                                <InfoHeaderText style={{width: WIDTH*0.6}}>{postedUserData.firstName} {postedUserData.lastName}</InfoHeaderText>
                                <InfoText>Software Engineer</InfoText>
                                <InfoText>Harvard University</InfoText>
                            </TenantInfo>
                        </TenantInfoContainer>
                    </CardSectionTwo>
                    <Divider></Divider>
                    <CardSectionOne>
                        <InfoHeaderText>Amenities:</InfoHeaderText>
                        {propData.amenities.map((value)=>(
                            <AmenitiesItem key={value}>
                                <LocationText>{value}</LocationText>
                                <Ionicons name="checkbox" size={WIDTH*0.075} color={PRIMARYCOLOR}></Ionicons>
                            </AmenitiesItem>

                        ))}
                    </CardSectionOne>
                    
                </ScrollView>
            </PropertyDescription>
            <Footer>
                    <PricePerMonth>${propData.price} <Text style={{fontSize: HEIGHT*0.025, fontWeight:'500'}}>/ month</Text></PricePerMonth>
                    <ContactTanentButton>
                        <Text style={{color:'white', fontWeight:'700'}}>Contact Tenant</Text>
                    </ContactTanentButton>
            </Footer>

        </Container>
       
        
    )
}