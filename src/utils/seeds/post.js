require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../../api/models/post");
const User = require("../../api/models/user");
const posts = require("../../data/posts");

const seedPosts = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Conectado a la BBDD");

        // busca un usuario existente para asignarle los posts
        const user = await User.findOne();
        if (!user) {
            console.log("No hay usuarios en la BBDD — crea uno primero con /register");
            await mongoose.disconnect();
            return;
        }

        await Post.deleteMany();
        console.log("Posts eliminados");

        // añade el author a cada post
        const postsWithAuthor = posts.map(post => ({
            ...post,
            author: user._id,
        }));

        const postsSaved = await Post.insertMany(postsWithAuthor);
        console.log(`${postsSaved.length} posts insertados`);

        // añade los posts al array del usuario sin duplicar
        const postIds = postsSaved.map(post => post._id);
        await User.findByIdAndUpdate(
            user._id,
            { $addToSet: { posts: { $each: postIds } } },
            { new: true }
        );
        console.log("Posts añadidos al usuario:", user.name);

    } catch (error) {
        console.log("Error en el seed:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Desconectado de la BBDD");
    }
};

seedPosts();