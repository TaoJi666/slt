import ConstVar from "../../../utils/SysConst";

async function Fetch(path, props) {
  return fetch(`${ConstVar.apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...props }),
  }).then((res) => res.json());
}

// 获取购物车列表数据
export async function getShoppingCart(params) {
  return Fetch("/api/shopping/getShoppingCart", params);
}

// 删除购物车商品
export async function deleteShoppingCart(params) {
  return Fetch("/api/shopping/deleteShoppingCart", params);
}

// 购物车商品生成订单
export async function createOrder(params) {
  return Fetch("/api/order/createOrder", params);
}

// 获取用户信息
export async function getUserInfo(params) {
  return Fetch("/api/user/getUserInfo", params);
}
