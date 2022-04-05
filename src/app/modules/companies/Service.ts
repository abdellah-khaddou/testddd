
 import { Service } from "../../../core/metadata/Service.metadata";
import { appResolver } from "../../../core/store/mainResolver";
import companiesCtrl from "./Controller";
@Service()
export class companiesService {
    mainResolver: appResolver;
    companiesCtrl: companiesCtrl;
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.companiesCtrl = options.companiesCtrl;
        this.mainResolver.addListener('companies', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.companiesCtrl[action] && typeof this.companiesCtrl[action] === 'function') return response(await this.companiesCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module)
        })
    }
    
}
