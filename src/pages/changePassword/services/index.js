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

// 修改密码
export async function getChangePassword(params) {
  return Fetch("/api/employee/change_password", params);
}
