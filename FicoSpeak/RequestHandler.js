export class FunTranslation_Request{
    async make_request(fico_icon,text){
        if (text.length != 0){
            const response = await fetch(`https://api.funtranslations.com/translate/${fico_icon}.json?text=${text}`);
            const data = await response.json();
            return data;    
        }
        return null;

    }
}