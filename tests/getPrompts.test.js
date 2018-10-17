const getPrompts = require('../src/getPrompt')
const prompts = require('../prompts')

describe('getPrompts', () => {
    test('returns existing prompt', () => {
        const prompt = getPrompts();
        expect(prompts.some(function(e){return e == prompt})).toBe(true)
    })

    test('returns different prompts', () => {
        function areAllPromptsSame() {
            let firstPrompt = getPrompts()
            let secondPrompt = getPrompts()
            let thirdPrompt = getPrompts()
            let fourthPrompt = getPrompts()
            let fifthPrompt = getPrompts()
            return firstPrompt == secondPrompt && firstPrompt == thirdPrompt && firstPrompt == fourthPrompt && firstPrompt == fifthPrompt;
        }
        expect(areAllPromptsSame()).toBe(false)
    })
})