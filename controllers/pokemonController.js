const Pokemon = require("../models/Pokemon");
const User = require("../models/User");

const getPokemons = async (req, res) => {
    const pokemon = await Pokemon.find({ user: req.id });
    if (!pokemon) return res.status(200).json({ "message": "No pokemon found" });
    res.status(200).json(pokemon);
}


//create a goal
const createPokemon = async (req, res) => {
    if (!req?.body) return res.sendStatus(400).json({ "message": "body is required" });
    const { pokemon } = req.body;
    console.log(req.id);
    try {
        const newPokemon = await Pokemon.create({
            pokemon,
            user: req.id
        })
        
        // find the user goals to send to the front-end
        const result = await Pokemon.find({ user: req.id });
        if (!result) return res.status(200).json({ "message": "No pokemon found" });
        console.log("error");
        res.status(201).json(result);
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}


//update a goal
const updatePokemon = async (req, res) => {
    if (!req?.body) return res.sendStatus(400).json({ "message": "body is required" });
    const data = {pokemon: req.body.pokemon}
    try {
        const pokemon = await Pokemon.findById(req.params.id );
        if (!pokemon) return res.status(400).json({ "msg": "Pokemon not found" });

        // find user that made the request
        const user = await User.findById(req.id);

        // check for user
        if (!user) return res.status(400).json({ "msg": "User not found" });

        // make sure the logged in user matches the goal user_id
        if (pokemon.user.toString() !== user.id) return res.status(401).json({ "msg": "User not authorized" }); //unAuthorized
        
        const updatedGoal = await Pokemon.findByIdAndUpdate(req.params.id, { $set: data }, {new: true});

        
        // find the user goals to send to the front-end
        const result = await Pokemon.find({ user: req.id })
        if (!result) return res.status(200).json({ "message": "No pokemon found" });
        res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

const getAPokemon = async (req, res) => {
    if (!req?.params) return res.sendStatus(400).json({ "message": "parameters are required" });
    try {
        const pokemon = await Pokemon.findById(req.params.id);
        if (!pokemon) return res.status(400).json({ "message": "goal not found" });

        // find user that made request
        const user = await User.findById(req.id);

        // check for user
        if (!user) return res.status(400).json({ "msg": "User not found" });

        // make sure the logged in user matches the goal user
        if (pokemon.user.toString() !== user.id) return res.status(401).json({ "msg": "User not authorized" });

        // find the user goals to send to the front-end
        const result = await Pokemon.findById(req.params.id);
        if (!result) return res.status(200).json({ "message": "No goals found" });
        res.status(200).json({ result });
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

module.exports = {
    getPokemons,
    getAPokemon,
    createPokemon,
    updatePokemon
}