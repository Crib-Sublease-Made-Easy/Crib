import styled from 'styled-components/native';
import { DARKGREY, HEIGHT, PRIMARYCOLOR, WIDTH } from '../../../../sharedUtils';

export const FAQContainer = styled.View`
    width: ${WIDTH*0.9}px
    padding-vertical: ${HEIGHT*0.02}px
    align-self: center
`

export const FAQHeader = styled.Text`
    font-size: ${HEIGHT*0.025}px
    font-weight: 500
`
export const FAQContent = styled.Text`
    font-size: ${HEIGHT*0.02}px
    margin-top: ${HEIGHT*0.015}px
`
export const FAQContactUsContainer = styled.Pressable`
    width: ${WIDTH*0.9}px;
    justify-content: center
    align-items: center
    background-color: ${PRIMARYCOLOR}
    align-self: center
    padding-vertical: ${HEIGHT*0.02}px
    border-radius: 10px
    margin-top: ${HEIGHT*0.02}px
`

export const ContactUsText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    font-weight: 500
    color: white
`

export const QuestionText = styled.Text`
    font-size: ${HEIGHT*0.02}px
    color: ${DARKGREY}
    width: ${WIDTH*0.9}px;
    align-self: center
    margin-top: ${HEIGHT*0.02}px
`