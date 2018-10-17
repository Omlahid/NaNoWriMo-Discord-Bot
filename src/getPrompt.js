module.exports = function getPrompt(prompts = require('../prompts.json')) {
    return prompts[Math.floor(Math.random() * (prompts.length) - 1)];
}