const { getInjection }=require('../../../core/store/providers');
 
describe('Login funtion',function(){

  test('validLogin', async () => {
    let res = await getInjection('colisCtrl').login({});
     expect(res).contain({ name: "younes" });
  });
  
  test('invalid Login', async () => {
    let res = await getInjection('colisCtrl').login({});
    expect(res).contain({ name: "younes" });
  });
})

describe('search funtion',function(){
  test('validLogin', async () => {
    let res = await getInjection('colisCtrl').login({});
    expect(res).contain({ name: "younes" });
  });
  
  test('invalid Login', async () => {
    let res = await getInjection('colisCtrl').login({});
    expect(res).contain({ name: "younes" });
  });
})

