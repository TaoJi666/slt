import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Table,
  DatePicker,
  Popconfirm,
  Row,
  Col,
  Tabs,
  Badge,
  ConfigProvider,
  Card,
  Typography,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  UnorderedListOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  getQueryOrders,
  getUserInfo,
  getEmployeeList,
  deleteOrder,
  updateStatus,
} from "./services";
import "./order.css";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const OrderList = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
  const [ifTableDataDone, setIfTableDataDone] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  const [userInfoList, setUserInfoList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [searchParams, setSearchParams] = useState({});

  // 修改表格列定义，移除固定宽度，使其更加灵活
  const columns = [
    {
      title: "订单号",
      dataIndex: "orderId",
      align: "center",
    },
    {
      title: "用户账户",
      dataIndex: "username",
      align: "center",
    },
    {
      title: "用户姓名",
      dataIndex: "userFullName",
      align: "center",
    },
    {
      title: "销售员工姓名",
      dataIndex: "salesEmployeeName",
      align: "center",
    },
    {
      title: "订单状态",
      dataIndex: "orderStatus",
      align: "center",
      render: (text, record) => {
        const statusMap = {
          0: { text: "待支付", badgeStatus: "error" },
          1: { text: "已支付", badgeStatus: "warning" },
          2: { text: "已发货", badgeStatus: "processing" },
          3: { text: "已完成", badgeStatus: "success" },
          4: { text: "已取消", badgeStatus: "default" },
        };

        const { text: statusText, badgeStatus } =
          statusMap[record.orderStatus] || {};
        return (
          <Space size="middle">
            <Badge status={badgeStatus} />
            {statusText || "-"}
          </Space>
        );
      },
    },
    {
      title: "订单总金额",
      dataIndex: "totalAmount",
      align: "center",
      render: (text) => `￥${text}`,
    },
    {
      title: "下单时间",
      dataIndex: "createdAt",
      align: "center",
    },
    {
      title: "支付方式",
      dataIndex: "paymentMethod",
      align: "center",
      render: (text) => text || "-",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <ConfigProvider componentSize="small">
          {record.orderStatus !== 3 && record.orderStatus !== 4 ? (
            <Space size="small" className="action-icons">
              <Tooltip title="更新订单">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  size="small"
                  className="icon-button"
                  onClick={() => updateStatusFn(record)}
                />
              </Tooltip>
              <Tooltip title="删除订单">
                <Popconfirm
                  title="确认删除此订单吗?"
                  onConfirm={() => handleDeleteOrder(record)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    className="icon-button"
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="取消订单">
                <Popconfirm
                  title="确认取消此订单吗?"
                  onConfirm={() => orderCancel(record)}
                >
                  <Button
                    icon={<StopOutlined />}
                    size="small"
                    className="icon-button"
                  />
                </Popconfirm>
              </Tooltip>
            </Space>
          ) : (
            <div className="empty-actions">-</div>
          )}
        </ConfigProvider>
      ),
    },
  ];

  useEffect(() => {
    getUserInfo({ employeeId: userInfo.employeeId }).then((res) => {
      if (res.resCode === "0000") {
        setUserInfoList(
          res.body.map((item) => ({
            label: item.username,
            value: item.userId,
          }))
        );
      } else {
        messageApi.open({
          type: "error",
          content: res?.resMsg,
        });
      }
    });
    getEmployeeList({ employeeId: userInfo.employeeId }).then((res) => {
      if (res.resCode === "0000") {
        setEmployeeList(
          res.body.map((item) => ({
            label: item.username,
            value: item.userId,
          }))
        );
      } else {
        messageApi.open({
          type: "error",
          content: res?.resMsg,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (userInfo !== null) {
      fetchOrdersData();
    }
  }, [searchParams]);

  // 获取订单列表数据
  async function fetchOrdersData() {
    setIfTableDataDone(true);
    const response = await getQueryOrders({
      ...searchParams,
      employeeId: userInfo.employeeId,
    });
    setIfTableDataDone(false);
    if (response?.resCode === "0000") {
      setOrdersData(response.body);
    } else {
      console.log("获取订单数据失败", response?.resMsg);
    }
  }

  const [activeTabKey, setActiveTabKey] = useState("all"); // 用于存储当前选中的 Tab

  const handleTabChange = (key) => {
    setActiveTabKey(key);
    setSearchParams((prev) => ({
      ...prev,
      orderStatus: key === "all" ? undefined : Number(key),
    }));
  };

  // 查询按钮处理
  const handleSearch = (values) => {
    console.log("查询按钮处理", values);

    const { time, ...rest } = values;
    const [startTime, endTime] = values.time || [];
    const newParams = {
      ...rest,
      orderStatus: activeTabKey === "all" ? undefined : Number(activeTabKey),
    };

    if (time) {
      newParams.startTime = startTime.format("YYYY-MM-DDTHH:mm:ss");
      newParams.endTime = endTime.format("YYYY-MM-DDTHH:mm:ss");
    }

    setSearchParams(newParams);
  };

  // 删除订单
  const handleDeleteOrder = (record) => {
    // 调用删除订单的API
    deleteOrder({
      employeeId: userInfo.employeeId,
      orderId: record.orderId,
    }).then((response) => {
      if (response?.resCode === "0000") {
        messageApi.open({
          type: "success",
          content: "订单删除成功",
        });
        fetchOrdersData();
      } else {
        messageApi.open({
          type: "error",
          content: response.resMsg,
        });
      }
    });
  };

  // 更新订单状态
  const updateStatusFn = (record) => {
    let orderStatus = undefined;
    switch (Number(record.orderStatus)) {
      case 0:
        orderStatus = 1;
        break;
      case 1:
        orderStatus = 2;
        break;
      case 2:
        orderStatus = 3;
        break;
    }
    updateStatus({
      employeeId: userInfo.employeeId,
      orderId: record.orderId,
      orderStatus: orderStatus,
      language: "CN",
    }).then((response) => {
      if (response?.resCode === "0000") {
        messageApi.open({
          type: "success",
          content: "订单状态更新成功",
        });
        fetchOrdersData();
      } else {
        messageApi.open({
          type: "error",
          content: response.resMsg,
        });
      }
    });
  };

  // 取消订单
  const orderCancel = (record) => {
    updateStatus({
      employeeId: userInfo.employeeId,
      orderId: record.orderId,
      orderStatus: 4,
      language: "CN",
    }).then((response) => {
      if (response?.resCode === "0000") {
        messageApi.open({
          type: "success",
          content: "订单取消成功",
        });
        fetchOrdersData();
      } else {
        messageApi.open({
          type: "error",
          content: response.resMsg,
        });
      }
    });
  };

  // 添加重置按钮处理函数
  const handleReset = () => {
    form.resetFields();
    setSearchParams({});
    setActiveTabKey("all");
  };

  return (
    <div className="order-container">
      {/* 页面标题 */}
      <div className="page-header">
        <UnorderedListOutlined className="header-icon" />
        <span className="header-text">订单列表</span>
      </div>

      {/* 搜索表单 - 优化布局 */}
      <Card className="search-card">
        <div className="card-title">
          <SearchOutlined className="card-title-icon" />
          <Title level={5} className="card-title-text">
            搜索条件
          </Title>
        </div>
        <Form
          form={form}
          onFinish={handleSearch}
          className="search-form"
          labelAlign="right"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Row gutter={[24, 16]} className="form-row">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="订单号" name="orderId">
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="用户账户" name="username">
                <Select
                  options={userInfoList}
                  placeholder="请选择"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="销售员工" name="salesEmployeeId">
                <Select
                  options={employeeList}
                  placeholder="请选择"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="支付方式" name="paymentMethod">
                <Input placeholder="请输入支付方式" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="下单时间" name="time">
                <RangePicker showTime style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 16, offset: 8 },
                }}
              >
                <div className="button-group">
                  <Button className="reset-button" onClick={handleReset}>
                    重置
                  </Button>
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    htmlType="submit"
                    className="search-button"
                  >
                    查询
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 表格区域 - 优化样式 */}
      <Card className="table-card">
        <div className="tab-table-container">
          <Tabs
            activeKey={activeTabKey}
            onChange={handleTabChange}
            type="card"
            className="order-tabs"
          >
            <Tabs.TabPane tab="全部" key="all" />
            <Tabs.TabPane
              tab={
                <span className="tab-item">
                  <Badge status="error" />
                  待支付
                </span>
              }
              key="0"
            />
            <Tabs.TabPane
              tab={
                <span className="tab-item">
                  <Badge status="warning" />
                  已支付
                </span>
              }
              key="1"
            />
            <Tabs.TabPane
              tab={
                <span className="tab-item">
                  <Badge status="processing" />
                  已发货
                </span>
              }
              key="2"
            />
            <Tabs.TabPane
              tab={
                <span className="tab-item">
                  <Badge status="success" />
                  已完成
                </span>
              }
              key="3"
            />
            <Tabs.TabPane
              tab={
                <span className="tab-item">
                  <Badge status="default" />
                  已取消
                </span>
              }
              key="4"
            />
          </Tabs>

          {ifTableDataDone ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={ordersData}
              size="middle"
              rowKey={(record) => record.orderId}
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
        </div>
      </Card>
      {contextHolder}
    </div>
  );
};

export default OrderList;
