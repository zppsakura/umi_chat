import Chat from '../services/Chat';
import { Message } from 'antd';

export default {
    namespace: 'chat',
    state: {
        chatInfo: null
    },
    reducers: {
        overrideStateProps(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
        updateStateProps(state, { payload }) {
            const { name, value } = payload;
            return {
                ...state,
                ...{ [name]: { ...state[name], ...value } },
            };
        },
    },
    effects: {
        *fetchChatInfo({ payload }, { call, put }) {
            const fetchResult = yield call(Chat.fetchChatInfo, payload);

            if (!fetchResult.XCmdrCode) {
                yield put({
                    type: 'overrideStateProps',
                    payload: {
                        chatInfo: fetchResult.XCmdrResult,
                    },
                });
            } else {
                Message.Error('网络错误');
                return false;
            }
        },
    },
};
