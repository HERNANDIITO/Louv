import User from "../user.schema.js";
import bcrypt from "bcrypt";

const createAddress = ({ street, extraInfo, postalCode, locality, province, country }) => ({
  street,
  extraInfo,
  postalCode,
  locality,
  province,
  country
});

async function populateUserCollection(deps = {}) {
  try {

    // Usuarios de ejemplo con una contraseña en texto plano para generar salt+hash dinámicamente
    const users = [
      {
        name: "Juan",
        surname: "Pérez",
        email: "juan.perez@example.com",
        plainPassword: "JuanPass#1",
        dni: "87654321B",
        title: "Mr.",
        countryPrefix: "+34",
        phone: "600123456",
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        completeAccount: true,
        address: createAddress({
          street: "Calle Falsa 123",
          extraInfo: "N5 planta 3 puerta 1",
          postalCode: "08001",
          locality: "Barcelona",
          province: "Barcelona",
          country: "spain"
        })
      },
      {
        name: "Ana",
        surname: "Gómez",
        email: "ana.gomez@example.com",
        plainPassword: "Ana2025$",
        dni: "23456789C",
        title: "Ms.",
        countryPrefix: "+34",
        phone: "612987654",
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        completeAccount: true,
        address: createAddress({
          street: "Avenida del Sol 5",
          extraInfo: "N35",
          postalCode: "41001",
          locality: "Sevilla",
          province: "Sevilla",
          country: "spain"
        })
      },
      {
        name: "Carlos",
        surname: "Villagrá",
        email: "carlos@example.com",
        plainPassword: "Carlos#26",
        dni: "",
        title: "Mr.",
        countryPrefix: "+34",
        phone: "123456789",
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        completeAccount: true,
        address: createAddress({
          street: "Carretera de San Vicente del Raspeig s/n",
          extraInfo: "Campus de San Vicente del Raspeig",
          postalCode: "03690",
          locality: "San Vicente del Raspeig",
          province: "Alicante",
          country: "spain"
        })
      },
      {
        name: "UserTest",
        surname: "UA",
        email: "userTest@example.com",
        plainPassword: "UATest#26",
        dni: "",
        title: "Mr.",
        countryPrefix: "+34",
        phone: "123456789",
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        completeAccount: true,
        address: createAddress({
          street: "Carretera de San Vicente del Raspeig s/n",
          extraInfo: "Campus de San Vicente del Raspeig",
          postalCode: "03690",
          locality: "San Vicente del Raspeig",
          province: "Alicante",
          country: "spain"
        })
      }
    ];

    const created = [];
    for (const userData of users) {
      // Evitar duplicados por email
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        continue;
      }

      const plain = userData.plainPassword;
      // Generar salt y hash válidos con bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(plain, salt);
        
      // Asignar campos que la base de datos espera
      userData.salt = salt;
      userData.password = hashed;
      // eliminar la contraseña en claro antes de crear el modelo
      delete userData.plainPassword;

      const user = new User(userData);
      await user.save();

      // Mostrar en consola para que sepas qué contraseña se generó por usuario
      created.push({ _id: user._id, name: user.name, email: user.email });
    }
    return { User: created };

  } catch (error) {
    console.error("Error al poblar User:", error);
  }
}

export default populateUserCollection;