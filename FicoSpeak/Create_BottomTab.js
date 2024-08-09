import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import History_Screen from './Request_History';
import Request_Screen from './Make_Request';

const Tab = createBottomTabNavigator(); // cette instance me permet de créer ma barre de navigation en bas de l'écran

export default function SetBottomBarNavigation({route}) {
  const pseudo_of_user = route.params.pseudo; // Cette variable me permet de connaître le pseudo à travers les différent écran que je vais définir
  return (
    <Tab.Navigator>
    <Tab.Screen name="Traduction" component={Request_Screen} options={{headerShown:false}} initialParams={{pseudo : pseudo_of_user}} />
    <Tab.Screen name="Historique" component={History_Screen} options={{headerShown:false}} initialParams={{pseudo : pseudo_of_user}}/>
    {() => <History_Screen pseudo={pseudo_of_user} />}
  </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
