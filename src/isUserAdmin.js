module.exports = function isUserAdmin(member, globalSettings = require('../globalSettings.json')) {
    if (member != null) {
        let roles = member.roles.array();
        let userPermissions = roles.map(role => role.permissions.toString(2));

        return userPermissions.some(administratorPermissionBitIsOn) || member.user.id == globalSettings.superadminid
    }
    return true;
}

function administratorPermissionBitIsOn(permissions) {
    // https://discordapp.com/developers/docs/topics/permissions
    return permissions.charAt(permissions.length - 4) == '1';
}
