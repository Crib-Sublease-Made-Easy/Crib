import styled from 'styled-components/native';

import { HEIGHT, WIDTH, PRIMARYCOLOR, LIGHTGREY, MEDIUMGREY, EXTRALIGHT, DARKGREY } from '../../../../sharedUtils'



export const Header = styled.Text`
    font-size: ${HEIGHT*0.02}px;
    font-weight: 700;
    color: ${PRIMARYCOLOR}
`

export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.025}px
    font-weight: 700
    width: ${WIDTH*0.8}px
    align-self: center
`
export const SubtitleText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    width: ${WIDTH*0.8}px
    align-self: center
`

export const ReferralCodeHelperText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    align-self: center
`

export const ReferralCodeText = styled.Text`
    font-size: ${HEIGHT*0.035}px
    align-self: center
    color: black
    font-weight: 700
    margin-top: ${HEIGHT*0.02}px

`

export const PriceContainer = styled.View`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.025}px
    border-top-width: 3px
    border-color: ${PRIMARYCOLOR}
    align-self: center
`

export const PriceText = styled.Text`
    width: ${WIDTH*0.8}px
    font-size: ${HEIGHT*0.0275}px
    align-self: center
`

export const SubmitButton = styled.Pressable`
    width: ${WIDTH*0.8}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 15px
    align-self: center
    justify-content: center
    align-items: center
    margin-top: ${HEIGHT*0.025}px
   
`

export const SubmitText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: white
    font-weight: 500
`

export const ProgressDots = styled.View`
    width: ${WIDTH*0.025}px
    height: ${WIDTH*0.025}px
    border-radius: ${WIDTH*0.0125}px
    background-color: #E0E0E0
`

export const ProText = styled.Text`
    width: ${WIDTH*0.75}px
    margin-left: ${WIDTH*0.025}px
`

export const ProContainer = styled.View`
    flex-direction: row
    align-self: center
    align-items: center
    justify-content: center
`