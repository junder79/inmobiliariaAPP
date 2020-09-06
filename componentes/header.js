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
        ToastAndroid.show("Registro de Casa: " + casaSubida + " Sicronizada", ToastAndroid.SHORT);
    };

    // const [datosArray, setDatosArray] = useState([]);
    const alertaSicronizando = (mensajeSicronizar, subjectSicronizar) =>
        Alert.alert(
            mensajeSicronizar,
            subjectSicronizar,
            [
                {

                },

            ],
            { cancelable: false }
        );



    return (
        <Header androidStatusBarColor="#142850"  style={{ backgroundColor: '#27496d' }}>
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

                        
                                // validar de que haya contenido en el AsyncStorage 
                                const registroArray = JSON.stringify(props.registroArray);

                                if (props.registroArray.length > 0) {
                                    alertaSicronizando("Sicronizando Información", "Esto puede tardar unos minutos.");

                                    props.registroArray.map((prop, key) => {

                                        let url = "https://grupohexxa.cl/inmobiliaria/app.php";
                                        let formularioAsync = new FormData();
                                        formularioAsync.append('casa', prop.selectCasa)
                                        formularioAsync.append('recinto', prop.selectRecinto)
                                        formularioAsync.append('observacion', prop.observationText)
                                        formularioAsync.append('estado', prop.selectEstado)
                                        formularioAsync.append('aspecto', prop.selectedValue)
                                        formularioAsync.append('id', prop.id)
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

                                                let respuestaServidor = JSON.stringify(response);
                                                if (respuestaServidor == 1) {
                                                    toastSubidaCorrecta(prop.selectCasa);
                                                    props.eliminarRegistro();
                                                } else {
                                                    toastErrorSubida();
                                                }
                                                console.log(
                                                    "POST Response",
                                                    "Response Body -> " + JSON.stringify(response)
                                                )

                                            }).catch((err) => {
                                                console.log(err);
                                                // Mostrar Mensaje de error y evitar que el contenido no se suba 
                                                toastErrorSubida();

                                                
                                            })
                                    })

                                } else {
                                    alertaSicronizando("No tienes registros pendientes por subir", "");
                                }


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