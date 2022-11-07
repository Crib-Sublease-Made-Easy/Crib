import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, DARKGREY, EXTRALIGHT, GOOGLEBLUE } from '../../../sharedUtils'
export const HeaderContainer = styled.View`
    width: ${WIDTH}px;
    padding-vertical: ${HEIGHT*0.02}px
    padding-horizontal: ${WIDTH*0.05}px
    flex-direction: row;
    border-bottom-width: 0.5px;
    border-color: #E0E0E0
    align-self:center
    aling-items: center
    justify-content: space-between
`

export const BackButtonContainer = styled.View`
    width: ${WIDTH*0.2}px
    justify-content: center;
`

export const NameContainer = styled.View`
    justify-content: center;
    align-items:center
    align-self: center
`

export const ResetButtonContainer = styled.View`
    width: ${WIDTH*0.25}px;
    padding-right: ${WIDTH*0.025}px
    height: 100%
    justify-content: center;
    align-items:flex-end;
`

export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
    color: black
`
export const NameText = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    width: ${WIDTH*0.9}px
    font-weight: 500;
    text-align:center
    color: black
`

export const TopContainer = styled.View`
    width: ${WIDTH*0.9}px;
    align-self: center
    justify-content: center
    align-items:center
    padding-vertical: ${HEIGHT*0.03}px
`

export const ImageContainer = styled.Pressable`
    width: ${WIDTH*0.45}px;
    justify-content: center;
    align-items: center
`

export const NameJobContainer = styled.View`
    padding-vertical: ${HEIGHT*0.025}px
    width: ${WIDTH*0.9}px;
    justify-content: center
    align-items:center
`
export const JobText = styled.Text`
    width: ${WIDTH*0.45}px; 
    padding-vertical: ${HEIGHT*0.01}px
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
`

export const AgeText = styled.Text`
    width: ${WIDTH*0.9}px; 
    padding-vertical: ${HEIGHT*0.01}px
    font-size: ${HEIGHT*0.0175}px;
    font-weight: 400;
    text-align:center
   
`
export const RowContainerCol = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    align-self: center
    justify-content: space-between
`
export const RowContainer = styled.Pressable`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    align-self: center
    justify-content: space-between
    flex-direction: row
`

export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 500
    width: ${WIDTH*0.9}px;
    align-self: center
    color: black
`

export const AboutMeInput = styled.TextInput`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.15}px;
    border-radius: 10px
    color: black
    background-color: ${EXTRALIGHT}
    padding-top: ${HEIGHT*0.01}px;
    padding-horizontal: ${HEIGHT*0.02}px;
`
export const TextInputPressable = styled.Pressable`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.15}px;
    border-radius: 10px
    color: black
    background-color: ${EXTRALIGHT}
    padding-top: ${HEIGHT*0.01}px;
    padding-horizontal: ${HEIGHT*0.02}px;
`

export const RowName = styled.Text`
    font-size: ${HEIGHT*0.015}px
    color: ${DARKGREY}
    color: black
`

export const FavPropertyCard = styled.Pressable`
    width: ${WIDTH*0.4}px;
    height: ${HEIGHT*0.2}px;
    border-radius: 10px;
    background-color:red
`

export const ChangeProfilePicText = styled.Text`
    color: ${GOOGLEBLUE}
    margin-top: ${HEIGHT*0.005}px
`