const createUserService = require("../../src/services/create_user.js");

class FakeUserRepository {
  // fakeDatabase = [{
  //
  // }]
  async findByEmail(mail) {
    const obj = {
      user: null,
      error: null,
    };
    if (mail == "fakefoundemail@fake.com") obj.user = { mail };

    return obj;
  }

  async saveUser(user) {
    return user;
  }
}

describe("Pruebas para el createUserService", () => {
  const fakeRepository = new FakeUserRepository();
  test("Deberia retornar el tipo de error user_exists si el usuario existe", async () => {
    const response = await createUserService(fakeRepository, {
      name: "juanito",
      mail: "fakefoundemail@fake.com",
      password: "Hola124.",
    });

    expect(response.error.type).toBe("user_exists");
  });

  test("Deberia retornar invalid_password si la contraseña es invalida", async () => {
    const response = await createUserService(fakeRepository, {
      name: "juanito",
      mail: "notfound@fake.com",
      password: "aaaaaaaa",
    });
    expect(response.error.type).toBe("invalid_password");
  });

  test("Deberia retornar invalid_information si el nombre es invalido", async () => {
    //ARRENGE
    //ACT
    const response = await createUserService(fakeRepository, {
      name: "juanito",
      mail: "notfound@fake.com",
      password: "H",
    });
    //ASSERT
    expect(response.error.type).toBe("invalid_password");
  });
});
