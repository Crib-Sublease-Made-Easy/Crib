import {Pressable, Text} from 'react-native';

import styled from 'styled-components/native';
import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, EXTRALIGHT, MEDIUMGREY, DARKGREY } from '../../../../sharedUtils';


export const Section = styled.View`
    padding-vertical: ${HEIGHT*0.04}px
    width: ${WIDTH*0.9}px
    align-self: center
    border-top-width: 1px;
    border-color: ${LIGHTGREY}
   
`


export const HeaderContainer = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT*0.05}px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
    align-self:center
`

export const BackButtonContainer = styled.View`
    padding-left: ${WIDTH*0.025}px
    width: ${WIDTH*0.25}px;
    height: 100%
    justify-content: center;
    align-items:flex-start;

`

export const NameContainer = styled.View`
    width: ${WIDTH*0.5}px;
    justify-content: center;
    align-items:center
 
  `

export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
    color: black
`

export const InputForm = styled.View`
    width: ${WIDTH}px;
   
`

export const InputSection = styled.View`
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0
    align-self: center
    flex-direction: row
    justify-content: space-between
`
export const InputSectionCol = styled.View`
   
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0
    align-self: center
    padding-bottom: ${HEIGHT*0.015}px
`

export const InputNameContainer = styled.View`
   
    justify-content: center;
    
`

export const InputName = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 600;
    color: black
`
export const InputOptionContainer = styled.View`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.03}px
    flex-direction: row;
    
    align-items: center
    align-self: center
`

export const BedroomOptions = styled(Pressable)`
    padding-horizontal: ${WIDTH*0.05}px
    padding-vertical: ${HEIGHT*0.007}px
    background-color: ${props=>(props.value == props.inputValue ? PRIMARYCOLOR : 'white')}
    border-width: 1.5px
    border-color: ${LIGHTGREY}
    margin-left: ${props=>(props.index == 0 ? 0 :WIDTH*0.03)}px
    border-radius: 10px
`

export const BedroomOptionsText = styled(Text)`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 500
    color: ${props=>(props.value == props.inputValue ? 'white' : 'black')}
`

export const PropertyTypeName = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    margin-left: ${WIDTH*0.025}px
    color: black
`


export const TypeContainer = styled.View`
    width: ${WIDTH*0.9}px;
    justify-content: space-between;
`

export const TypeOption = styled.Pressable`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.02}px
    flex-direction: row;
    justify-content: space-between;
    align-self: center
    align-items: center   
`

export const InputPressableContainer = styled.Pressable`
    padding-left: ${WIDTH*0.01}px;
`

export const InputPriceRangeContainer = styled.View`
    justify-content: flex-end;
    align-items: center
    flex-direction: row
`

export const PriceRangeText = styled.Text`
   
    font-size: ${HEIGHT*0.0175}px;
    color: black
    font-weight: 500;
`

export const PriceInputSection = styled.View`
   
    width: ${WIDTH*0.9}px;
    border-bottom-width: 1px;
    border-color: #E0E0E0 
    align-self:center
`

export const AmenitiesInputSection = styled.View`
    width: ${WIDTH*0.8}px;
    align-self:center
    height: ${HEIGHT*0.075}px;
    justify-content: center
`

export const IndividualAmenitiesContainer = styled.View`
    width: ${WIDTH*0.9}px
    flex-direction: row
    justify-content: space-between
    padding-vertical: ${HEIGHT*0.01}px
`
export const DoneContainer = styled.View`
   
    
    width: ${WIDTH}px;
    padding-bottom: ${HEIGHT*0.05}px;
    align-items:center

`

export const DoneButton = styled.Pressable`
    width: ${WIDTH*0.8}px;
    height: ${HEIGHT*0.075}px;
    background-color: ${PRIMARYCOLOR};
    align-self:center;
    margin-top:${HEIGHT*0.03}px;
    border-radius: 20px;
    justify-content: center;
    align-items:center
`

export const DoneText = styled.Text`
    font-size: ${HEIGHT*0.03}px;
    font-weight:700;
    align-self: center
    color: white
`

export const BedBathNumberText = styled.Text`
    width: ${WIDTH*0.1}px;
    font-size:${HEIGHT*0.02}px;
    text-align: center
`

export const ReviewLocationContainer = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
    flex-direction: row;
    align-items: center
    width: ${WIDTH*0.9}px
`
export const ReviewInfoText = styled.Text`
    font-size: ${HEIGHT*0.018}px;
    font-weight: 400;
    color: white
    margin-top: ${HEIGHT*0.01}px;
`
export const AmenitiesContainer = styled.Text`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.02}px
   
`
export const NameIcon = styled.Pressable`
    flex-direction: row;
`

export const DateInputPressable = styled.Pressable`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.05}px
    border-radius: 10px;
    border-color: ${MEDIUMGREY}
    border-width: 2px
    justify-content: center
    padding-left: ${WIDTH*0.025}px
    margin-top: ${HEIGHT*0.02}px
    margin-bottom: ${HEIGHT*0.02}px
`

export const DateText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    margin-left: ${WIDTH*0.025}px
    color: black
`

export const Footer = styled.View`
    height: ${HEIGHT*0.1}px
    width: ${WIDTH}px
    padding-horizontal: ${WIDTH*0.05}px
    backgroundColor: white
    align-self: center
    flex-direction: row;
    justify-content: space-between;
    align-items: center
    border-top-width: 1px
    border-color: ${MEDIUMGREY}
    
`

export const ResetText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    color: black
    font-weight: 500
`

export const ApplyButton = styled.Pressable`
    width: ${WIDTH*0.425}px;
    height: ${HEIGHT*0.06}px;
    border-radius: 10px;
    background-color: ${PRIMARYCOLOR};
    justify-content: center;
    align-items: center
    
`
export const ResetButtonContainer = styled.Pressable`
    width: ${WIDTH*0.425}px;
    height: ${HEIGHT*0.06}px;
    border-radius: 10px;
    background-color: #f2f0f0
    justify-content: center;
    align-items: center
    
`

export const ApplyText = styled.Text`
    font-size: ${HEIGHT*0.0175}px;
    color: white
    font-weight: 500
   
`