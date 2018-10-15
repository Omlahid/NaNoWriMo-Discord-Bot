const isUserAdmin = require('../src/isUserAdmin')

describe('isUserAdmin', () => {
    test('returns true when member is null', () => {
        expect(isUserAdmin(null)).toBe(true)
    })

    test('returns true when the administrator bit is on', () => {
        const member = createFakeMember(parseInt('1000', 2))
        expect(isUserAdmin(member)).toBe(true)
    })

    test('returns false when the administrator bit is off', () => {
        const member = createFakeMember(parseInt('0111', 2))
        expect(isUserAdmin(member)).toBe(false)
    })

    test('returns true when the userId is the superadminid', () => {
        const id = '1337'
        const member = createFakeMember(undefined, id)
        const globalSettings = { superadminid: id }

        expect(isUserAdmin(member, globalSettings)).toBe(true)
    })

    test('returns false when the userId is not the superadminid', () => {
        const superadminid = '1337'
        const member = createFakeMember()
        const globalSettings = { superadminid }

        expect(isUserAdmin(member, globalSettings)).toBe(false)
    })
})

function createFakeMember(permissions = 0, userId = '') {
    return {
        roles: {
            array: () => [{ permissions }]
        },
        user: {
            id: userId
        }
    }
}
