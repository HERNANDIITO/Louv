import Employee from "../employee.schema.js";
import bcrypt from "bcrypt";

async function populateEmployeeCollection(deps = {}) {
  try {

    const employees = [
      {
        name: "Belen",
        surname: "Sempere",
        email: "bel@example.com",
        plainPassword: "Admin#2025",
        permissions: ["admin"]
      },
      {
        name: "Darío",
        surname: "Pérez",
        email: "dario@example.com",
        plainPassword: "Admin#2025",
        permissions: ["admin"]
      },
      {
        name: "Laura",
        surname: "Saval",
        email: "laura@example.com",
        plainPassword: "Admin#2025",
        permissions: ["admin"]
      },
      {
        name: "Carlos",
        surname: "Villagrá",
        email: "carlos.admin@example.com",
        plainPassword: "Carlos#26",
        permissions: ["admin"]
      },
      {
        name: "UserTest",
        surname: "UA",
        email: "userTest.admin@example.com",
        plainPassword: "UATest#26",
        permissions: ["admin"]
      }
    ];

    const created = [];
    for (const empData of employees) {
      // Evitar duplicados por email
      const existing = await Employee.findOne({ email: empData.email });
      if (existing) {
        continue;
      }

      const plain = empData.plainPassword;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(plain, salt);

      empData.salt = salt;
      empData.password = hashed;
      delete empData.plainPassword;

      const emp = new Employee(empData);
      await emp.save();

      created.push({ _id: emp._id, name: `${emp.name} ${emp.surname}`, email: emp.email });
    }
    return { Employee: created };
  } catch (error) {}
}

export default populateEmployeeCollection;
