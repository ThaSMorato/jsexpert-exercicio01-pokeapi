const sinon = require("sinon");
const { default: axios } = require("axios");
const { expect } = require("chai");
const { describe, it, before, beforeEach, afterEach } = require("mocha");
const TeamRepository = require("../../src/repository/teamRepository");

const FIRST_PAGE_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_PAGE_URL = "https://pokeapi.co/api/v2/pokemon/890";
const POKEMON899_PAGE_URL = "https://pokeapi.co/api/v2/pokemon/10001";

const mocks = {
  firstPage: require("../mocks/teamFirstPageRequest.json"),
  pokemonPage: require("../mocks/teamPokemonRequest.json"),
  tenThousandOnePage: require("../mocks/10001PageRequest.json"),
};

const fetchStub = sinon.stub(axios, "get");

fetchStub.withArgs(FIRST_PAGE_URL).resolves({ data: mocks.firstPage });

fetchStub.withArgs(POKEMON_PAGE_URL).resolves({ data: mocks.pokemonPage });

fetchStub.withArgs(POKEMON899_PAGE_URL).resolves({ data: mocks.tenThousandOnePage });

describe("#Team repository", () => {
  let teamRepository;
  let sandbox;

  before(() => {
    teamRepository = new TeamRepository({ url: FIRST_PAGE_URL });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should start with first 200 pokemons on construct", () => {
    expect(teamRepository.pokemonCount).to.equal(200);
  });

  it("should update the pokemonCout on update call", async () => {
    await teamRepository.updatePokemonCount();
    expect(teamRepository.pokemonCount).to.equal(1118);
  });

  it("should return a pokemon from index 890", async () => {
    const pokemon = await teamRepository.getPokemon({ index: 890 });

    const expectedPokemon = {
      name: "eternatus",
      moves: [],
    };

    expect(pokemon).to.eql(expectedPokemon);
  });

  it("should return a pokemon from index 899", async () => {
    const pokemon = await teamRepository.getPokemon({ index: 899 });

    const expectedPokemon = {
      name: "deoxys-attack",
      moves: ["mega-punch", "cut", "bind"],
    };

    expect(pokemon).to.eql(expectedPokemon);
  });
});
