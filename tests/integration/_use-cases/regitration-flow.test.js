import orchestrator from "tests/orchestrator.js";
import activation from "models/activation.js";
import { act } from "react";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
  await orchestrator.deleteAllEmails();
});

describe("Use case Registration Flow (all successful)", () => {
  let createUserResponseBody;

  test("Create user account", async () => {
    const createUserResponse = await fetch(
      "http://localhost:3000/api/v1/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "RegistrationFlowUser",
          email: "registration.flow@saberlivre.com.br",
          password: "RegistrationFlowPassword",
        }),
      },
    );

    expect(createUserResponse.status).toBe(201);

    createUserResponseBody = await createUserResponse.json();

    expect(createUserResponseBody).toEqual({
      id: createUserResponseBody.id,
      username: "RegistrationFlowUser",
      email: "registration.flow@saberlivre.com.br",
      password: createUserResponseBody.password,
      features: ["read:activation_token"],
      created_at: createUserResponseBody.created_at,
      updated_at: createUserResponseBody.updated_at,
    });
  });

  test("Receive activation email", async () => {
    const lastEmail = await orchestrator.getLastEmail();

    const activationToken = await activation.findOneByUserId(
      createUserResponseBody.id,
    );

    expect(lastEmail.sender).toBe("<contato@saberlivre.com.br>");
    expect(lastEmail.recipients[0]).toBe(
      "<registration.flow@saberlivre.com.br>",
    );
    expect(lastEmail.subject).toBe("Ative sua conta no Saber Livre!");
    expect(lastEmail.text).toContain("RegistrationFlowUser");
    expect(lastEmail.text).toContain(activationToken.id);
  });

  test("Active account", async () => {});
  test("Login", async () => {});
  test("Get user information", async () => {});
});
