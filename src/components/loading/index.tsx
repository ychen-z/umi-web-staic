import React from 'react';
import { Spin } from 'antd';
import styles from './index.less';

export default function Loading() {
  return (
    <div className={styles.container}>
      <Spin />
    </div>
  );
}
