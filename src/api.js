const http = require("http");
const TeamService = require("./service/teamService");

const DEFAULT_PORT = 3000;
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const FIRST_PAGE_URL = "https://pokeapi.co/api/v2/pokemon";

const createTeamService = () => ({ teamService: new TeamService({ url: FIRST_PAGE_URL }) });

class Api {
  constructor(dependencies = createTeamService()) {
    this.teamService = dependencies.teamService;
  }

  createRoutes() {
    return {
      default: (request, response) => {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write("Hey there, try /team so we can present to you your's 3 possibles choices");
        return response.end();
      },
      "/team:get": async (request, response) => {
        const team = await this.teamService.getTeam();
        response.write(JSON.stringify({ team }));
        return response.end();
      },
    };
  }

  handler(request, response) {
    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;

    const routes = this.createRoutes();
    const chosen = routes[routeKey] || routes.default;

    response.writeHeader(200, DEFAULT_HEADERS);

    return chosen(request, response);
  }

  createServer(port = DEFAULT_PORT) {
    const app = http
      .createServer(this.handler.bind(this))
      .listen(port, () => console.log(`Listening on ${port}`));

    return app;
  }
}

// adiciono NODE_ENV para teste (adicionado no Package.json)
if (process.env.NODE_ENV !== "test") {
  const api = new Api();
  api.createServer();
}

module.exports = (dependencies) => new Api(dependencies);
