import { useAccess } from 'umi';
import styles from './index.less';

export default function IndexPage() {
  const { name } = useAccess();
  return (
    <div>
      <h1 className={styles.title}>猎头2022 - {name}</h1>
    </div>
  );
}
