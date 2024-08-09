export class User{

    // static ip = '10.1.31.17'
    static ip = '192.168.1.13'
    // static ip = '172.30.40.14'
    // static ip = '172.20.10.5'


    async VerifyUser(pseudo, passwordToVerify){
        // Ici je vérifie si l'utilisateur a déjà un compte
        const response = await fetch('http://'+User.ip+':3000/check_password?pseudo=' + pseudo + '&password_to_check=' + passwordToVerify);

        // Je vérifie le statut de la response du serveur
        if (response.status == 200){
            return true; // Je retourne true car ca signifie que la connexion s'est bien passé
        }else{
            // Sinon, je return false
            return false; // La connexion s'est mal passée
        }
        
    }

    async GenerateNewUser(newPseudo, newPassword){
        // Ici je créer un nouvelle utilisateur
        const response = await fetch('http://'+User.ip+':3000/new_user?new_pseudo=' + newPseudo + '&new_password=' + newPassword);

        // Je vérifie le statut de la response du serveur
        if (response.status == 200){
            return true; // Je retourne true car ca signifie que l'inscription s'est bien passée
        }else{
            // Sinon, je return false
            return false;
        }

     }

     static async Add_In_History(pseudo,input_text,output_text,character){ // Remarque, cette méthode est static car ca me fait un rappelle sur comment l'utilsier ;/ ;/
        // J'ajoute dans l'historique de l'utilisateur 
        const response = await fetch(`http://${this.ip}:3000/set_history?pseudo=${pseudo}&input_text=${input_text}&output_text=${output_text}&character=${character}`);

        // Je vérifie le statut de la response du serveur
        if (response.status == 200){
            return true; // Je retourne true car ca signifie que l'inscription s'est bien passée
        }else{
            // Sinon, je return false
            return false;
        }
    }
    
    static async Get_Remaining_Request(pseudo){ // Je récupére le nombre de requête disponible
        return await fetch(`http://${this.ip}:3000/get_remaining_request?pseudo=${pseudo}`) // J'essaie de retoruné un fetch ;/
        .then((response) => {
            if (response.ok) { // response.ok me retourne le status de la requête http (200 ou 400)
              return response.json(); // Je transfome la donnée en json
            } else {
              throw new Error('La requête a échoué.');
            }
          })
          .then((data) => { // Je traite les données ici
            if (data.success) {
              return data.remaining_request; // Je retroune la donnée
            } else {
              console.error('La requête a échoué du côté du serveur.');
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la requête fetch :', error);
          });
    }

    static async Decrement_Remaining_Request(pseudo){ // Méthode qui permet de décrémenté le nombre de requêtes restantes
        const response = await fetch(`http://${this.ip}:3000/decremente_remaining_request?pseudo=${pseudo}`);

        if(response.status == 200){
          return true;
        }else{
          return false;
        }
    }

    static async Get_History_Request(pseudo){
      const response = await fetch(`http://${this.ip}:3000/get_history?pseudo=${pseudo}`);

      const data = await response.json();

      return data;
    }

}