const validationUser = require("../validations/user.validations");

const validation = new validationUser();

const createUserService = async (repository, userData) => {
  let { name, mail, password } = userData;
  mail = mail.toLowerCase();

  const searchUser = await repository.findByEmail(mail);
  if (searchUser.error)
    return {
      error: {
        type: "database_error",
        message: "Error inesperado de la base de datos",
      },
    };

  if (searchUser.user !== null)
    return {
      error: { type: "user_exists", message: `Ya existe el mail indicado` },
    };

  if (!validation.minRequirement(password))
    return {
      error: {
        type: "invalid_password",
        message: `La password no cumple los requisitos minimos. Se requiere:\n
            Mínimo de 8 caracteres de longitud.\n
            Al menos una letra minúscula.\n
            Al menos una letra mayúscula.\n
            Al menos un dígito numérico.\n
            Al menos un carácter especial (como !@#$%^&*).`,
      },
    };

  if (!validation.correctstring(name))
    return {
      error: {
        type: "invalid_name",
        message: "Nombre contiene characters extra invalidos",
      },
    };

  if (!validation.correctemail(mail))
    return {
      error: {
        type: "invalid_email",
        message: "El email debe ser un email valido compatible con RFC-5321",
      },
    };

  const passwordSalt = crypto.randomBytes(128).toString("base64");
  const encryptionCycles = crypto.randomInt(5000, 10000);
  const passwordHash = crypto
    .pbkdf2Sync(password, passwordSalt, encryptionCycles, 512, "sha512")
    .toString("base64");

  const user = repository.saveUser({
    name,
    mail,
    passwordHash,
    passwordSalt,
    encryptionCycles,
  });

  if (user instanceof Error)
    return {
      error: { type: "database_error", message: "tienes un error mi pana" },
    };

  return { user };
};

// {user, error}
// {type: thiserror, message: "thisis a mesage"}
module.exports = createUserService;
