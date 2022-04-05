
 import { Service } from "../../../core/metadata/Service.metadata";
import { appResolver } from "../../../core/store/mainResolver";
import colisCtrl from "./Controller";
@Service()
export class colisService {
    mainResolver: appResolver;
    colisCtrl: colisCtrl;
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.colisCtrl = options.colisCtrl;
        this.mainResolver.addListener('colis', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.colisCtrl[action] && typeof this.colisCtrl[action] === 'function') return response(await this.colisCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module)
        })
    }
    
}
