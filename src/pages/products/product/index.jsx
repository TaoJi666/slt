import { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../../store";
import {
  Form,
  InputNumber,
  Space,
  Select,
  Row,
  Button,
  Table,
  Spin,
  Popconfirm,
  message,
  Tooltip,
  Card,
  Col,
} from "antd";
import {
  EditTwoTone,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import DataApi from "../../../utils/DataApi.js";
import AddProductModal from "./components/addProductModal/index.jsx";
import { addShoppingCart, getShoppingCart } from "../services";
import "./index.less";

const Products = () => {
  const { dispatch } = useContext(StoreContext); // 使用 useContext 获取 dispatch 函数
  // const { t } = useTranslation();
  const [form] = Form.useForm();
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
  // 过滤数据是否抵达
  const [ifFilterDataDone, setFfFilterDataDone] = useState(false);
  // 表格数据是否抵达
  const [ifTableDataDone, setIfTableDataDone] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  // 新增产品modal
  const [title, setTitle] = useState("新增产品");
  const [type, setType] = useState("");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // 过滤器中输入框的静态html数据结构
  const initialInputData = [
    {
      index: 0,
      label: "pressure",
      name: "压力(kg)",
      startNum: "pressureMin",
      endNum: "pressureMax",
      min: 3,
      max: 30,
    },
    {
      index: 1,
      label: "flow",
      name: "流量(单位)",
      startNum: "flowMin",
      endNum: "flowMax",
      min: 0,
      max: 10,
    },
    {
      index: 2,
      label: "power",
      name: "功率(KW)",
      startNum: "powerMin",
      endNum: "powerMax",
      min: 0,
      max: 500,
    },
  ];
  // 初始过滤器中多选框的静态html数据
  const [initialCheckboxData, setInitialCheckboxData] = useState([]);
  // 初始过滤器中输入框的静态html数据
  const initialFilterData = {
    connectionMethod: [],
    coolingMethod: [],
    fanType: [],
    flowMax: 10,
    flowMin: 0,
    hostBrand: [],
    hostLevel: [],
    language: "CN",
    powerMax: 500,
    powerMin: 0,
    pressureMin: 3,
    pressureMax: 30,
    productId: "KYJ_2024_0003",
    protectionLevel: [],
    voltageFrequency: [],
    voltagePhase: [],
    employeeId: userInfo?.employeeId,
  };

  // table中行的初始数据
  const [initialTableData, setInitialTableData] = useState([]);
  const [rowRecord, setRowRecord] = useState({});

  useEffect(() => {
    if (userInfo !== null) {
      fetchData();
    }
  }, []);
  const fetchData = async () => {
    const filterCheckboxData = await DataApi.getProductsFilterCheckboxData(
      "/api/prod/getFilters",
      "KYJ_2024_0003",
      "CN"
    );
    setInitialCheckboxData(filterCheckboxData?.body);
    setFfFilterDataDone(true);
    try {
      setTableLoading(true);
      const res = await DataApi.getProductsTableData(
        "/api/prod/getProdModel",
        initialFilterData
      );
      setInitialTableData(res?.body);
      setIfTableDataDone(true);
    } catch (err) {
      console.log(err);
    } finally {
      setTableLoading(false);
    }
  };

  // 过滤按钮功能
  const onFinish = async (values) => {
    const filterInfo = {};
    filterInfo.connectionMethod = values?.electricMachineryData;
    filterInfo.coolingMethod = values?.coolingMethodData;
    filterInfo.fanType = values?.fanTypeData;
    filterInfo.flowMax = values?.flowMax;
    filterInfo.flowMin = values?.flowMin;
    filterInfo.hostBrand = values?.hostBrandData;
    filterInfo.hostLevel = values?.hostData;
    filterInfo.language = "CN";
    filterInfo.powerMax = values?.powerMax;
    filterInfo.powerMin = values?.powerMin;
    filterInfo.pressureMin = values?.pressureMin;
    filterInfo.pressureMax = values?.pressureMax;
    filterInfo.productId = "KYJ_2024_0003";
    filterInfo.protectionLevel = values?.protectionLevelData;
    filterInfo.voltageFrequency = values?.voltageFrequencyData;
    filterInfo.voltagePhase = values?.voltagePhaseData;
    filterInfo.employeeId = userInfo?.employeeId;
    const tableData = await DataApi.getProductsTableData(
      "/api/prod/getProdModel",
      filterInfo
    );
    if (tableData?.resCode === "0000") setInitialTableData(tableData.body);
  };
  // 重置按钮功能
  const onReset = () => {
    // 重置过滤表单中的值
    form.resetFields();
    // 重置表中的checkbox
    // setSelectedRowKeys([]);
  };
  // 删除表中一条数据
  const onConfirmDeleteSingleData = async (record) => {
    const { productId, modelId } = record;
    const params = {
      productId: productId,
      modelId: modelId,
      employeeId: userInfo?.employeeId,
    };
    const res = await DataApi.deleteProdModel(params);
    if (res?.resCode === "0000") {
      message.success("删除成功");
      fetchData();
    } else {
      message.error("删除失败");
    }
  };
  // 修改表中一条数据
  const onModifySingleData = (record) => {
    setType("modify");
    setIsAddProductModalOpen(true);
    setRowRecord(record);
  };

  const [messageApi, contextHolder] = message.useMessage();

  // 添加购物车
  const addToCart = (record) => {
    addShoppingCart({
      employeeId: userInfo?.employeeId,
      productType: "MODEL",
      productId: record.modelId,
      quantity: 1,
    }).then((res) => {
      messageApi.open({
        type: "success",
        content: res.resMsg,
      });
      fetchShoppingCartData();
    });
  };

  // 获取购物车列表数据
  const fetchShoppingCartData = () => {
    getShoppingCart({ employeeId: userInfo.employeeId, language: "CN" }).then(
      (res) => {
        if (res.resCode === "0000") {
          // 更新购物车数量
          dispatch({
            type: "ADD_TO_CART",
            payload: res.body?.reduce((a, b) => {
              return a + b.quantity;
            }, 0),
          });
        } else {
          messageApi.open({
            type: "error",
            content: res?.resMsg,
          });
        }
      }
    );
  };

  // 表格中列的数据结构
  const columns = [
    {
      title: "产品型号",
      dataIndex: "modelId",
      width: 170,
      fixed: "left",
      align: "center",
      render: (text) => (
        <Link to={`/detail?modelId=${text}`} target="_blank">
          {text}
        </Link>
      ),
    },
    {
      title: "压力(Bar)",
      dataIndex: "pressure",
      width: 100,
      align: "center",
      sorter: (a, b) => a.pressure - b.pressure,
    },
    {
      title: "流量(m3/min)",
      dataIndex: "flow",
      width: 120,
      align: "center",
    },
    {
      title: "电压/频率(V/HZ)",
      dataIndex: "voltageFrequency",
      width: 150,
      align: "center",
    },
    {
      title: "相数(P)",
      dataIndex: "voltagePhase",
      width: 100,
      align: "center",
    },
    {
      title: "电机",
      dataIndex: "connectionMethod",
      width: 100,
      align: "center",
    },
    {
      title: "功率(kW)",
      dataIndex: "power",
      width: 100,
      align: "center",
      sorter: (a, b) => a.power - b.power,
    },
    {
      title: "防护等级",
      dataIndex: "protectionLevel",
      width: 100,
      align: "center",
    },
    {
      title: "主机",
      dataIndex: "hostLevel",
      width: 50,
      align: "center",
    },
    {
      title: "主机品牌",
      dataIndex: "hostBrand",
      width: 80,
      align: "center",
    },
    {
      title: "风机类型",
      dataIndex: "fanType",
      width: 100,
      align: "center",
    },
    {
      title: "整机冷却方式",
      dataIndex: "coolingMethod",
      width: 120,
      align: "center",
      // render: (text) => <Tag color={'geekblue'} key={text}>{text}</Tag>,
    },
    {
      title: "操作",
      dataIndex: "op",
      key: "op",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size={"middle"}>
          <a
            onClick={() => {
              onModifySingleData(record);
              setTitle("修改产品");
            }}
          >
            <Tooltip title="编辑">
              <EditTwoTone />
            </Tooltip>
          </a>
          <Popconfirm
            title="确认删除吗?"
            onConfirm={() => onConfirmDeleteSingleData(record)}
          >
            <Tooltip title="删除">
              <DeleteOutlined style={{ color: "red" }} key="delete" />
            </Tooltip>
          </Popconfirm>
          <a
            onClick={() => {
              addToCart(record);
            }}
          >
            <Tooltip title="添加购物车">
              <ShoppingCartOutlined />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div className="productContainer">
      <Card className="card1">
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={initialFilterData}
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 12 }}
        >
          <Row
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "nowrap",
            }}
          >
            {initialInputData?.map((item, key) => (
                <div
                  key={key}
                  style={{
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Form.Item
                    name={item.startNum}
                    style={{ marginBottom: 0 }}
                    label={item.name}
                    labelCol={{ style: { fontSize: '14px' } }}
                  >
                  <InputNumber
                      width={100}
                      rules={[{ required: true }]}
                      min={item.min}
                      max={item.max}
                    />
                  </Form.Item>
                  <span style={{ margin: "0 6px 0 6px" }}>to</span>
                  <Form.Item name={item.endNum} style={{ marginBottom: 0 }}>
                    <InputNumber
                      rules={[{ required: true }]}
                      min={item.min}
                      max={item.max}
                    />
                  </Form.Item>
                </div>
            ))}
            <Space size="small">
              <Button type="default" onClick={onReset}>
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                过滤
              </Button>
              <Button
                onClick={() => {
                  setIsAddProductModalOpen(true);
                  setType("add");
                  setTitle("新增产品");
                }}
                type="primary"
              >
                增加产品
              </Button>
            </Space>
          </Row>
          <Row gutter={[24, 16]} style={{ marginTop: 20 }}>
            {!ifFilterDataDone ? (
              <Spin />
            ) : (
              initialCheckboxData?.map((item, key) => (
                <Col xs={24} sm={12} md={8} lg={6} key={key}>
                  <Form.Item
                    name={item.name}
                    label={item.name}
                    style={{
                      marginBottom: 0,
                      marginRight: 10,
                    }}
                  >
                    <Select
                      mode="multiple"
                      maxTagCount={"responsive"}
                      allowClear
                      placeholder={`请选择${item.name}`}
                      options={item.children.map((childrenItem) => ({
                        value: `${childrenItem.value}`,
                        label: `${childrenItem.value}（${childrenItem.count}）`,
                      }))}
                    />
                  </Form.Item>
                </Col>
              ))
            )}
          </Row>
        </Form>
      </Card>
      <Card className="card2">
        <div style={{ padding: 10, flex: 1, overflow: "auto" }}>
          {!ifTableDataDone ? (
            <Spin
              size="large"
              style={{
                marginLeft: "calc(50% - 16px)",
                marginTop: "calc(18% - 16px)",
              }}
            />
          ) : (
            <Table
              loading={tableLoading}
              columns={columns}
              dataSource={initialTableData}
              size="middle"
              rowKey={(record) => record.modelId}
            />
          )}
        </div>
      </Card>
      <AddProductModal
        setIsAddProductModalOpen={setIsAddProductModalOpen}
        isAddProductModalOpen={isAddProductModalOpen}
        value={rowRecord}
        employeeId={userInfo?.employeeId}
        onChange={fetchData}
        type={type}
        title={title}
      />
      {contextHolder}
    </div>
  );
};

export default Products;
