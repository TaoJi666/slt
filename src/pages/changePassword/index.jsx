import { Button, Card, Form, Input, message } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import { getChangePassword } from "./services";
import { useNavigate } from "react-router-dom";
import "./index.css";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // 登录按钮
  const onFinish = async (values) => {
    const { oldPassword, newPassword } = values;
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
    const { username } = userInfo || {};
    const data = await getChangePassword({
      username,
      oldPassword,
      newPassword,
    });
    if (data?.resCode === "0000") {
      messageApi.open({
        type: "success",
        content: "修改密码成功",
      });
      window.localStorage.removeItem("userInfo"); // 移除用户信息
      navigate("/login"); // 跳转到登录页
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
            label="old Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input prefix={<UnlockOutlined />} />
          </Form.Item>

          {/*密码*/}
          <Form.Item
            label="new Password"
            name="newPassword"
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
              确定修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePassword;
