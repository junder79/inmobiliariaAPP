import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ToastAndroid, } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Container, Header, Title, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { useNetInfo } from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
function HeaderCustom(props) {
    const netInfo = useNetInfo();
    let estadoConexion = netInfo.isConnected.toString();
    const toastSicronizacionIniciada = () => {
        ToastAndroid.show("Siscronizacion Iniciada", ToastAndroid.SHORT);
    };
    const toastErrorSubida = () => {
        ToastAndroid.show("Error al sicronizar, intente nuevamente", ToastAndroid.SHORT);
    };
    const toastSubidaCorrecta = (casaSubida) => {
        ToastAndroid.show("Registro de Casa: "+casaSubida+" Sicronizada", ToastAndroid.SHORT);
    };

    const [datosArray, setDatosArray] = useState([]);
    const createTwoButtonAlert = () =>
        Alert.alert(
            "Sicronizando Información",
            "Esto puede tardar unos minutos.",
            [
                {

                },

            ],
            { cancelable: false }
        );
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
                            {estadoConexion == "true" ? (<Icon onPress={() => {

                                createTwoButtonAlert();

                                //   useEffect(() => {
                                const obtenerData = async () => {
                                    try {
                                        const registroStorage = await AsyncStorage.getItem('registroAsync');

                                        if (registroStorage) {
                                            setDatosArray(JSON.parse(registroStorage));
                                        }
                                    } catch (e) {
                                        // saving error
                                        console.log(e);
                                    }
                                }
                                obtenerData();

                                datosArray.map((prop, key) => {
                                    
                                    let url = "https://grupohexxa.cl/inmobiliaria/app-test.php";
                                    let formularioAsync = new FormData();
                                    formularioAsync.append('casa', prop.selectCasa)
                                    formularioAsync.append('recinto', prop.selectRecinto)
                                    formularioAsync.append('observacion', prop.observationText)
                                    formularioAsync.append('estado', prop.selectEstado)
                                    formularioAsync.append('aspecto', prop.selectedValue)
                                    formularioAsync.append('submit', 'ok');
                                    if (prop.fotoUrl.uri === '') {

                                    } else {
                                        formularioAsync.append('imagen', { type: 'image/jpg', uri: prop.fotoUrl.uri, name: prop.fotoUrl.nombre });
                                    }
                                    console.log(formularioAsync);
                                    fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Accept': '*',
                                            'Content-Type': 'multipart/form-data',
                                        },
                                        body: formularioAsync
                                    }).then(response => response.json())
                                        .then(response => {

                                            console.log(
                                                "POST Response",
                                                "Response Body -> " + JSON.stringify(response)
                                            )
                                            toastSubidaCorrecta(prop.selectCasa);
                                            // Eliminar el asysnc Storage subido
                                            
                                        }).catch((err) => {
                                            console.log(err);
                                            toastErrorSubida();

                                            // Mostrar Mensaje de error y evitar que el contenido no se suba 
                                        })
                                })

                            }}
                                title="Press Me" style={styles.iconoRefresh} name='refresh' />) : (null)}
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