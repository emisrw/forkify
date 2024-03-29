import axios from 'axios';
import {key,key2, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {

    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key2}&q=${this.query}`);
      this.result = res.data.recipes;
 
    } catch (error) {
      alert('niepoprawny klucz');
    }
  }

}