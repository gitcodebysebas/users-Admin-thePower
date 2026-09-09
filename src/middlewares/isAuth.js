const { verifyJwt } = require("../utils/jwt");
const User = require("../api/models/user");

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json("No tienes autorización");
        }

        const { id } = verifyJwt(token);
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).json("Usuario no encontrado");
        }

        user.password = null;
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json("Token inválido");
    }
};

module.exports = { isAuth };