import React, { useState } from 'react';
import { TouchableWithoutFeedback,Modal, Vibration } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet, Keyboard, StatusBar, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FunTranslation_Request } from './RequestHandler';
import { useRoute } from '@react-navigation/native';
import { User } from './User';

export default function MakeRequest({route}) {

  const user_pseudo = route.params.pseudo;

  const [open, setOpen] = useState(false); // état du DropDownPicker, si c'est ouvert ou pas
  const [items, setItems] = useState([
    { label: 'Yoda', value: 'yoda' },
    { label: 'Sith', value: 'sith' },
    { label: 'Cheunh', value: 'cheunh' },
    { label: 'Gungan', value: 'gungan' },
    { label: 'Mandalorian', value: 'mandalorian' },
    { label: 'Huttese', value: 'huttese' },
    { label: 'Pirate', value: 'pirate' },
    { label: 'Minion', value: 'minion' },
    { label: 'Fudd', value: 'fudd' },
    { label: 'Dothraki', value: 'dothraki' },
    { label: 'Klingon', value: 'klingon' },
    { label: 'Morse', value: 'morse' },
  ]);
  const [value, setValue] = useState('yoda'); // J'initialise la valeur par défaut

  const [inputText, setInputText] = useState(''); // état du textinput

  const [modalVisible, setModalVisible] = useState(false);// état de visibilité du Modal, qui me permet de montré la traduction

  const [remainingRequests, setRemainingRequests] = useState(10); // état du nombre de requête restante
  // Je vais récupérer le nombre de requête restante sur mongoDB
  User.Get_Remaining_Request(user_pseudo).then((remaining_request) => {
    setRemainingRequests(remaining_request); // J'initialise les requête restante
  });

  const[text_translated,setTextTranslated] = useState('Aucune phrase n\'a pu être transformé')
  // text_translated est la variable qui va contenir la phrase transformé

  const request_handler = new FunTranslation_Request();

  const RequestToFunTranslator = async () => {
    if(remainingRequests > 0){
      // Si j'ai encore un certains nombre de requête, je vais pouvoir faire la requête
      // console.log('Valeur sélectionnée:', value);
      // console.log('Texte saisi:', inputText);
      // Je fait une requête à l'api funtranslation
      const data_received = await request_handler.make_request(value,inputText);
      console.log(data_received);
      // Lorsque je recois, je stock la réponse dans la base de donnée
      User.Add_In_History(user_pseudo,inputText,data_received.contents.translated,value); // C'est avec cette méthode qui ajoute la phrase dans la db
      // J'initialise la phrase qui va être montré à l'utilisateur
      setTextTranslated(data_received.contents.translated);
      // Ensuite, Je décrémente remainingRequests
      if(remainingRequests > 0){
        setRemainingRequests(remainingRequests - 1); // Je décrémente ce qui se trouve dans l'écran
        // ET ensuite je passe à mongodb où je vais décrémenté remaining_request
        User.Decrement_Remaining_Request(user_pseudo);
      }

      setInterval(increment_remainingRequest,3600000); // 3600000 ms = 1 h

      // Et enfin, je montre la phrase avec un objet Modal
      openModal();

    }else{
      Alert.alert("Le nombre maximum de requête a été atteint");
      Vibration.vibrate(1000);
    }
    
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Je quitte le clavier
  }

  const increment_remainingRequest = () => {
    // Cette fonction va être appelé toutes les heures afin d'incrémenter les requête restante
    setRemainingRequests(remainingRequests + 1);
  }

  const openModal = () => {// Permet de rendre visible le modal
    setModalVisible(true);
  };
  
  const closeModal = () => { // Permet de rendre invisible le modal
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            Requêtes restantes : {remainingRequests}
          </Text>
        </View>
      <Text style={styles.title}>Saisissez votre phrase</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Saisissez le texte à transformer :</Text>
        <TextInput
          style={styles.input}
          onChangeText={setInputText}
          value={inputText}
          placeholder="Votre texte ici"
        />
      </View>
      <Button
        title="Faire la demande"
        onPress={RequestToFunTranslator}
        color="#49098E" // Couleur du bouton
      />
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Sélectionnez le personnage fictif :</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={styles.dropdown}
        />
      </View>
    
    <Modal
      animationType="slide"
      visible={modalVisible} // init if modal is visible
    >
      <View style={styles.modalView}>
        <Text>{text_translated}</Text>
        <Button title="Fermer" onPress={closeModal} />
      </View>
    </Modal>

    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    marginTop: 20,
    marginBottom: 16,
    width: '100%',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 5,
  },
  counterContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    padding: 5,
  },
  counterText: {
    fontSize: 12,
    color: 'black',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white',
  },
});
