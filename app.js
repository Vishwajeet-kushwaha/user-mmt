const express = require('express');
const app = express();
const userModel = require("./models/user");
const path = require('path');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/create', async (req, res) => {
    let { name, email, image } = req.body;
    try {
        let createdUser = await userModel.create({
            name: name,
            email: email,
            image: image,
        });
        res.send(createdUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        await userModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/read");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/edit/:id', async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.id });
        res.render("edit", { allUsers: user });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/read', async (req, res) => {
    try {
        let users = await userModel.find();
        res.render("read", { users: users });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/update/:id', async (req, res) => {
    let { name, email, image } = req.body;
    try {
        await userModel.findOneAndUpdate(
            { _id: req.params.id },
            { name: name, email: email, image: image },
            { new: true }
        );
        res.redirect("/read");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(5000, function() {
    console.log('Server is running on port 5000');
});
