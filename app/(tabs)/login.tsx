import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import * as Facebook from 'expo-facebook';
import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { onFacebookButtonPress } from '../../components/onFacebookButtonPress'; // Asegúrate de que la ruta sea correcta

const LoginScreen = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const initializeFacebook = async () => {
        await Facebook.initializeAsync({
          appId: '686782897506008', // reemplaza por tu app id
          // Opcional: puedes añadir otros parámetros como displayName o esquema si fuera necesario.
        });
      };

      initializeFacebook();
    }
  }, []);

  return (
    <View style={styles.container}>
      
      <Text style={styles.welcomeText}>¡Bienvenido a cocina más!</Text>
      <Text style={styles.descriptionText}>Inicia sesión y disfruta de la experiencia</Text>

      <Button
        title="Facebook Sign-In"
        onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
      </TouchableOpacity>

      <Link href="/" style={styles.guestLink}>
          <Text style={styles.guestText}>Continuar como invitado</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#4267B2', // Example Facebook color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
    guestLink: {
        marginTop: 15,
        
    },
    guestText: {
      color: "blue"  
    }
});

export default LoginScreen;
