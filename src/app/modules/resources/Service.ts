
 import { Service } from "../../../core/metadata/Service.metadata";
import { appResolver } from "../../../core/store/mainResolver";
import resourcesCtrl from "./Controller";
@Service()
export class resourcesService {
    mainResolver: appResolver;
    resourcesCtrl: resourcesCtrl;
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.resourcesCtrl = options.resourcesCtrl;
        this.mainResolver.addListener('resources', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.resourcesCtrl[action] && typeof this.resourcesCtrl[action] === 'function') return response(await this.resourcesCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module)
        })
    }
    
}
