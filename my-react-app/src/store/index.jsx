import React, { createContext, useReducer } from "react";

// 定义初始状态
const initialState = {
  cartCount: 0,
};

// 定义 reducer 函数
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return { ...state, cartCount: action.payload };
    default:
      return state;
  }
};

// 创建上下文
export const StoreContext = createContext();

// 创建提供者组件
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
