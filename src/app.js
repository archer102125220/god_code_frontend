import { persistStore, persistReducer } from 'redux-persist';
import storage from "redux-persist/es/storage";

const persistConfig = {
  key: 'tcbsms',
  storage,
  whitelist: ['auth'],
};

const persistEnhancer = () => createStore => (reducer, initialState, enhancer) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store);
  return { ...store, persist };
};

export const dva = {
  config: {
    onError(e) {
      e.preventDefault();
      console.error(e.message);
    },
    extraEnhancers: [
      persistEnhancer(),
    ],
  }
}
