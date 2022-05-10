import axios from "axios";

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try {
            const response = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`)
            this.result = response.data.recipes;
        } catch (error) {
            alert('something wrong');
        }
        
    }
}