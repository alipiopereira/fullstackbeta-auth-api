import { rules, schema } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async login({ auth, session, request, response }) {
    const { username, password } = request.all();

    try {
      await auth.attemp(username, password);

      return response.status(200).json({ msg: "Login realizado com sucesso!" });
    } catch (error) {
      response
        .status(401)
        .json({ error: { auth }, msg: "Opa! Não foi possível fazer login." });
    }
  }

  public async logout({ auth, response }) {
    await auth.logout();

    return response.status(200).json({ error: auth, msg: "Logout realizado com sucesso" });
  }

  public async register({ request, auth, response }) {
    const validationShema = schema.create({
      username: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.maxLength(15),
        rules.unique({ table: "users", column: "username" })
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
    });

    const validatedData = await request.validate({
      schema: validationShema,
    });

    const user = await User.create(validatedData);

    await auth.login(user);

    return response.status(200).json({ error: auth, msg: "Usuário cadastrado com sucesso" });
  }

  public async profile({ auth, response }) {
    const profile = await auth.user.name;
    response.status(200).json({ msg: `Username: ${profile}` });
  }
}
