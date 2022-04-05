"use strict";
const { getInjection } = require('../../../core/store/providers');
describe('Login funtion', function () {
    test('validLogin', async () => {
        let res = await getInjection('app_permissionCtrl').login({});
        expect(res).contain({ name: "younes" });
    });
    test('invalid Login', async () => {
        let res = await getInjection('app_permissionCtrl').login({});
        expect(res).contain({ name: "younes" });
    });
});
describe('search funtion', function () {
    test('validLogin', async () => {
        let res = await getInjection('app_permissionCtrl').login({});
        expect(res).contain({ name: "younes" });
    });
    test('invalid Login', async () => {
        let res = await getInjection('app_permissionCtrl').login({});
        expect(res).contain({ name: "younes" });
    });
});
//# sourceMappingURL=Test.test.js.map