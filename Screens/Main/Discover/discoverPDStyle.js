import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import { DARKGREY, EXTRALIGHT, MEDIUMGREY, PRIMARYCOLOR, HEIGHT, WIDTH,  TESTFONT, ROBOTOFONTFAMILY } from '../../../sharedUtils';

const PRIMARYGREY = '#5e5d5d'

export const ImageStyle= {position:'absolute', width:WIDTH, height:HEIGHT*0.35,}

export const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
  backgroundColor: white
  position: relative
`

export const PropertyDescription = styled.View`
    height: ${HEIGHT*0.875}px;
    width: ${WIDTH}px;
    position: relative
`

export const CardSectionOne = styled.View`
   
    padding-vertical: ${HEIGHT*0.02}px
    width:${WIDTH*0.9}px
    align-self:center
`
export const LocationDistanceContainer = styled.View`
    width: ${WIDTH*0.9}px;
    flex-direction: row
    align-items: center;
    
    padding-vertical: ${HEIGHT*0.01}px
  
   
`
export const LocationText = styled.Text`
    font-family: ${ROBOTOFONTFAMILY}
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 500;
    color: ${DARKGREY}
`

export const BedAndBathContainer = styled.View`
    margin-top: ${HEIGHT*0.025}px
    padding-vertical: ${HEIGHT*0.015}px
    width: ${WIDTH*0.9}px;
    flex-direction: row
    align-items: center;
    justify-content: space-between;
    background-color: ${EXTRALIGHT}
    border-radius:20px
`

export const BedBathLogo = styled.View`
   
    width: ${WIDTH*0.43}px
    border-width: 1px;
    border-color: ${PRIMARYGREY};
    border-radius: 15px;
    padding: ${WIDTH*0.02}px;
    justify-content: space-around
    align-items: center
    flex-direction: row
`

export const Divider = styled.View`
    align-self: center;
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.002}px;
    background-color: #E0E0E0
   
`
export const CardSectionTwo = styled.View`
    padding-vertical: ${HEIGHT*0.02}px
    width: ${WIDTH*0.9}px
    align-self: center
`
export const InfoContainer = styled.View`
    height: ${HEIGHT*0.065}px
    width: ${WIDTH*0.9}px;
    justify-content: space-between
    margin-top : ${HEIGHT*0.02}px

`
export const InfoHeaderText = styled.Text`
    
    
   
    font-size: ${HEIGHT*0.021}px;
    font-weight: 500;
    width: ${WIDTH*0.5}px;
    text-align: left
    font-family: ${ROBOTOFONTFAMILY}
`

export const InfoText = styled.Text`
    font-size: ${HEIGHT*0.015}px;
    font-weight: 400;
    width: ${WIDTH*0.5}px;
    color: ${PRIMARYGREY}
    margin-top: ${HEIGHT*0.005}px
    font-family: ${ROBOTOFONTFAMILY}
`

export const AmenitiesItem = styled.View`
   
    height: ${HEIGHT*0.05}px;
    align-items:center;
    flex-direction: row;
`
export const Footer = styled.View`

    width: ${WIDTH}px;
    padding-top: ${HEIGHT*0.025}px;
    padding-bottom: ${HEIGHT*0.04}px;
    justify-content: space-around;
    align-items: center
    flex-direction: row
    borderTopWidth: 1px;
    borderTopColor: #E0E0E0;

`
export const PricePerMonth = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 700;
    color: black
`
export const ContactTanentButton = styled(Pressable)`
    width: ${WIDTH*0.4}px;
    height: ${HEIGHT*0.06}px;
    background-color: ${props=>(props.ownProperty? MEDIUMGREY : PRIMARYCOLOR)};
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`

export const TenantInfoContainer = styled.View`
    margin-top: ${HEIGHT*0.025}px
    flex-direction: row;
    width: ${WIDTH*0.9}px;
    justify-content: space-between;
    align-items: center;
    background-color: ${EXTRALIGHT}
    border-radius: 20px
    padding-vertical:${HEIGHT*0.01}px
    padding-horizontal:${HEIGHT*0.01}px
`

export const TenantInfo = styled.View`
    font-family: ${ROBOTOFONTFAMILY}
    width: ${WIDTH*0.6}px;
    justify-content:space-between
    

`

export const ProfileImageContainer = styled.View`
    
    justify-content: center
`

export const CardSectionFour = styled.View`
   
    padding-left: 5%;
    padding-top: ${HEIGHT*0.03}px;
`

export const CardSectionFive = styled.View`
    padding-top: ${HEIGHT*0.02}px;

`

