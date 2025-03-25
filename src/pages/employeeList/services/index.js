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

// 重置密码
export async function getResetPassword(params) {
  return Fetch("/api/user/reset_password", params);
}

// 员工账户注销
export async function deactivateEmployee(params) {
  return Fetch("/api/employee/deactivateEmployee", params);
}

// 获取所有的款式(styleCode)
export async function getStyleCodeData(params) {
  return Fetch("/api/prod/getStyleCodeData", params);
}
