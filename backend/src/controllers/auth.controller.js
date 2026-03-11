import jwt from "jsonwebtoken";
import { createUser, loginUser } from "../services/users.service.js";
/* ======================
   TOKEN HELPERS
====================== */

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
}
/* ======================
   REGISTER
====================== */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Datos incompletos",
      });
    }

    const user = await createUser({ name, email, password });

    return res.status(201).json({
      message: "Usuario creado",
      user,
    });

  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "El email ya está registrado",
      });
    }

    return next(error);
  }
}

/* ======================
   LOGIN
====================== */
export async function login(req, res, next) {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y password requeridos",
      });
    }

    const user = await loginUser({ email, password });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.json({
      message: "Login correcto",
      accessToken,
      refreshToken,
      user,
    });

  } catch (error) {

    return res.status(401).json({
      message: error.message || "Credenciales inválidas",
    });

  }
}
/* ======================
   REFRESH TOKEN
====================== */

export function refreshToken(req, res) {

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token requerido",
    });
  }

  try {

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.json({
      accessToken,
    });

  } catch {

    return res.status(403).json({
      message: "Refresh token inválido",
    });

  }
}

