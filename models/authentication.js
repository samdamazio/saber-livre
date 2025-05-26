import user from "models/user.js";
import password from "models/password.js";
import { UnauthorizedError, NotFoundError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se o email e a senha estão corretos.",
      });
    }
    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se o email está correto.",
        });
      }
      throw error;
    }
    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const isPasswordValid = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError({
        message: "Senha incorreta",
        action: "Verifique se a senha esta correta.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
