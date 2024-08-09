import React, { useState, useEffect } from 'react'; // => useEffect me permet de faire des chose asynchrane par rapport au thread du rendu des composants
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { User } from './User';

export default function HistoryScreen({ route }) {
  const [expandedItems, setExpandedItems] = useState({});
  const [requestHistory, setRequestHistory] = useState([
    {
      character: "Aucune requête",
      sentence: {
        input: "rien à voir",
        output: "pourquoi tu toogle",
      },
    },
  ]);

  const user_pseudo = route.params.pseudo;

  // Partie ou j'actualise en utilisant useEffect => la fonction qui se trouve entre parenthèse se fait en asynchrone !!!!!!
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Je récupère les données
        const array_of_request = await User.Get_History_Request(user_pseudo);
        if(array_of_request.length > 0){
          setRequestHistory(array_of_request);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des requêtes :", error);
      }
    };

    // je récupère la première les données
    fetchData();

    // j'instancie un trigger qui se lance toute les 30s
    const intervalId = setInterval(fetchData, 30000);

    // Chose à faire absolument => faut annuler les intervalle pour pas qu'il est plusieurs instance d'interval lorsque la fonction est rappelé
    return () => clearInterval(intervalId); // => Je la met après return car on doit la placé lors du démontage du composant
  }, [user_pseudo]);


  const toggleItemExpansion = (section, item) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [item]: !prevState[section]?.[item],
      },
    }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requestHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.character}</Text>
            <View>
              <TouchableOpacity onPress={() => toggleItemExpansion(item.character, item.sentence.input)}>
                <Text style={[styles.itemText, expandedItems[item.character]?.[item.sentence.input] && styles.expandedText]}>
                  {item.sentence.input}
                </Text>
              </TouchableOpacity>
              {expandedItems[item.character]?.[item.sentence.input] && (
                <View style={styles.additionalInfo}>
                  <Text>{item.sentence.output}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 80,
    backgroundColor: '#f0f0f0', // permet d'ajouter un fond gris d'item qui est étendue
    alignItems: 'center', // Centre horizontalment
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20, // Augmente la taille du titre de section
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333', // Ajoute une couleur de texte plus foncée
  },
  expandedText: {
    fontWeight: 'bold',
    color: '#007AFF', // Couleur différente pour les éléments étendus
  },
  additionalInfo: {
    marginLeft: 20,
    backgroundColor: '#e0e0e0', // Ajoute un fond gris clair pour les informations supplémentaires
    padding: 10,
    borderRadius: 5,
  },
});
