import { storeInstance } from ".."


export function Service() {
    return function (constructor: Function) {
         storeInstance.emit('registerService', constructor)
    }
}
