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

export async function addShoppingCart(params) {
  return Fetch("/api/shopping/addShoppingCart", params);
}

// 获取购物车列表数据
export async function getShoppingCart(params) {
  return Fetch("/api/shopping/getShoppingCart", params);
}
