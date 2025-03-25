import ConstVar from "../../../utils/SysConst";

async function Fetch(path, props) {
  console.log(props, "propspropsprops");
  return fetch(`${ConstVar.apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...props }),
  }).then((res) => res.json());
}

export async function getQueryOrders(params) {
  return Fetch("/api/order/queryOrders", params);
}

// 客户列表
export async function getUserInfo(params) {
  return Fetch("/api/user/getUserInfo", params);
}

// 员工列表
export async function getEmployeeList(params) {
  return Fetch("/api/employee/getEmployeeList", params);
}

//  删除订单
export async function deleteOrder(params) {
  return Fetch("/api/order/deleteOrder", params);
}

// 更新订单状态
export async function updateStatus(params) {
  return Fetch("/api/order/updateStatus", params);
}
