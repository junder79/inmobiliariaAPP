import { useNetInfo } from "@react-native-community/netinfo";
const netInfoState = () => {
    const netInfo = useNetInfo();
    let estadoConexion = netInfo.isConnected.toString();
    const toastSicronizacionIniciada = () => {
        ToastAndroid.show("Siscronizacion Iniciada", ToastAndroid.SHORT);
    };

const toastSicronizacionTerminada = () => {
    ToastAndroid.show("Se completó la sicronización", ToastAndroid.SHORT);
};

}