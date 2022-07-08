import {
    Dimensions, 
  } from 'react-native';
import styled from 'styled-components/native';

const PRIMARYCOLOR = '#4050B5'

const HEIGHT = Dimensions.get('screen').height;
const WIDTH = Dimensions.get('screen').width;

export const StandardInputStyle = {borderBottomColor:'black', borderBottomWidth: 1, width: WIDTH*0.8, height: HEIGHT*0.05, 
                                   marginTop: HEIGHT*0.02, alignSelf: 'center'};

export const StandardButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor:PRIMARYCOLOR, borderRadius:15, 
                                    marginTop: HEIGHT*0.04, justifyContent:'center', alignItems: 'center'}

export const GoogleLoginButtonStyle = {width: WIDTH*0.8, height: HEIGHT*0.06, backgroundColor: '#4285f4', borderRadius:15, 
                                       marginTop: HEIGHT*0.04, justifyContent:'center', alignItems:'center', flexDirection: 'row'}

export const DividerLineStyle = {width: WIDTH*0.35, height: HEIGHT*0.002, backgroundColor:'#7E7E7E'}

export const GoogleTextStyle = {color:'#4285f4', fontSize: HEIGHT*0.02}

export const DividerTextStyle = {color:'#7E7E7E'}

export const Container = styled.View`
  height: 100%;
  width: 100%;
  padding-top: ${HEIGHT*0.02}px;
`

export const Heading = styled.Text`
  color: ${PRIMARYCOLOR};
  fontWeight: 500
  fontSize: ${HEIGHT*0.05}px;
`

export const ButtonText = styled.Text`
  color: white;
  fontSize: ${HEIGHT*0.02}px;
`

export const LoginForm = styled.View`
  height: 20%;
  width: 100%;
  padding-left: 10%;
  padding-right: 10%;
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
  height: 40%; 
  align-items: center;
  justify-Content: center;
  flex-direction: row
`
