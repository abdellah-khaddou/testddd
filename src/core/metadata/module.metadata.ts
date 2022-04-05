import { storeInstance } from '..';
import { requestFormat, stageRequest, stageResponse } from '../interfaces/Request';

export function Module(metadata: moduleMetaData) {
  return function (constructor: Function,) {
    storeInstance.emit('registerModule', constructor)
    storeInstance.setModuleInput(constructor.name.replace('Ctrl', ''), metadata.inputs)
    storeInstance.setModuleOutput(constructor.name.replace('Ctrl', ''), metadata.outputs)
  }
}
export class moduleMetaData {
  inputs?: ((req: stageRequest, res: stageResponse) => any)[];
  outputs?: ((req: stageRequest, res: stageResponse) => any)[];
}