import { Button, Card, Form, Input, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import DataApi from "../../utils/DataApi.js";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // 登录按钮
  const onFinish = async (values) => {
    const { username, password } = values;
    const data = await DataApi.getLogin(
      "/api/employee/login",
      username,
      password
    );
    if (data?.resCode === "0000") {
      window.localStorage.setItem("userInfo", JSON.stringify(data?.body));
      // 若成功 则返回上一个页面
      navigate("/home");
    } else {
      // 若失败 则弹出提示框
      messageApi.open({
        type: "error",
        content: data?.resMsg,
      });
    }
  };

  return (
    <div className={"loginContainer"}>
      {contextHolder}
      <Card
        title={
          <div style={{ fontSize: "24px" }}>
            <span style={{ color: "#1566ff" }}>Sollant </span>
            <span>log in to Web</span>
          </div>
        }
        style={{ padding: 50 }}
        variant="borderless"
      >
        <Form
          form={form}
          size={"large"}
          onFinish={onFinish}
          layout={"vertical"}
        >
          {/*账号*/}
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          {/*密码*/}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          {/*登录按钮*/}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: 10 }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
