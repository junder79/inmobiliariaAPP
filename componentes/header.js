import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { useNetInfo } from "@react-native-community/netinfo";

function HeaderCustom(props) {
    const netInfo = useNetInfo();
    let estadoConexion = netInfo.isConnected.toString();
    const toastSicronizacionIniciada = () => {
        ToastAndroid.show("Siscronizacion Iniciada", ToastAndroid.SHORT);
    };
    return (
        <Header>
            <Left>
                {
                    props.esInicio ?
                        <Button transparent>
                            <Icon name='home' />
                        </Button> :
                        <Button transparent onPress={() => props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                }
            </Left>
            <Body>
                <Title>{props.tituloHeader}</Title>
            </Body>
            <Right>
                {
                    props.tituloHeader == "Inicio" ?
                        <Button transparent>
                            {estadoConexion == "true" ? (<Icon style={styles.iconoRefresh} name='refresh' />) : (null)}
                        </Button> : null
                }
            </Right>
        </Header>
    );

}
const styles = StyleSheet.create({

    iconoRefresh: {
        color: 'white'
    }
});
export default HeaderCustom;