const { default: axios } = require("axios");

class TeamRepository {
  constructor({ url }) {
    this.url = url;
    this.pokemonCount = 200;
    this.beginForm = 898;
  }

  async updatePokemonCount() {
    const { data } = await axios.get(this.url);

    this.pokemonCount = data.count;
  }

  async getPokemon({ index }) {
    //todo error if index < 1 and > pokemonCount
    //todo other call if index > beginForm

    const {
      data: { name, moves },
    } = await axios.get(`${this.url}/${index}`);

    return {
      name,
      moves: moves.slice(0, 3).map((moveObj) => moveObj.move.name),
    };
  }
}

module.exports = TeamRepository;
