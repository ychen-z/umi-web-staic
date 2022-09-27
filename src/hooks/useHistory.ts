import { useHistory } from 'umi';

export default () => {
  const history = useHistory();

  const goBack = (path?: string) => {
    // 无父级路由时，跳转指定页面
    if (history.length === 1 && path) {
      history.push(path);
      return;
    }

    history.goBack();
  };

  return { ...history, goBack };
};
