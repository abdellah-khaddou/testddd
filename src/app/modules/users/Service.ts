import { Service } from '../../../core/metadata/Service.metadata';
import { appResolver } from '../../../core/store/mainResolver';
import usersCtrl from './Controller';

@Service()
export class userService {
    mainResolver: appResolver;
    userCtrl: usersCtrl;
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.userCtrl = options.usersCtrl;
        this.mainResolver.addListener('users', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.userCtrl[action] && typeof this.userCtrl[action] === 'function') return response(await this.userCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module)
        })
    }
    
}
