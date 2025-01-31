const Url = require("../models/Url");
const urlController = require("../controllers/urlController");
const validator = require("validator");

jest.mock("../models/Url");
jest.mock('nanoid', () => ({
  nanoid: () => 'abc123' // Mock nanoid to avoid synamic insertion problem
}));

describe("URL Controller Tests", () => {
  test("should create a shortened URL", async () => {
    const req = { 
      headers: { "x-fingerprint": "test-fingerprint" },
      body: { longUrl: "https://example.com", name: "test", expiresAt: null }, 
      user: { _id: "user123" }  
    };
    const res = { 
      status: jest.fn().mockReturnThis(), 
      json: jest.fn(),
    };

    jest.spyOn(validator, "isURL").mockReturnValue(true);

    Url.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        shortUrl: "http://short.ly/abc123",
      }),
    }));

    await urlController.shortenUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      code: "API.SHORTURL.CREATION.ACCEPT",
      message: "new shortul created",
      success: true,
    }));
  });
});