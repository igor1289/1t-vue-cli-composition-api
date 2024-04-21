// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBqwf0HFFAreXnENeUn_K4ek40PRiOeCYw',
  authDomain: 'todo-vue-5e128.firebaseapp.com',
  projectId: 'todo-vue-5e128',
  storageBucket: 'todo-vue-5e128.appspot.com',
  messagingSenderId: '159451291425',
  appId: '1:159451291425:web:2c29a80b6e955b0e51a860'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
