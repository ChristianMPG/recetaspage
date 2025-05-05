import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Perfil = () => {
  const handleLogout = () => {
    // Add logout logic here
    console.log('User logged out');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>
      <View style={styles.userInfo}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>Miguel</Text>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>miguel@example.com</Text>
      </View>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Perfil;
