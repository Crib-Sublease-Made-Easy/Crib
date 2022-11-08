import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils'

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

export const HeaderImageContainer = styled.View`
    paddingVertical:${HEIGHT*0.02}px
    marginTop:${HEIGHT*0.025}px
`


export const PropertyPhotoContainer = styled.View`
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.115}px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    align-self: center
   
`
export const PhotoContainer = styled.View`
    width: ${WIDTH*0.15}px;
    height: ${WIDTH*0.15}px
    border-radius:15px;
    background-color: ${MEDIUMGREY};
    justify-content:center
    align-items:center
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
    padding-top: ${HEIGHT*0.01}px
    padding-bottom: ${HEIGHT*0.005}px
    font-weight: 500
    width: ${WIDTH*0.9}px;
    align-self: center
    color: black
`
export const RowName = styled.Text`
    font-size: ${HEIGHT*0.015}px
    color: ${DARKGREY}
    width: ${WIDTH*0.8}px
    height: ${HEIGHT*0.04}px
`
export const DatePriceText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    color: ${DARKGREY}
`

export const DeleteContainer = styled.Pressable`
   
`

export const DeleteText = styled.Text`
    align-self: center
    font-size: ${HEIGHT*0.0175}px
    color: red
    margin-bottom: ${HEIGHT*0.05}px
`