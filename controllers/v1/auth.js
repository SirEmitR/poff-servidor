import database from "../../connections/database.js";
import { parse, serialize } from 'cookie';
import { generateToken } from "../../utils/token.js";
import jwt from 'jsonwebtoken';
import generateCode from "../../utils/code.js";
import sendEmail, { EmailType } from "../../utils/email.js";

process.loadEnvFile();
async function validateToken(req, res){
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.poff_auth_token;
    if(!token){
        res.status(401).json({
            data: [],
            status: 'Error',
            error: 'No se ha proporcionado un token'
        });
        return;
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        if(!decoded){
            res.status(401).json({
                data: [],
                status: 'Error',
                error: 'Token inválido'
            });
            return;
        }
        res.json({
            data: {id: decoded.id},
            status: 'Ok'
        });
    }catch(err){
        res.status(401).json({
            data: [],
            status: 'Error',
            error: 'Token inválido'
        });
    }
}

async function login(req, res){
    const query = 'CALL ValidateLogin(?, ?);';
    try{
        const  body = req.body;
        const { email, password } = body;
        const rows = await database.query(query, [email, password]);
        if(rows[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'Correo electrónico y/o contraseña incorrectos'
            });
            return;
        }

        const token = generateToken({
            id: rows[0][0].id,
        });

        const cookie = serialize('poff_auth_token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 días
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.setHeader('Set-Cookie', cookie);
        res.json({
            data: rows[0][0],
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function register(req, res){
    const query = 'CALL CreateUser(?, ?, ?);';
    try{
        const { nombre, email, password } = req.body;
        if(!nombre || !email || !password){
            res.json({
                data: [],
                status: 'Error',
                error: 'Todos los campos son requeridos'
            });
            return;
        }
        const rows = await database.query(query, [email, nombre, password]);
        if(rows[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo crear el usuario'
            });
            return;
        }
        const token = generateToken({
            id: rows[0][0].id,
        });

        const cookie = serialize('poff_auth_token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30, // 30 días
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.setHeader('Set-Cookie', cookie);
        res.json({
            data: rows[0][0],
            status: 'Ok'
        });

    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function logout(_req, res){
    const newCookie = serialize('poff_auth_token', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });
    res.setHeader('Set-Cookie', newCookie);
    res.json({
        data: [],
        status: 'Ok',
        error: 'Cookie eliminada'
    });
}

async function forgot(req, res){
    const {email} = req.body;
    try{
        const code = generateCode();
        const query = 'CALL InsertRecoveryCode(?, ?);';
        const rows = await database.query(query, [email, code]);
        if(rows[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo generar el código de recuperación'
            });
            return;
        }

        if(rows[0][0].error){
            res.json({
                data: [],
                status: 'Error',
                error: rows[0][0].error
            });
            return;
        }
        const emailtype = new EmailType(email, {code}).recoveryPassword();
        sendEmail(emailtype);
        res.json({
            data: code,
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function verifyCode(req, res){
    const {email, code} = req.body;
    try{
        const query = 'CALL ValidateRecoveryCode(?, ?);';
        const rows = await database.query(query, [email, code]);
        if(rows[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo validar el código'
            });
            return;
        }

        if(rows[0][0].error){
            res.json({
                data: [],
                status: 'Error',
                error: rows[0][0].error
            });
            return;
        }
        res.json({
            data: rows[0][0],
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

async function resetPassword(req, res){
    const {email, password} = req.body;
    try{
        const query = 'CALL ChangePassword(?, ?);';
        const rows = await database.query(query, [email, password]);
        if(rows[0].length === 0){
            res.json({
                data: [],
                status: 'Error',
                error: 'No se pudo actualizar la contraseña'
            });
            return;
        }

        if(rows[0][0].error){
            res.json({
                data: [],
                status: 'Error',
                error: rows[0][0].error
            });
            return;
        }
        res.json({
            data: rows[0][0],
            status: 'Ok'
        });
    }catch(err){
        res.json({
            data: [],
            status: 'Error',
            error: err
        });
    }
}

export default {
    login,
    validateToken,
    logout,
    register,
    forgot,
    verifyCode,
    resetPassword
};