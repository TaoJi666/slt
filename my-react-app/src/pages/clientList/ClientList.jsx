import { use, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  theme,
  Tag,
  Badge,
  Card,
} from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import DataApi from "../../utils/DataApi.js";
import { getResetPassword } from "./services";
import "./ClientList.css";

const { Header, Content } = Layout;

const ClientList = () => {
  const {
    token: { colorBgContainer, colorBgLayout, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
  // 表格数据是否抵达
  const [ifTableDataDone, setIfTableDataDone] = useState(false);
  // modal框是否打开
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 表单中信息是否可以修改
  const [componentDisabled, setComponentDisabled] = useState(false);
  // 是否注册成功
  const [ifRegister, setIfRegister] = useState(false);

  // table中行的初始数据
  const [initialTableData, setInitialTableData] = useState([]);

  const [employeeList, setEmployeeList] = useState([]);

  // 表格中列的数据结构 - 移除固定宽度
  const columns = [
    {
      title: "客户姓名",
      dataIndex: "fullName",
      fixed: "left",
      align: "center",
    },
    {
      title: "账号",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "客户手机号",
      dataIndex: "phoneNumber",
      align: "center",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "账户等级",
      dataIndex: "accountLevel",
      align: "center",
      render: (text) => {
        let color = "";
        let label = "";

        switch (text) {
          case "A":
            color = "gold";
            label = "A类账户";
            break;
          case "B":
            color = "cyan";
            label = "B类账户";
            break;
          case "O":
            color = "green";
            label = "普通账户";
            break;
          default:
            color = "default";
            label = "未知账户";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "销售员",
      dataIndex: "userEmployeeName",
      align: "center",
    },
    {
      title: "客户账户状态",
      dataIndex: "accountStatus",
      align: "center",
      render: (text, record) => {
        let status = "";
        let color = "";

        switch (text) {
          case 0:
            status = "未激活";
            color = "default";
            break;
          case 1:
            status = "已激活";
            color = "success";
            break;
          case 3:
            status = "被锁定";
            color = "error";
            break;
          default:
            status = "未知";
            color = "default";
        }

        return <Badge status={color} text={status} />;
      },
    },
    {
      title: "账户创建时间",
      dataIndex: "createdAt",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "operate",
      align: "center",
      fixed: "right",
      render: (_, record) => {
        return (
          <>
            <Popconfirm
              title="确定要重置密码吗？"
              onConfirm={() => {
                getResetPassword({ username: record.username }).then((res) => {
                  messageApi.open({
                    type: res.resCode === "0000" ? "success" : "error",
                    content: res.resMsg,
                  });
                });
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" className="action-btn">
                重置密码
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (userInfo !== null) {
      fetchData();
    }
  }, [ifRegister]);

  useEffect(() => {
    if (userInfo !== null) {
      fetchEmployeeData();
    }
  }, []);

  // 获取数据
  async function fetchEmployeeData() {
    const employeeInfo = await DataApi.getEmployeeList(
      "/api/employee/getEmployeeList",
      userInfo.employeeId
    );
    if (employeeInfo?.resCode === "0000") {
      setEmployeeList(
        employeeInfo?.body?.filter(
          (item) =>
            item.accountLevel === "sales_supervisor" ||
            item.accountLevel === "salesperson"
        )
      );
    } else {
      console.log("clientInfo  Err");
    }
  }

  // 获取数据
  async function fetchData() {
    const clientInfo = await DataApi.getUserInfo(
      "/api/user/getUserInfo",
      userInfo.employeeId
    );
    if (clientInfo?.resCode === "0000") {
      setInitialTableData(clientInfo?.body);
      setIfTableDataDone(true);
    } else {
      console.log("clientInfo  Err");
    }
  }

  // 添加客户
  const addClient = async () => {
    setIsModalOpen(true);
  };

  // modal 确认
  const handleOk = () => {
    form
      .validateFields()
      .then(async (value) => {
        setComponentDisabled(true);
        const { employeeId, ...rest } = value;
        const newData = {
          ...rest,
          employeeId: employeeId ? employeeId : userInfo.employeeId,
        };
        return await DataApi.getClientRegister("/api/user/register", newData);
      })
      .then((res) => {
        if (res.resCode === "0000") {
          messageApi.open({
            type: "success",
            content: res.resMsg,
          });
          // 校验成功后 重置form中的内容
          form.resetFields();
          setIsModalOpen(false);
          setIfRegister(!ifRegister);
        } else {
          messageApi.open({
            type: "error",
            content: res.resMsg,
          });
        }
      })
      .then(() => {
        setComponentDisabled(false);
      });
  };
  // modal 取消
  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setComponentDisabled(false);
  };

  return (
    <Layout style={{ borderRadius: borderRadiusLG }}>
      {/* 保持原有的页面标题 */}
      <Header
        style={{
          background: colorBgLayout,
          borderRadius: borderRadiusLG,
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: "bolder" }}>客户列表</div>
        {userInfo?.accountLevel === "sales_supervisor" ||
        userInfo?.accountLevel === "salesperson" ? (
          <Button
            onClick={addClient}
            type={"primary"}
            icon={<UserAddOutlined />}
          >
            添加客户
          </Button>
        ) : null}
      </Header>

      {/* 修改表格区域样式 */}
      <Content style={{ padding: "20px" }}>
        <Card className="table-card">
          {!ifTableDataDone ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={initialTableData}
              size="middle"
              scroll={{ x: "max-content" }}
              rowKey={(record) => record.userId}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
                pageSize: 10,
                pageSizeOptions: ["10", "20", "50"],
              }}
              className="data-table"
            />
          )}
        </Card>
      </Content>

      {/* Modal部分保持不变 */}
      <Modal
        title="添加客户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 13 }}
          disabled={componentDisabled}
        >
          {/* Form.Item部分保持不变 */}
          <Form.Item
            label={"客户邮箱"}
            name={"email"}
            rules={[
              {
                required: true,
                message: "请输入客户邮箱",
              },
              {
                pattern:
                  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                message: "请输入正确的邮箱格式",
              },
            ]}
          >
            <Input placeholder={"请输入客户邮箱"} />
          </Form.Item>
          <Form.Item
            label={"客户姓名"}
            name={"fullName"}
            rules={[
              {
                required: true,
                message: "请输入客户姓名",
              },
            ]}
          >
            <Input placeholder={"请输入客户姓名"} />
          </Form.Item>
          <Form.Item
            label={"客户手机号"}
            name={"phoneNumber"}
            rules={[
              {
                required: true,
                message: "请输入客户手机号",
              },
            ]}
          >
            <Input placeholder={"请输入客户手机号"} />
          </Form.Item>
          <Form.Item
            label={"账户等级"}
            name={"accountLevel"}
            rules={[
              {
                required: true,
                message: "请选择账户类型",
              },
            ]}
          >
            <Select
              placeholder="请选择账户类型"
              options={[
                {
                  value: "A",
                  label: "A类账户",
                },
                {
                  value: "B",
                  label: "B类账户",
                },
                {
                  value: "O",
                  label: "普通账户",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label={"销售员工"} name={"employeeId"}>
            <Select
              placeholder="不填写默认为当前登陆员工"
              options={employeeList.map((item) => ({
                value: item.employeeId,
                label: item.employeeName,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </Layout>
  );
};
export default ClientList;
