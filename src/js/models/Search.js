import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = 'b4009403987c6c967ae5005ba71d03ad';
    const key2 = '2c310f8a3950d798fb64480d705b60ad'
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
      const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key2}&q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }

}