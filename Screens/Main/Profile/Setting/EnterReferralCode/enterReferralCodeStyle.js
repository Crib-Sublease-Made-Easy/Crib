import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../../sharedUtils'

export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 500;
    color: black
`

export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.0325}px
    font-weight: 700
`

export const MoneyBackText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    text-align:center
    width: ${WIDTH*0.9}px
    align-self: center
    color: #545454
    align-self: center
    margin-top: ${HEIGHT*0.05}px
`

export const CheckoutCribButton = styled.Pressable`
    width: ${WIDTH*0.6}px
    padding-vertical: ${HEIGHT*0.0125}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 10px
    justify-content: center
    align-items: center
    align-self: center
    margin-top: ${HEIGHT*0.01}px
`

export const CheckoutCribText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    color: white
`

export const ReferralCodeInput = styled.TextInput`
    width: ${WIDTH*0.85}px
    padding-vertical: ${HEIGHT*0.0175}px
    align-self: center
    border-width: 2px
    border-radius: 10px
    border-color: #E0E0E0
    color: black
    padding-horizontal: ${WIDTH*0.025}px
`

export const SubmitReferralCodeButton = styled.Pressable`
    margin-top: ${HEIGHT*0.025}px
    width: ${WIDTH*0.85}px
    padding-vertical: ${HEIGHT*0.015}px
    align-self: center
    border-radius: 10px
    background-color: ${PRIMARYCOLOR}
    justify-content: center
    align-items: center
`
export const SubmitButtonText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    color: white
`

export const ReferralCodeHelperText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    align-self: center
    margin-bottom: ${HEIGHT*0.01}px

`

