import * as Facebook from 'expo-facebook';

export async function onFacebookButtonPress() {
  try {
    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });

    if (result.type === 'success') {
      console.log('Facebook login successful:', result);
      // Aquí puedes manejar el token de acceso o realizar acciones adicionales
    } else {
      console.log('Facebook login cancelled');
    }
  } catch (error) {
    console.error('Error during Facebook login:', error);
  }
}
