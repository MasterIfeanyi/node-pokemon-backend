const express = require("express");
const router = express.Router();
const { getPokemons, getAPokemon, createPokemon, updatePokemon } = require("../../controllers/pokemonController");


router.get("/", getPokemons);

router.post("/", createPokemon);

router.put("/:id", updatePokemon);

router.get("/:id", getAPokemon);


module.exports = router;