const mongoose = require("mongoose");
let server;
const request = require("supertest");
const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");

describe("api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  describe("GET /", () => {
    it("should return all genres stored in db", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre by given valid id", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("genre1");
    });

    it("should return response with 404 status for invalid id", async () => {
      const id = new mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return res with 401 status if user is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 response if genre name is less than 5 characters", async () => {
      const token = new User().generateToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 response if genre name is more than 50 characters", async () => {
      const token = new User().generateToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "".padStart(51, "a") });

      expect(res.status).toBe(400);
    });

    it("should save genre in database and return it via response", async () => {
      const genreName = Math.random().toString();
      const token = new User().generateToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: genreName });

      const result = await Genre.findOne({ name: genreName });

      expect(res.status).toBe(200);
      expect(result.name).toBe(genreName);
      expect(res.body.name).toBe(genreName);
    });
  });
});
