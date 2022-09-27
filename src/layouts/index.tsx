import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import style from './index.less';

export default (props: any) => {
  if (props.location.pathname === '/login') {
    return <>{props.children}</>;
  }
  return (
    <div className={style.layout}>
      <Header />
      <div className={style.main}>{props.children}</div>
      <Footer />
    </div>
  );
};
