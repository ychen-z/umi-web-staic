import { useIntl } from 'umi';

type Value = { [key: string]: string };

const t = (id: string, description: string, values?: Value) => {
  const intl = useIntl();
  return intl.formatMessage({ id, description }, values);
};

export default t;
