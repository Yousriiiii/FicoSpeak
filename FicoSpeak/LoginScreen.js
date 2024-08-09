import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StatusBar, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {User} from './User';
import { Vibration } from "react-native";
 
const LoginScreen = ({navigation}) => {
  // J'utilise des état qui me permet d'initialisé les variables associée
  const [pseudo, setPseudo] = useState('Guest'); //=> La valeur par défaut de pseudo est Guest
  const [password, setPassword] = useState('1234');
  const [isNewUser, setIsNewUser] = useState(false); 
  // Pour savoir si l'utilisateur est nouveau, j'utilise la variable isNewUser
  // Par défaut, je considére l'utilisateur comme habitué, ce n'est pas un nouveau utilisateur

  // Je crée une nouvelle instance de User, ceci me permettra d'initialiser en même temps la base de donnée SQLite
  const user = new User();

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Je quitte le clavier
  }
 
  const ManageUserLogin = async () => {
    // Lorsque se bouton est appuyé alors, soit on doit inscrire la personne, soit on doit juste la connecter
    // Pour cela j'utilise la variable isNewUser que j'initialise avec le bouton en bas de l'écran
    
    // J'appelle une méthode qui me permettra de intéragir avec MongoDB pour que :
    // => Soit il vérifie si l'utilisateur a déjà un compte
    // => Soit il l'inscrit
    // Lorsque ces étapes sont finies alors je dirige tous les utilisateurs vers l'écran d'accueil

    if(isNewUser){
      const SignUpDone = await user.GenerateNewUser(pseudo,password); // Méthode qui permet de créer un nouveau utilisateur dans db

        if(!SignUpDone){ // Si l'inscription n'a pas été bien fait alors je donne l'information à l'utilisateur
            Vibration.vibrate(1000); // Fait vibrer le téléphone 1 sec
            Alert.alert('L\'inscription n\'a pas pu se faire, tu as peut être déjà un compte');
        }else{
        // Si l'inscription est bon alors l'utilisateur peut passer à un autre écran
            navigation.replace("BottomBarNavigation",{pseudo : pseudo});
        }

    }else{
        const LogInDone = await user.VerifyUser(pseudo,password);// J'appel la méthode VerifyUser qui vérifie le mot de passe de l'utilisateur

        if(LogInDone){
            // Lorsque je passe à la navigation par bottom bar, je peut déjà envoyé un paramétre à l'initialisateur de ce type de navigation
            navigation.replace("BottomBarNavigation",{pseudo : pseudo}); // Ceci me permet de remplacer l'écran Login qui est premier avec l'écran Home
        }else{
            Vibration.vibrate(1000);
            Alert.alert('La connexion n\'a pas pu se faire, avez-vous un compte ?')
        }

    }

  };

  const NewUserSetting = () => {
    setIsNewUser(!isNewUser); // J'initialise isNewUser au contraire de ce qu'il contient
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView style={styles.container}>

      <Image
          source={require('./assets/jedi.jpg')} // Remplacez le chemin par le chemin réel de votre image
          style={{
            resizeMode: 'contain',
            height: 300,
            width: 200,
          }}
        />


        {/* Je modifie mon statusbar afin qu'il soit noir car mon écran sera toujours vif */}
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Bienvenue sur FicoSpeak</Text>

        {/* Je créer un View (espace) pour chaque zone de texte+textinput pour chaque partie (pseudo et mot de passe) */}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{!isNewUser ? 'Pseudo':'Nouveau pseudo'}</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPseudo}
            // Lorsque ce textinput va changer de contenu, j'utilise setPseudo pour initialisé la variable pseudo
            defaultValue="Guest"
            placeholder="Saisissez votre pseudo" // Ceci est le texte de fonds qui est montré lorsqu'il n'y a rien dans le textinput
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{!isNewUser ? 'Mot de passe':'Nouveau mot de passe'}</Text>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            placeholder="Saisissez votre mot de passe"
            keyboardType="numeric"
            defaultValue="1234"
          />
        </View>
        <TouchableOpacity
          // TouchableOpacity est construit pour contenir un lien et la fonction de callback est handleButtonPress
          style={styles.button}
          onPress={ManageUserLogin}
        >
          <Text style={styles.buttonText}>{!isNewUser ? 'Se connecter' : 'S\'inscrire'}</Text>

          {/* cette objet Text sera donc le lien qui peut être appuyé pour se connecter */}

        </TouchableOpacity>
        <TouchableOpacity
          onPress={NewUserSetting}
        >
          <Text style={styles.toggleText}>
            {!isNewUser ? 'Pas encore de compte ? Inscrivez-vous ici' : 'Déjà un compte ? Connectez-vous'}
            {/* Ce que je vais voir dans l'écran dépend de l'état isNewUser, si isNewUser est true alors il verra le premier string sinon c'est l'autre */}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  toggleText: {
    marginTop: 10,
    color: "#007BFF",
  },
  
});

export default LoginScreen;