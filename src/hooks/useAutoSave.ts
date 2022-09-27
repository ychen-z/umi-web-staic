import { useEffect, useRef } from 'react';
import { useDebounceFn } from 'ahooks';
import { Modal, message } from 'antd';

interface UseAutoSaveProps {
  auto: {
    handleIntervalSave?: (parm: { pageId: number }) => Promise<any>;
    time?: number;
    action?: {
      doing: Function;
      success: Function;
      error: Function;
    };
  };
  pageId: {
    handlePageID?: (parm: { pageId: number }) => Promise<any>;
    time?: number;
    leaverTime?: number;
    action?: {
      error: Function;
    };
  };
}

/**
 * 自动暂存hooks
 * @param handleIntervalSave 自动暂存的保存方法 返回Promise
 * @param handlePageID pageID注册方法
 * @return addAutoSave  增加自动暂存, form表单onValuesChange使用
 * @return addPageId  注册pageID，在页面进入初始使用
 * @return cancelAutoSave  注销
 */
const useAutoSave = (
  props: UseAutoSaveProps,
): {
  addAutoSave: Function;
  addPageId: Function;
  cancelAutoSave: Function;
  addPageIdNotFirst: Function;
  pageId: number;
} => {
  const { auto, pageId } = props;
  const timer = useRef<NodeJS.Timeout | null>(null);
  const isErr = useRef(false);
  const pageRandom = useRef<number>(0);
  const key = 'updatable';

  /**
   * 随机数生成
   */
  useEffect(() => {
    pageRandom.current = Math.floor(Math.random() * 100000); // 页面随机数，后端自动暂存用户页面标示
  }, []);

  /**
   * pageID 注册
   */

  const catchHandle = (err) => {
    // 前promise都会在这错误处理
    // 统一处理后端错误信息 411表示页面内容已在别的页面进行了修改
    if (err.code === 411) {
      if (timer.current) {
        clearInterval(timer.current);
      }
      isErr.current = true;
      pageId?.action?.error() ||
        Modal.error({
          title: '页面内容已修改',
          content: '页面内容已修改，请刷新后重试',
          onOk: () => {
            window.location.reload();
          },
        });
    }
  };

  const handleSave = () => {
    pageId?.handlePageID({ pageId: pageRandom.current }).catch((err: any) => {
      catchHandle(err);
    });
  };

  // pagID 注入
  const fetchPageId = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      // 当前页面激活状态开启pageID的请求
      handleSave();
    }, pageId?.time || 10000);
  };

  // 标签页显示与隐藏监听
  const tabChangeEvent = () => {
    if (document.visibilityState === 'hidden') {
      // 切离该页面时 删除定时器 将数据保存至后端
      !isErr.current && handleSave();
      if (timer.current) {
        const time = timer.current;
        setTimeout(() => {
          clearInterval(time);
        }, pageId?.leaverTime || 30000);
      }
    } else if (document.visibilityState === 'visible') {
      !isErr.current && fetchPageId();
    }
  };

  // 删除
  const cancelAutoSave = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    document.removeEventListener('visibilitychange', tabChangeEvent);
  };

  // pageID注入
  const addPageId = () => {
    // 第一次进入注册pageID
    handleSave();
    // 循环开始pageID:获取当前pageID是否为最新
    fetchPageId();
    // 监听页面激活状态
    document.addEventListener('visibilitychange', tabChangeEvent);
  };

  // pageID注入不执行第一次
  const addPageIdNotFirst = () => {
    // 循环开始pageID:获取当前pageID是否为最新
    fetchPageId();
    // 监听页面激活状态
    document.addEventListener('visibilitychange', tabChangeEvent);
  };

  /**
   * 自动暂存
   */

  // 暂存防抖
  const { run, cancel } = useDebounceFn(
    () => {
      auto?.action?.doing() || message.loading({ content: '自动保存中', key });
      auto
        ?.handleIntervalSave({ pageId: pageRandom.current })
        .then(() => {
          setTimeout(() => {
            auto?.action?.success() ||
              message.success({ content: '自动保存成功', key, duration: 2 });
          }, 500);
        })
        .catch((err) => {
          catchHandle(err);
          auto?.action?.error() ||
            message.error({ content: '自动保存失败', key, duration: 2 });
        });
    },
    { wait: auto?.time || 15000 },
  );

  // 增加
  const addAutoSave = () => {
    run();
  };

  useEffect(() => {
    // 卸载组件的时候 删除自动暂存
    return () => {
      cancel();
      cancelAutoSave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    addAutoSave,
    cancelAutoSave,
    addPageId,
    addPageIdNotFirst,
    pageId: pageRandom.current,
  };
};

export default useAutoSave;
