import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { User } from "../User/user.entity.js";
import bcrypt from "bcrypt";

export const login = async (req: Request, res: Response) => {

  try {

    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({
        message: "DNI y contraseña son obligatorios"
      });
    }

    const em = orm.em.fork();

    const user = await em.findOne(User, { dni });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Credenciales inválidas"
      });
    }

    return res.status(200).json({
      data: {
        id: user.id,
        type: user.type
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};
