import Mock from 'mockjs';

export default {
  'GET /mock/user/info': {
    code: 200,
    data: {
      name: Mock.mock('@name'),
      isLogin: true,
    },
  },

  'POST /api/login': {
    code: 200,
    data: 'sssssssssssss',
  },
};
