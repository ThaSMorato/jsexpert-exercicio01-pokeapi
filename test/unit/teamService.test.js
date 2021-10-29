const sinon = require("sinon");
const { default: axios } = require("axios");
const { expect } = require("chai");
const { describe, it, before, beforeEach, afterEach } = require("mocha");
const TeamService = require("../../src/service/teamService");

const FIRST_PAGE_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMON_PAGE_URL = "https://pokeapi.co/api/v2/pokemon/890";
const CHARMANDER_PAGE = "https://pokeapi.co/api/v2/pokemon/4";
const BULBASAUR_PAGE = "https://pokeapi.co/api/v2/pokemon/1";
const SQUIRTLE_PAGE = "https://pokeapi.co/api/v2/pokemon/7";

const mocks = {
  firstPage: require("../mocks/teamFirstPageRequest.json"),
  pokemonPage: require("../mocks/teamPokemonRequest.json"),
  squirtlePage: require("../mocks/squirtlePageRequest.json"),
  charmanderPage: require("../mocks/charmanderPageRequest.json"),
  bulbasaurPage: require("../mocks/bulbasaurPageRequest.json"),
};

const fetchStub = sinon.stub(axios, "get");

fetchStub.withArgs(FIRST_PAGE_URL).resolves({ data: mocks.firstPage });

fetchStub.withArgs(POKEMON_PAGE_URL).resolves({ data: mocks.pokemonPage });

fetchStub.withArgs(CHARMANDER_PAGE).resolves({ data: mocks.charmanderPage });

fetchStub.withArgs(BULBASAUR_PAGE).resolves({ data: mocks.bulbasaurPage });

fetchStub.withArgs(SQUIRTLE_PAGE).resolves({ data: mocks.squirtlePage });

describe("#Team Service", () => {
  let teamService;
  let sandbox;

  before(() => {
    teamService = new TeamService({ url: FIRST_PAGE_URL });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should call updateCount on construc", () => {
    expect(teamService.teamRepository.pokemonCount).to.equal(1118);
  });

  it("should return a random number from 1 to pokemonCount", async () => {
    const randomNumber = teamService.randomPokemonIndex();

    expect(randomNumber).to.be.lte(teamService.teamRepository.pokemonCount).and.be.gte(1);
  });

  it("should return a random pokemon", async () => {
    sandbox.stub(teamService, teamService.randomPokemonIndex.name).returns(890);

    const randomPokemon = await teamService.getRandomPokemon();

    const expectedPokemon = {
      name: "eternatus",
      moves: [],
    };

    expect(teamService.randomPokemonIndex.calledOnce).to.be.ok;
    expect(randomPokemon).to.eql(expectedPokemon);
  });

  it("should return a random pokemon team with 3 pokemons to choose", async () => {
    sandbox
      .stub(teamService, teamService.randomPokemonIndex.name)
      .returns(1)
      .onSecondCall()
      .returns(4)
      .onThirdCall()
      .returns(7);

    const team = await teamService.getTeam();

    const expectedTeam = [
      { name: "bulbasaur", moves: ["mega-punch", "ice-punch", "mega-kick"] },
      { name: "charmander", moves: ["mega-punch", "ice-punch", "mega-kick"] },
      { name: "squirtle", moves: ["mega-punch", "ice-punch", "mega-kick"] },
    ];

    expect(teamService.randomPokemonIndex.callCount).to.be.equal(3);
    expect(team).to.eql(expectedTeam);
  });
});
