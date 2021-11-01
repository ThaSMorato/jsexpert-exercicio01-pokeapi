const { describe, it, before, beforeEach, after, afterEach } = require("mocha");
const { expect } = require("chai");
const http = require("http");
const request = require("supertest");
const sinon = require("sinon");
const TeamService = require("../../src/service/teamService");
const { default: axios } = require("axios");
const Api = require("../../src/api");

const SERVER_TEST_PORT = 4000;

const FIRST_PAGE_URL = "https://pokeapi.co/api/v2/pokemon";
const CHARMANDER_PAGE = "https://pokeapi.co/api/v2/pokemon/4";
const BULBASAUR_PAGE = "https://pokeapi.co/api/v2/pokemon/1";
const SQUIRTLE_PAGE = "https://pokeapi.co/api/v2/pokemon/7";

const mocks = {
  firstPage: require("../mocks/teamFirstPageRequest.json"),
  squirtlePage: require("../mocks/squirtlePageRequest.json"),
  charmanderPage: require("../mocks/charmanderPageRequest.json"),
  bulbasaurPage: require("../mocks/bulbasaurPageRequest.json"),
};

const fetchStub = sinon.stub(axios, "get");

fetchStub.withArgs(FIRST_PAGE_URL).resolves({ data: mocks.firstPage });

fetchStub.withArgs(CHARMANDER_PAGE).resolves({ data: mocks.charmanderPage });

fetchStub.withArgs(BULBASAUR_PAGE).resolves({ data: mocks.bulbasaurPage });

fetchStub.withArgs(SQUIRTLE_PAGE).resolves({ data: mocks.squirtlePage });

describe("API SUIT TEST", () => {
  let app = {};
  let sandbox = sinon.createSandbox();
  const OLD_ENV = process.env;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    sandbox.restore();
    process.env = OLD_ENV;
  });

  describe("Object", () => {
    it("should start with a teamService instance", () => {
      const api = new Api();
      expect(api.teamService.constructor).to.be.eql(new TeamService({ url: "any" }).constructor);
    });

    it("should start with server 3000", () => {
      const api = new Api();
      sandbox.spy(api);
      sandbox.stub(http, http.createServer.name).returns({ listen: (port, callback) => {} });

      api.createServer();

      expect(api.createServer.getCall(0).args[0]).to.be.equal(3000);
    });

    it("should start the server on createServer method", () => {
      const api = new Api();
      sandbox.spy(api);
      sandbox.spy(http);
      api.createServer(6789);

      expect(http.createServer.callCount).to.be.equal(1);
      expect(api.createServer.getCall(0).args[0]).to.be.equal(6789);
    });
  });

  describe("Routes", () => {
    before(() => {
      const teamService = new TeamService({
        url: FIRST_PAGE_URL,
      });
      const instance = new Api({ teamService });

      app = {
        instance,
        server: instance.createServer(SERVER_TEST_PORT),
      };
    });

    describe("/default", () => {
      it("should request the default and return HTTP status 200", async () => {
        await request(app.server).get("/default").expect(200);
      });
      it("should request the default and return content-type html", async () => {
        await request(app.server).get("/default").expect("Content-Type", /html/);
      });
      it("should request the default and return the default text", async () => {
        const expectedText =
          "Hey there, try /team so we can present to you your's 3 possibles choices";
        await request(app.server).get("/default").expect(expectedText).done;
      });
    });

    describe("/team", () => {
      it("should request the team and return 3 random pokemons ", async () => {
        const expectedTeam = [
          { name: "bulbasaur", moves: ["mega-punch", "ice-punch", "mega-kick"] },
          { name: "charmander", moves: ["mega-punch", "ice-punch", "mega-kick"] },
          { name: "squirtle", moves: ["mega-punch", "ice-punch", "mega-kick"] },
        ];

        const expectedResponse = {
          team: expectedTeam,
        };

        sandbox
          .stub(app.instance.teamService, app.instance.teamService.randomPokemonIndex.name)
          .returns(1)
          .onSecondCall()
          .returns(4)
          .onThirdCall()
          .returns(7);

        await request(app.server).get("/team").expect(expectedResponse);
      });
    });
  });
});
