import {
  Button,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  Spin,
  Table,
  theme,
  Popconfirm,
  Tag,
  Card,
} from "antd";
import { ManOutlined, WomanOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { UserAddOutlined } from "@ant-design/icons";
import DataApi from "../../utils/DataApi.js";
import { deactivateEmployee, getStyleCodeData } from "./services";
import "./EmployeeList.css";

const { Header, Content } = Layout;

const EmployeeList = () => {
  // 状态定义部分保持不变
  const {
    token: { colorBgContainer, colorBgLayout, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const accountLevel = Form.useWatch("accountLevel", form);
  const [messageApi, contextHolder] = message.useMessage();
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
  const [ifTableDataDone, setIfTableDataDone] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [ifRegister, setIfRegister] = useState(false);
  const [initialTableData, setInitialTableData] = useState([]);

  // 表格列定义保持不变，但移除固定宽度
  const columns = [
    {
      title: "员工姓名",
      dataIndex: "employeeName",
      fixed: "left",
      align: "center",
    },
    {
      title: "账号",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "权限等级",
      dataIndex: "accountLevel",
      align: "center",
      render: (text) => {
        let color = "";
        let label = "";

        switch (text) {
          case "super_admin":
            color = "red";
            label = "超级管理员";
            break;
          case "admin":
            color = "orange";
            label = "管理员";
            break;
          case "employee":
            color = "green";
            label = "普通员工";
            break;
          case "sales_supervisor":
            color = "blue";
            label = "销售主管";
            break;
          case "salesperson":
            color = "purple";
            label = "普通销售";
            break;
          default:
            color = "default";
            label = "未知";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      align: "center",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "部门",
      dataIndex: "departmentName",
      align: "center",
    },
    {
      title: "性别",
      dataIndex: "gender",
      align: "center",
      render: (text, record) => (
        <>
          {text === "male" && (
            <span>
              男
              <ManOutlined style={{ color: "#1890ff" }} /> {/* 蓝色 */}
            </span>
          )}
          {text === "female" && (
            <span>
              女
              <WomanOutlined style={{ color: "#eb2f96" }} /> {/* 粉色 */}
            </span>
          )}
          {text === "other" && (
            <span>
              其他
              <UserOutlined style={{ color: "#faad14" }} /> {/* 橙色 */}
            </span>
          )}
        </>
      ),
    },
    {
      title: "注册时间",
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
              title="确定要注销该员工吗？"
              onConfirm={() => {
                deactivateEmployee({
                  callerEmployeeId: userInfo.employeeId,
                  employeeId: record.employeeId,
                }).then((res) => {
                  if (res.resCode === "0000") {
                    fetchData();
                  }
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
                注销
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const [styleCodeData, setStyleCodeData] = useState([]);

  useEffect(() => {
    getStyleCodeData({
      productId: "KYJ_2024_0003",
      language: "CN",
    }).then((res) => {
      if (res.resCode === "0000") {
        setStyleCodeData(res.body);
      }
    });
  }, []);

  useEffect(() => {
    if (userInfo !== null) {
      fetchData();
    }
  }, [ifRegister]);

  async function fetchData() {
    const employeeInfo = await DataApi.getEmployeeList(
      "/api/employee/getEmployeeList",
      userInfo.employeeId
    );
    if (employeeInfo?.resCode === "0000") {
      setInitialTableData(employeeInfo?.body);
      setIfTableDataDone(true);
    } else {
      console.log("clientInfo  Err");
    }
  }

  const addEmployee = async () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (res) => {
        setComponentDisabled(true);
        return await DataApi.getEmployeeRegister("/api/employee/register", res);
      })
      .then((res) => {
        if (res.resCode === "0000") {
          messageApi.open({
            type: "success",
            content: res.resMsg,
          });
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

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  return (
    <Layout>
      {/* 页面标题部分保持不变 */}
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
        <div style={{ fontSize: 18, fontWeight: "bolder" }}>员工列表</div>
        <Button
          onClick={addEmployee}
          type={"primary"}
          icon={<UserAddOutlined />}
        >
          添加员工
        </Button>
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
              rowKey={(record) => record.employeeId}
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
        title="添加员工"
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
          <Form.Item
            label={"邮箱"}
            name={"email"}
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
              {
                pattern:
                  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                message: "请输入正确的邮箱格式",
              },
            ]}
          >
            <Input placeholder={"xxx@qq.com"} />
          </Form.Item>
          {/* 其他表单项保持不变 */}
          <Form.Item
            label={"员工姓名"}
            name={"employeeName"}
            rules={[
              {
                required: true,
                message: "请输入员工姓名",
              },
            ]}
          >
            <Input placeholder={"请输入员工姓名"} />
          </Form.Item>
          <Form.Item
            label={"手机号"}
            name={"phoneNumber"}
            rules={[
              {
                required: true,
                message: "请输入员工姓名",
              },
            ]}
          >
            <Input placeholder={"请输入员工姓名"} />
          </Form.Item>
          <Form.Item label={"性别"} name={"gender"} initialValue={"other"}>
            <Select
              options={[
                {
                  value: "male",
                  label: "男",
                },
                {
                  value: "female",
                  label: "女",
                },
                {
                  value: "other",
                  label: "其它",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={"员工部门"}
            name={"departmentName"}
            rules={[
              {
                required: true,
                message: "请输入员工部门",
              },
            ]}
          >
            <Input placeholder={"请输入员工部门"} />
          </Form.Item>
          <Form.Item
            label={"账户权限等级"}
            name={"accountLevel"}
            rules={[
              {
                required: true,
                message: "请选择账户权限等级",
              },
            ]}
          >
            <Select
              placeholder="请选择账户权限等级"
              options={[
                {
                  value: "super_admin",
                  label: "超级管理员",
                },
                {
                  value: "admin",
                  label: "管理员",
                },
                {
                  value: "employee",
                  label: "普通员工",
                },
                {
                  value: "sales_supervisor",
                  label: "销售主管",
                },
                {
                  value: "salesperson",
                  label: "普通销售",
                },
              ]}
            />
          </Form.Item>
          {/* 条件渲染部分保持不变 */}
          {accountLevel === "salesperson" && (
            <Form.Item
              label={"销售主管"}
              name={"supervisorId"}
              rules={[
                {
                  required: true,
                  message: "请选择销售主管",
                },
              ]}
            >
              <Select
                placeholder="请选择销售主管"
                options={initialTableData
                  .filter((item) => item.accountLevel === "sales_supervisor")
                  .map((item) => {
                    return {
                      value: item.employeeId,
                      label: item.employeeName,
                    };
                  })}
              />
            </Form.Item>
          )}
          {(accountLevel === "sales_supervisor" ||
            accountLevel === "salesperson") && (
            <Form.Item
              label={"产品权限"}
              name={"productPermissions"}
              rules={[
                {
                  required: true,
                  message: "请选择产品权限",
                },
              ]}
            >
              <Select
                placeholder={"请选择产品权限"}
                options={styleCodeData.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      {contextHolder}
    </Layout>
  );
};
export default EmployeeList;
