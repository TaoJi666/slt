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
