import axios from 'axios';
const key = 'aab4009403987c6c967ae5005ba71d03ad';
// 
//https://www.food2fork.com/api/search

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${query}`);
      const recipes = res.data.recipes;
      console.log(recipes);
    }catch(error) {
      alert(error);
    }
 
   
}

getResults('pizza');