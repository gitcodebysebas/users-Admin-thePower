const User = require("../models/user");
const bcrypt = require("bcrypt");
const { generateSign } = require("../../utils/jwt");
const { deleteImgCloudinary } = require("../../utils/deleteImg");

// ---- Register ------------------------------------------------
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json("El email ya está registrado");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            img: req.file ? req.file.path : "",
        });

        const userSaved = await newUser.save();
        return res.status(201).json(userSaved);

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// ---- Login ------------------------------------------------
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json("Email o contraseña incorrectos");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json("Email o contraseña incorrectos");
        }

        const token = generateSign(user._id);
        return res.status(200).json({ token, user });

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// ---- Get all users (solo admin) ------------------------------------------------
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate("posts");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// ---- Get user by id ------------------------------------------------
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("posts");
        if (!user) return res.status(404).json("Usuario no encontrado");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// ---- Change role ------------------------------------------------
const changeRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // solo admin puede cambiar roles
        if (req.user.role !== "admin") {
            return res.status(403).json("No tienes permisos para cambiar roles");
        }

        const userToUpdate = await User.findById(id);
        if (!userToUpdate) return res.status(404).json("Usuario no encontrado");

        userToUpdate.role = role;
        await userToUpdate.save();

        return res.status(200).json({ message: "Rol actualizado", user: userToUpdate });

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

// ---- Delete user ------------------------------------------------
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const requestingUser = req.user;

        // solo puede eliminar su propia cuenta o ser admin
        if (requestingUser.role !== "admin" && requestingUser._id.toString() !== id) {
            return res.status(403).json("No tienes permisos para eliminar esta cuenta");
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) return res.status(404).json("Usuario no encontrado");

        if (userToDelete.img) {
            await deleteImgCloudinary(userToDelete.img);
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json("Usuario eliminado correctamente");

    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = { register, login, getUsers, getUserById, changeRole, deleteUser };