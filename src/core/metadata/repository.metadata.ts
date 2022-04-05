import { storeInstance } from ".."


export function Repository() {
    return function (constructor: Function) {
        storeInstance.emit('registerRepository', constructor)
    }
}
