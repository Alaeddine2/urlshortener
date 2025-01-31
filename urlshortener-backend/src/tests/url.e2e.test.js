const request = require("supertest");
const app = require("../app");
const Url = require("../models/Url");
const User = require("../models/User");
const validator = require("validator");

jest.mock("../models/Url");
jest.mock("../models/User");

jest.mock("nanoid", () => ({
  nanoid: () => "abc123",
}));

describe("POST /v1/shorten - Shorten URL", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a shortened URL successfully", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };
    const mockUrl = {
      _id: "url123",
      longUrl: "https://example.com",
      shortId: "abc123",
      shortUrl: "http://short.ly/abc123",
      user: mockUser._id,
      name: "test",
      expiresAt: null,
    };

    User.findOne.mockResolvedValue(mockUser);

    Url.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockUrl),
    }));

    jest.spyOn(validator, "isURL").mockReturnValue(true);

    const response = await request(app)
      .post("/v1/shorten")
      .set("x-fingerprint", "test-fingerprint")
      .send({
        longUrl: "https://example.com",
        name: "test",
        expiresAt: null,
      });

    expect(response.status).toBe(201);
  });

  test("should return 500 if there is a server error", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };

    User.findOne.mockResolvedValue(mockUser);

    Url.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Database error")), 
    }));

    const response = await request(app)
      .post("/v1/shorten")
      .set("x-fingerprint", "test-fingerprint")
      .send({
        longUrl: "https://example.com",
        name: "test",
        expiresAt: null,
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: "API.SHORTURL.CREATION.FAIL",
      message: "Internal Error",
      success: false,
      error: "Database error",
    });
  });
});
