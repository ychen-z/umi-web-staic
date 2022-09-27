export interface InitialState {
  isLogin: boolean;
  name: string;
}

export default function (initialState: InitialState) {
  const { name } = initialState || {};
  return {
    isLogin: !!name,
    name,
  };
}
