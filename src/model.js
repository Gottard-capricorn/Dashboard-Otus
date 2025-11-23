//createUser - можно SPA, где при первой загрузке страницы ведёт на страницу регистрации
//Если пользователь уже зарегистрирован, то ведёт на главную страницу Dashboard - на ней главная страница и страница с информацией, может диаграммой с информацией по файлам?
//После того как логин и паролль введены - нажатие по кнопке войти - проверка в БД логина и пароля - если верно, то переброс на Dashboard
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
} from "firebase/storage";

const firebaseConfig = {
  //Добавить в переменные окружения
  apiKey: APIKEY,

  authDomain: "otusdashboard.firebaseapp.com",

  projectId: "otusdashboard",

  storageBucket: "otusdashboard.firebasestorage.app",

  messagingSenderId: SENDERID,

  appId: "1:907942800962:web:4b8f8451f2b87fc0f3c7db",

  measurementId: "G-J2ZJQM5K5C",
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export class FirebaseModel {
  constructor() {
    console.log("APIKEY: ", APIKEY);
    this.auth = getAuth(app);
    this.storage = getStorage(app);
  }

  signIn(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signUp(email, password) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return firebaseSignOut(this.auth);
  }

  observeAuthState(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  async uploadFile(path, file, metadata) {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file, metadata);
    return storageRef.fullPath;
  }

  getFileDownloadUrl(path) {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  async listFilesWithMetadata(prefix) {
    const folderRef = ref(this.storage, prefix);
    const listResult = await listAll(folderRef);
    const files = await Promise.all(
      listResult.items.map(async (item) => {
        const meta = await getMetadata(item);
        return {
          name: item.name,
          path: item.fullPath,
          description: meta.customMetadata?.description || "",
          tag: meta.customMetadata?.tag || "",
        };
      }),
    );
    return files;
  }
}

//Переписать роут тестовое задание под MVC

// Здесь будет лежать всё что касается firebase:
// initializeApp - инициализация
//auth
//storage
//фукнции signIn, signOut
//Проверка сессии через onAuthStateChanged
//Метод uploadFile и getDownloadURL

//Здесь можно добавить маленький 'store' (объект с текущим user и массивом файлов) - если нужно кэшировать состояние
