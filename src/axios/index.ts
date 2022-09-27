import { get } from './http';

export const getUserInfo = () => get({ url: '/user/info' }); // 查询用户登录信息
