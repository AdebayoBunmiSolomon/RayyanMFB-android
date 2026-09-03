import firebase from '@react-native-firebase/app';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-app.firebaseapp.com',
    projectId: 'your-app',
    storageBucket: 'your-app.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  });
}
