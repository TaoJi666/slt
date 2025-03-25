import { useEffect, useState, memo } from "react";
import { Form, Input, InputNumber, Select, Modal, Flex } from "antd";
import DataApi from "../../../../../utils/DataApi";

const { Option } = Select;

const AddProductModal = (props) => {
   const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
     ? JSON.parse(window.localStorage.getItem("userInfo"))
     : null;
  const [form] = Form.useForm();
  const [optionsData, setOptionsData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [productIdInput, setProductIdInput] = useState("");
  const [language, setLanguage] = useState("CN");
  const [loading, setLoading] = useState(false);
  const fetchOptions = async () => {
    // if (!productIdInput || !language) return;
    try {
      setLoading(true);
      const res = await DataApi.getSelectParams({
        productId: productIdInput,
        language: language,
      });
      if (!res?.body?.productSeriesData) {
        throw new Error("无效的产品编码");
      }
      setOptionsData({
        productSeriesData: res.body.productSeriesData,
        connectionMethodData: res.body.connectionMethodData,
        styleCodeData: res.body.styleCodeData,
        hostCodeData: res.body.hostCodeData,
        drawingIdentificationData: res.body.drawingIdentificationData,
        protectionLevelData: res.body.protectionLevelData,
        hostLevelData: res.body.hostLevelData,
        fanTypeData: res.body.fanTypeData,
        coolingMethodData: res.body.coolingMethodData,
        configurationData: res.body.configurationData,
      });
    } catch (err) {
      console.error("Failed to load options:", err);
      Modal.error({
        title: "参数加载失败",
        content: err.message || "请检查产品编码后重试",
      });
      setOptionsData({});
    }
  };

  const {
    // eslint-disable-next-line react/prop-types
    setIsAddProductModalOpen,
    // eslint-disable-next-line react/prop-types
    isAddProductModalOpen,
    // eslint-disable-next-line react/prop-types
    value = {},
    // eslint-disable-next-line react/prop-types
    employeeId,
    // eslint-disable-next-line react/prop-types
    onChange,
    // eslint-disable-next-line react/prop-types
    type,
    // eslint-disable-next-line react/prop-types
    title,
  } = props;
  
  const { modelId, productId } = value;
  const fetchModelData = async (modelId, productId, employeeId) => {
    try {
      if (type === "modify") {
        const params = {
          productId,
          employeeId,
          modelId,
          language: "CN",
        };
        const res = await DataApi.getProdModelById(params);
        form.setFieldsValue({ ...res.body });
        setLoading(true);
      }
    } catch (err) {
      console.error("获取型号数据失败:", err);
    }
  };

  useEffect(() => {
    form.setFieldValue('employeeId',userInfo.employeeId)
    if (modelId && productId && employeeId && isAddProductModalOpen === true) {
      setProductIdInput(productId);
      fetchModelData(modelId, productId, employeeId);
    }
  }, [modelId, productId, employeeId,isAddProductModalOpen]);

  const handleFinish = async (values) => {
    try {
      setSubmitting(true);
      if (type === "add") {
        await DataApi.insertProdModel({
          ...values,
        });
      } else if (type === "modify") {
        await DataApi.updateProdModel({
          ...values,
        });
      }
      form.resetFields();
      setIsAddProductModalOpen(false);
      onChange();
    } catch (err) {
      console.error("提交失败:", err);
      Modal.error({
        title: "提交失败",
        content: err.message || "请检查表单数据后重试",
      });
    } finally {
      setSubmitting(false);
      form.resetFields();
    }
  };
  // 获取下拉框选项数据
  useEffect(() => {
    if (productIdInput && language) fetchOptions();
  }, [productIdInput, language]);

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      width={1000}
      open={isAddProductModalOpen}
      onCancel={() => {
        setIsAddProductModalOpen(false), form.resetFields();
      }}
      onOk={() => form.submit()}
      okButtonProps={{ loading: submitting }}
      cancelButtonProps={{ disabled: submitting }}
    >
      <Form
        {...formItemLayout}
        form={form}
        scrollToFirstError
        onFinish={handleFinish}
      >
        <Flex gap="middle" wrap>
          {/* 1-7 */}
          <div style={{ width: "30%" }}>
            <Form.Item
              name="employeeId"
              label="员工ID"
              rules={[{ required: true }]}
            >
              <Input
                disabled={type === "modify"}
                placeholder="请输入员工ID"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="productId"
              label="产品编码"
              rules={[{ required: true }]}
            >
              <Input
                disabled={type === "modify"}
                allowClear
                placeholder="请输入产品编码"
                onBlur={(e) => setProductIdInput(e.target?.value)}
                onPressEnter={(e) => setProductIdInput(e.target?.value)}
              />
            </Form.Item>
            <Form.Item
              name="modelId"
              label="型号代码"
              rules={[{ required: true }]}
            >
              <Input
                disabled={type === "modify"}
                placeholder="请输入型号代码"
                allowClear
              ></Input>
            </Form.Item>
            <Form.Item
              name="language"
              label="语言"
              rules={[{ required: true }]}
              initialValue="CN"
            >
              <Select
                disabled={type === "modify"}
                allowClear
                options={[
                  { value: "CN", label: "中文" },
                  { value: "EN", label: "英文" },
                ]}
                onChange={(value) => setLanguage(value)}
              />
            </Form.Item>
            <Form.Item
              name="modelCnName"
              label="型号中文名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="型号中文名称" allowClear />
            </Form.Item>
            <Form.Item
              name="modelEnName"
              label="型号英文名称"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入型号英文名称" allowClear />
            </Form.Item>
            <Form.Item
              name="productSeries"
              label="产品系列"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.productSeriesData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          {/* 8-14 */}
          <div style={{ width: "30%" }}>
            <Form.Item
              name="brandType"
              label="品牌类型"
              rules={[{ required: true }]}
              initialvalues={"SLT"}
            >
              <Input placeholder="请输入品牌类型" allowClear></Input>
            </Form.Item>
            <Form.Item
              name="powerMin"
              label="最小功率"
              rules={[{ required: true }, { type: "number", min: 0 }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="powerMax"
              label="最大功率"
              rules={[
                { required: true },
                { type: "number", min: 0 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("powerMin") <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("最大功率不能小于最小功率");
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              label="连接方式"
              name="connectionMethod"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.connectionMethodData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="styleCode"
              label="款式编码"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.styleCodeData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="hostCode"
              label="主机编码"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.hostCodeData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="serialNumber" label="流水码">
              <Input placeholder="请输入流水码" allowClear></Input>
            </Form.Item>
          </div>
          {/* 15-21 */}
          <div style={{ width: "30%" }}>
            <Form.Item name="drawingNumber" label="图号">
              <Input placeholder="请输入图号"></Input>
            </Form.Item>
            <Form.Item
              name="drawingIdentification"
              label="图纸标识"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.drawingIdentificationData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="pressureMin"
              label="最小压力(kg)"
              rules={[{ type: "number", min: 0 }, { required: true }]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              name="pressureMax"
              label="最大压力(kg)"
              rules={[
                { required: true },
                { type: "number", min: 0 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("pressureMin") <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("最大压力不能小于最小压力");
                  },
                }),
              ]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              name="flow"
              label="流量"
              rules={[{ type: "number", min: 0 }, { required: true }]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              name="voltagePhase"
              label="电压相数"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入电压相数" allowClear></Input>
            </Form.Item>
            <Form.Item
              name="voltage"
              label="电压(V)"
              rules={[
                { type: "number", required: true },
                { pattern: /^[1-9]\d*$/, message: "必须为正整数" },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} allowClear />
            </Form.Item>
          </div>
          {/* 22-28 */}
          <div style={{ width: "30%" }}>
            <Form.Item
              name="frequency"
              label="频率"
              rules={[{ type: "number", min: 0 }, { required: true }]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              name="protectionLevel"
              label="防护等级"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.protectionLevelData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="hostLevel"
              label="主机级数"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.hostLevelData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="fanType"
              label="风机类型"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.fanTypeData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="coolingMethod"
              label="整机冷却方式"
              rules={[{ required: true }]}
            >
              <Select disabled={!loading} allowClear>
                {optionsData?.coolingMethodData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="规格型号" name="specification">
              <Input placeholder="请输入规格型号" allowClear />
            </Form.Item>
            <Form.Item name="productNote" label="产品备注">
              <Input.TextArea placeholder="请输入产品备注" allowClear />
            </Form.Item>
          </div>
          {/* 29-35 */}
          <div style={{ width: "30%" }}>
            <Form.Item name="configuration" label="配置" rules={[{ required: true }]}>
              <Select disabled={!loading} allowClear>
                {optionsData?.configurationData?.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="electricalAccessory" label="电气配件">
              <Input placeholder="请输入电气配件" allowClear></Input>
            </Form.Item>
            <Form.Item name="productImagePath" label="产品图片路径">
              <Input placeholder="请输入产品图片路径" allowClear></Input>
            </Form.Item>
            <Form.Item name="size" label="尺寸">
              <Input placeholder="请输入尺寸" allowClear></Input>
            </Form.Item>
            <Form.Item name="electricalBoardCode" label="电盘接线板编码">
              <Input placeholder="电盘接线板编码" allowClear></Input>
            </Form.Item>
            <Form.Item name="airVolume" label="气量">
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item
              name="costPrice"
              label="成本价(元)"
              rules={[{ type: "number", min: 0 }, { required: true }]}
            >
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
          </div>
          {/* 36-39 */}
          <div style={{ width: "30%" }}>
            <Form.Item name="guidePrice" label="指导价(元)">
              <InputNumber style={{ width: "100%" }} allowClear />
            </Form.Item>
            <Form.Item name="sheetMetalType" label="钣金类型">
              <Input placeholder="请输入钣金类型" allowClear />
            </Form.Item>
            <Form.Item name="sheetMetalCode" label="钣金编码">
              <Input placeholder="请输入钣金编码" allowClear />
            </Form.Item>
            <Form.Item name="sheetMetalNameCn" label="钣金中文名称">
              <Input placeholder="请输入钣金中文名称" allowClear />
            </Form.Item>
            <Form.Item name="sheetMetalNameEn" label="钣金英文名称">
              <Input placeholder="请输入钣金英文名称" allowClear />
            </Form.Item>
          </div>
        </Flex>
      </Form>
    </Modal>
  );
};
export default memo(AddProductModal);