export const RowContainer = styled.View`
    margin-top: ${HEIGHT*0.02}px
    flex-direction: row
    align-items: center
`

export const DateContainer = styled.View`
    
    width: ${WIDTH*0.8}px;
    align-items: center
    flex-direction: row
`

export const DateText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    color: ${PRIMARYGREY}
    font-family: ${ROBOTOFONTFAMILY}
`

export const DescriptionContainer = styled.Text`
   
    width: ${WIDTH*0.9}px;
    color: ${PRIMARYGREY}
    align-self: center
    border-radius: 10px
    margin-top : ${HEIGHT*0.02}px
    font-family: ${ROBOTOFONTFAMILY}
    
`

export const TypeText = styled.Text`
    font-family: ${ROBOTOFONTFAMILY}
    font-size: ${HEIGHT*0.02}px;
    align-self: center;
    text-align: left
    font-weight: 600
    color: #3500a8
`

export const BedContainer = styled.View`
    height: 100%
    width: 33%
`

export const BedTopContainer = styled.View`
    flex-direction: row;
    width: 100%
    align-items: center
    justify-content: center

`

export const BedNumberText = styled.Text`
    
    font-size: ${HEIGHT*0.03}px;
    margin-left: ${WIDTH*0.01}px
`

export const BedroomNameText = styled.Text`
    margin-top: ${HEIGHT*0.005}px
    font-size: ${HEIGHT*0.015}px;
    justify-content: center;
    align-items: center
    align-self: center
    font-weight: 400
    font-family: ${ROBOTOFONTFAMILY}
`

export const InfoHeaderTextAndCenter = styled.View`
    width: ${WIDTH*0.9}px
    flex-direction: row;
    justify-content: space-between
`

export const StickyHeaderContainer = styled.View`
    height: ${HEIGHT*0.105}px
    width: ${WIDTH}px
    position: absolute
    align-items: flex-end
    top:0 
    flex-direction: row;
    justify-content: space-between
    padding-horizontal: ${WIDTH*0.05}px
`

export const StickyHeaderIcon = styled.Pressable`
    backgroundColor: rgba(43,43,43,0.8) 
    justifyContent: center
    alignItems: center
    width:${WIDTH*0.1}px 
    height: ${WIDTH*0.1}px
    borderRadius: ${WIDTH*0.05 }px
`
export const CardTitle = styled.Text`   
    font-size: ${HEIGHT*0.03}px;
    font-weight: 700;
    color: black
`

export const FavoriteContainer = styled.View`
  align-items: center
  justify-content: center
`

export const Section = styled.View`
    padding-vertical: ${HEIGHT*0.03}px
    width:${WIDTH*0.9}px
    align-self:center
    border-top-width: 1px;
    border-color: #E0E0E0
`
export const TypeLocationFavoriteContainer = styled.View`
    flex-direction: row;
    justify-content: space-between
`
export const TypeLocationContainer = styled.View`

`

export const PreviewCards = styled.Pressable`
  font-size: ${HEIGHT*0.03}px;
  font-weight: 700;
  color: black
`

export const PreviewLocationText = styled.Text`
  font-size: ${HEIGHT*0.0175}px;
  font-weight: 600;
  margin-top: ${HEIGHT*0.01}px
  color: black
`
export const BedBathDateContainer = styled.View`
    padding-top: ${HEIGHT*0.03}px
`

export const BedBathText = styled.Text`
    font-weight: 400;
    color: black
    font-size: ${HEIGHT*0.0175}px;
    padding-top: ${HEIGHT*0.005}px
`

export const DescriptionText = styled.Text`
    color: black   
    margin-top: ${HEIGHT*0.005}px
    font-size: ${HEIGHT*0.0175}px;
`

export const Subheading = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 600;
    color: black
`

export const DistanceText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 600;
    color: black
`
export const TenantInformationContainer = styled.View`
    flex-direction: row
    padding-top: ${HEIGHT*0.02}px
`

export const TenantProfileImageContainr = styled.View`
    justify-content: center;
    align-items: center
`
export const TenantNameScollOccupationContainer = styled.View`
    padding-left: ${WIDTH*0.05}px
    justify-content: center
`

export const TenantNameText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    color: black
    text-align: left
    padding-vertical: ${HEIGHT*0.002}px
`
export const AmenitiesContainer = styled.View`
    margin-top: ${HEIGHT*0.02}px
`

export const AmenitiesText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    color: black
    margin-left: ${WIDTH*0.03}px
`