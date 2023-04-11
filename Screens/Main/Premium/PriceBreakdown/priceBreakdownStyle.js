import { WIDTH, HEIGHT,PRIMARYCOLOR,   } from '../../../../sharedUtils'


import styled from 'styled-components/native';


export const TitleText = styled.Text`
    font-size: ${HEIGHT*0.025}px
    width: ${WIDTH*0.9}px
    align-self: center
`

export const SubtitleText = styled.Text`
    font-size: ${HEIGHT*0.0175}px
    margin-top: ${HEIGHT*0.025}px
    width: ${WIDTH*0.9}px
    align-self: center
`

export const PriceBreakdownHeader = styled.View`

    width: ${WIDTH*0.9}px
    border-bottom-width: 1px
    align-self: center
    margin-top: ${HEIGHT*0.035}px
    padding-bottom: ${HEIGHT*0.01}px
    
`

export const PriceBreakdownRow = styled.View`
    flex-direction: row
    justify-content: space-between
    align-self: center
    width: ${WIDTH*0.9}px
`

export const PriceRowTitle = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    
`
export const PriceRowPrice = styled.Text`
    font-size: ${HEIGHT*0.02}px
`

export const PriceSubtitleText = styled.Text`
    font-size: ${HEIGHT*0.015}px
    margin-top: ${HEIGHT*0.01}px
    width: ${WIDTH*0.9}px
    align-self: center
`

export const MoneyBackText = styled.Text`
    font-size: ${HEIGHT*0.03}px
    width: ${WIDTH*0.9}px
    align-self: center
    position: relative
`
export const BottomContainer = styled.View`
    position: absolute
    bottom: ${HEIGHT*0.1}px
    align-items: center
    justify-content: center
    align-self: center
`

export const SubmitButton = styled.Pressable`
    width: ${WIDTH*0.8}px
    padding-vertical: ${HEIGHT*0.0175}px
    background-color: ${PRIMARYCOLOR}
    border-radius: 10px
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