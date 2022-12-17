const adminServices = require("../services/adminServices");
const bcrypt = require("bcrypt");

class AdminController {
  async getAllAdmins(req, res) {
    const allAdmins = await adminServices.findAllAdmins();

    res.send({
      welcome: req.loggedName,
      allAdmins,
    });
  }

  async getAdminById(req, res) {
    let id = req.params.id;
    const adminById = await adminServices.findAdminId(id);

    if (adminById == undefined) {
      res.status(404).json({});
    } else {
      res.status(200).json({ adminById });
    }
  }

  async newAdmin(req, res) {
    let { name, email, password, role } = req.body;

    if (!name) res.status(400).send({ error: "O nome está invalido" });
    if (!email) res.status(400).send({ error: "O e-mail está invalido" });
    if (!password) res.status(400).send({ error: "Senha invalida" });
    if (!role && role.indexOf("admin") == -1 || role.indexOf("employee") == -1 ) res.status(400).send({ error: "Role invalida" });

    let emailExists = await adminServices.findEmail(email);
    if (emailExists) res.status(406).json({ error: "Email já Cadastrado" });

    try {
      let hash = await bcrypt.hash(password, 10);
      const status = await adminServices.register(
        name,
        email,
        (password = hash),
        role
      );
      res.status(200).send(status);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async edit(req, res) {
    let id = req.params.id;
    let { name, email } = req.body;

    const AdminById = await adminServices.findAdminId(id);

    if (AdminById) {
      var result = await adminServices.update(id, name, email);
      res.status(200).send(result.status);
    } else {
      res.status(404).json({});
    }
  }

  async remove(req, res) {
    let id = req.params.id;

    const AdminById = await adminServices.findAdminId(id);

    if (AdminById) {
      const AdminById = await adminServices.delete(id);
      res.status(200).json({ AdminById });
    } else {
      res.status(404).json({});
    }
  }
}

module.exports = new AdminController();
