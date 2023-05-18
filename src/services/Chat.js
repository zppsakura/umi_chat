import request from '../utils/request';
import Model from './Model';

export default class Chat extends Model {
    /** 新增签认单 */
    static fetchChatInfo(params) {
        return request({
            url: 'https://cp-api.zhgcloud.com/confirmation-receipts',
            headers: 'application/json',
            body: JSON.stringify(params),
            method: 'POST',
        });
    }
}
