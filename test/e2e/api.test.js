const { describe, it, before, beforeEach, after, afterEach } = require("mocha");
const { expect } = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const TeamService = require("../../src/service/teamService");

const SERVER_TEST_PORT = 4000;

const FIRST_PAGE_URL = "https://pokeapi.co/api/v2/pokemon";

describe("API SUIT TEST", () => {
  let app = {};
  let sandbox = {};

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  before(() => {
    const api = require("../../src/api");
    const teamService = new TeamService({
      url: FIRST_PAGE_URL,
    });
    const instance = api({ teamService });

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
        .stub(app.instance.teamService, app.instance.teamService.getTeam.name)
        .resolves(expectedTeam);

      await request(app.server).get("/team").expect(expectedResponse);
    });
  });
});
