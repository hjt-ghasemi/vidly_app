const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const request = require("supertest");
let token;
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../app");
    token = new User().generateToken();
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  function exec() {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  }

  it("should return 401 status if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });
});
