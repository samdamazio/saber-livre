import { InternalServerError } from "infra/errors";
import authorization from "models/authorization.js";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createdUser = { username: "UserWithoutFeatures" };

      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("without unknown `feature`", () => {
      const createdUser = { features: ["unknown_feature"] };

      expect(() => {
        authorization.can(createdUser, "unknown_feature");
      }).toThrow(InternalServerError);
    });

    test("without valid `user` and known `feature`", () => {
      const createdUser = { features: ["create:user"] };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createdUser = { username: "UserWithoutFeatures" };

      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("without unknown `feature`", () => {
      const createdUser = { features: ["unknown_feature"] };

      expect(() => {
        authorization.filterOutput(createdUser, "unknown_feature");
      }).toThrow(InternalServerError);
    });

    test("without valid `user`, known `feature` and `resource`", () => {
      const createdUser = { features: ["read:user"] };
      const resource = {
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        email: "resource@example.com",
        password: "hashedPassword123",
      };

      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: resource.id,
        username: resource.username,
        features: resource.features,
        created_at: resource.created_at,
        updated_at: resource.updated_at,
      });
    });

    test("without valid `user`, known `feature` but no `resource`", () => {
      const createdUser = { features: ["read:user"] };

      expect(() =>
        authorization.filterOutput(createdUser, "read:user"),
      ).toThrow(InternalServerError);
    });
  });
});
