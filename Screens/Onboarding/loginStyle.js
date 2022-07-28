import {
    Dimensions, 
    TouchableOpacity
  } from 'react-native';
import styled from 'styled-components/native';

import { EXTRALIGHT, MEDIUMGREY, PRIMARYCOLOR } from '../../sharedUtils';

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const StandardInputStyle = {borderBottomColor:'black', backgroundColor: EXTRALIGHT, width: WIDTH*0.8, height: HEIGHT*0.05, 
                                   marginTop: HEIGHT*0.02, alignSelf: 'center', borderRadius: 15, paddingLeft: WIDTH*0.025};

export const StandardButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor:PRIMARYCOLOR, borderRadius:15, 
                                    marginTop: HEIGHT*0.04, justifyContent:'center', alignItems: 'center', alignSelf:'center'}

export const GoogleLoginButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor: '#4285f4', borderRadius:15, 
                                       marginTop: HEIGHT*0.04, justifyContent:'center', alignItems:'center', flexDirection: 'row'}

export const DividerLineStyle = {width: WIDTH*0.35, height: HEIGHT*0.002, backgroundColor:'#7E7E7E'}

export const GoogleTextStyle = {color:'#4285f4', fontSize: HEIGHT*0.02}

export const DividerTextStyle = {color:'#7E7E7E'}


export const StandardButton = styled(TouchableOpacity)`
  width: ${WIDTH*0.8}px;
  height: ${HEIGHT*0.06}px 
  backgroundColor:  ${props=>(props.loading ? MEDIUMGREY : PRIMARYCOLOR)}}
  borderRadius:15px
  marginTop: ${HEIGHT*0.04}px
  justifyContent: center 
  alignItems: center
  alignSelf: center
`

export const Container = styled.View`
  height: ${HEIGHT}px;
  width: ${WIDTH}px;
`

export const Heading = styled.Text`
  color: black;
  fontWeight: 500
  fontSize: ${HEIGHT*0.0275}px;
  width: ${WIDTH*0.8}px;
  align-self: center

`

export const ButtonText = styled.Text`
  color: white;
  fontSize: ${HEIGHT*0.02}px;
`

export const LoginForm = styled.View`
  height: ${HEIGHT*0.65}px
  padding-horizontal: ${WIDTH*0.1}px
  display: flex
`

export const Divider = styled.View`
  height: ${HEIGHT*0.02}px;
  width: ${WIDTH*0.8}px;
  justify-Content: space-between;
  align-items: center;
  flex-direction: row;
  align-self: center;
  marginTop: ${HEIGHT*0.04}px;
`
export const SignupContainer = styled.View`
  margin-top: ${HEIGHT*0.02}px
  align-items: center;
  justify-Content: center;
  flex-direction: row
  margin-bottom:${HEIGHT*0.02}px
`
