const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");

describe("api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = function () {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../app");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateToken();
    rental = await new Rental({
      customer: {
        _id: customerId,
        name: "customerName",
        phone: 123456,
      },
      movie: {
        _id: movieId,
        title: "movieName",
        dailyRentalRate: 2,
      },
      dateOut: Date.now() - 3 * 8.64e7,
    }).save();
  });
  afterEach(async () => {
    await server.close();
    await Rental.remove({});
  });

  it("should return 400 if token is invalid", async () => {
    token = "invalidToken";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 401 if token is not provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    customerId = undefined;
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/customer/);
  });

  it("should return 400 if movieId is not provided", async () => {
    movieId = undefined;
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/movie/);
  });

  it("should return 404 if no rental exists for given moiveId and customerId", async () => {
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    const res = await exec();

    expect(res.status).toBe(404);
    expect(res.text).toMatch(/rental/);
  });

  it("should return 400 if rental is already processed", async () => {
    await Rental.updateOne(
      { "customer._id": customerId, "movie._id": movieId },
      { dateReturned: Date.now() + 99999, rentalFee: 100 }
    );

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.text).toMatch(/rental/);
  });

  it("should return response with 200 status and complete rental object", async () => {
    const res = await exec();
    
    expect(res.status).toBe(200);
    expect(res.body.dateReturned).toBeDefined();
  });
});
