
 import { Service } from "../../../core/metadata/Service.metadata";
import { appResolver } from "../../../core/store/mainResolver";
import roleCtrl from "./Controller";
@Service()
export class roleService {
    mainResolver: appResolver;
    roleCtrl: roleCtrl;
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.roleCtrl = options.roleCtrl;
        this.mainResolver.addListener('role', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.roleCtrl[action] && typeof this.roleCtrl[action] === 'function') return response(await this.roleCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module)
        })
    }
    
}
