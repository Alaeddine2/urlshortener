const checkUser = require("../middleware/checkUser");
const User = require("../models/User"); 

jest.mock("../models/User");

describe("Middleware: checkUser", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: { "x-fingerprint": "test-fingerprint" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test("should call next() if user is authenticated", async () => {
    User.findOne.mockResolvedValue({ _id: "123" });

    await checkUser(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });
});
