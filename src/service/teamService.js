const TeamRepository = require("../repository/teamRepository");

class TeamService {
  constructor({ url }) {
    this.teamRepository = new TeamRepository({ url });
    this.updatePokemonCount();
  }

  async updatePokemonCount() {
    await this.teamRepository.updatePokemonCount();
  }

  randomPokemonIndex() {
    return Math.ceil(Math.random() * this.teamRepository.pokemonCount);
  }

  async getRandomPokemon() {
    const index = this.randomPokemonIndex();
    return this.teamRepository.getPokemon({ index });
  }

  async getTeam() {
    const team = await Promise.all(
      Array.from({ length: 3 }).map(async (index) => await this.getRandomPokemon())
    );

    return team;
  }
}

module.exports = TeamService;
