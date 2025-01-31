const request = require("supertest");
const app = require("../app");
const Url = require("../models/Url");
const Log = require("../models/Log");
const User = require("../models/User");

jest.mock("../models/Url");
jest.mock("../models/Log");
jest.mock("../models/User");

describe("GET /v1/logs/:shortId - Fetch Logs for URL", () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test("should return logs with pagination for a valid URL", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };
    const mockUrl = { _id: "url123", shortId: "abc123", user: mockUser }; 
    const mockLogs = [
      { _id: "log1", url: mockUrl._id, createdAt: "2025-01-30T22:57:07.936Z" },
      { _id: "log2", url: mockUrl._id, createdAt: "2025-01-30T22:57:07.936Z" }, 
    ];
    const totalLogs = 2;

    User.findOne.mockResolvedValue(mockUser);

    Url.findOne.mockResolvedValue(mockUrl);

    const mockFind = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockLogs),
    };
    Log.find.mockReturnValue(mockFind);

    Log.countDocuments.mockResolvedValue(totalLogs);

    const response = await request(app)
      .get("/v1/logs/abc123")
      .set("x-fingerprint", "test-fingerprint")
      .query({ page: "1", limit: "10" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: "API.LOG.LIST.ACCEPT",
      message: "accepted",
      success: true,
      data: mockLogs,
      pagination: {
        total: totalLogs,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });
  });

  test("should return 400 for invalid pagination parameters", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };

    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .get("/v1/logs/abc123")
      .set("x-fingerprint", "test-fingerprint") 
      .query({ page: "invalid", limit: "invalid" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      code: "API.LOG.LIST.FAIL",
      message: "Invalid pagination parameters",
      success: false,
      error: "Invalid pagination parameters",
    });
  });

  test("should return 404 if URL is not found", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };

    User.findOne.mockResolvedValue(mockUser);

    Url.findOne.mockResolvedValue(null);

    const response = await request(app)
      .get("/v1/logs/abc123")
      .set("x-fingerprint", "test-fingerprint") 
      .query({ page: "1", limit: "10" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: "API.LOG.LIST.FAIL",
      message: "URL not found",
      success: false,
      error: "URL not found",
    });
  });

  test("should return 401 if user is unauthorized", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };
    const mockUrl = { _id: "url123", shortId: "abc123", user: { _id: "user456" } }; // Different user

    User.findOne.mockResolvedValue(mockUser);

    Url.findOne.mockResolvedValue(mockUrl);

    const response = await request(app)
      .get("/v1/logs/abc123")
      .set("x-fingerprint", "test-fingerprint")
      .query({ page: "1", limit: "10" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      code: "API.LOG.LIST.FAIL",
      message: "unauthorized",
      success: false,
      error: "unauthorized",
    });
  });

  test("should return 500 if there is a server error", async () => {
    const mockUser = { _id: "user123", fingerprint: "test-fingerprint" };

    User.findOne.mockResolvedValue(mockUser);

    Url.findOne.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .get("/v1/logs/abc123")
      .set("x-fingerprint", "test-fingerprint") 
      .query({ page: "1", limit: "10" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Server error while fetching logs" });
  });
});