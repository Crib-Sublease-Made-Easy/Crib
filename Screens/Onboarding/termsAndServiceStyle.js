import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../sharedUtils'

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
`

export const RowContainer = styled.View`
    padding-vertical: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px;
    align-self: center
    background-color: ${EXTRALIGHT}
    padding-left: ${WIDTH*0.025}px
    border-radius: 10px
`

export const CategoryName = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 500
`

export const Terms = styled.Text`
font-size: ${HEIGHT*0.018}px
padding-vertical: ${HEIGHT*0.01}px
font-weight: 300
`

export const HelpText = styled.Text`
    width: ${WIDTH*0.9}px;
    margin-top: ${HEIGHT*0.025}px
    align-self: center;
    font-size: ${HEIGHT*0.0175}px
    padding-vertical: ${HEIGHT*0.01}px
    font-weight: 400
    color: ${DARKGREY}
`