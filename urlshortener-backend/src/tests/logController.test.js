const { getLogsForUrl } = require("../controllers/logController");
const Url = require("../models/Url");
const Log = require("../models/Log");

jest.mock("../models/Url");
jest.mock("../models/Log");

describe("Log Controller - getLogsForUrl (Success Case)", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { shortId: "abc123" },
      user: { _id: "user123" },
      query: { page: "1", limit: "10" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return logs with pagination for a valid URL", async () => {
    const mockUrl = { _id: "url123", user: { _id: "user123" } };
    const mockLogs = [{ _id: "log1" }, { _id: "log2" }];
    const totalLogs = 2;

    Url.findOne.mockResolvedValue(mockUrl);

    const mockFind = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockLogs),
    };
    Log.find.mockReturnValue(mockFind);

    Log.countDocuments.mockResolvedValue(totalLogs);

    await getLogsForUrl(req, res);

    expect(Url.findOne).toHaveBeenCalledWith({ shortId: "abc123" });

    expect(Log.find).toHaveBeenCalledWith({ url: "url123" });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
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
});