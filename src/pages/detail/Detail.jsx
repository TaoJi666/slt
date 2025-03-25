import { useState, useMemo, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  message,
  Empty,
  Tooltip,
  Popconfirm,
  Table
} from "antd";
import {
  DeleteOutlined,
  EyeTwoTone,
  FilePdfOutlined,
} from "@ant-design/icons";
import PdfUrl from "../../assets/pdf/123.pdf";
import DataApi from "../../utils/DataApi";
import PdfUploadModal from "./upFileAndPDF";
import { useLocation } from "react-router-dom";
import ConstVar from "../../utils/SysConst";
import "./index.less";

const { Option } = Select;
const Detail = () => {
  const { apiUrl } = ConstVar;

  const location = useLocation();
  const modelId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("modelId");
  }, [location]);

  const [form] = Form.useForm();
  const [pdfUrl, setPdfUrl] = useState(PdfUrl);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];
  const initialTableData = Array.from({
    length: 10,
  }).map((_, i) => ({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  }));

  // eslint-disable-next-line no-unused-vars
  const [selectionType, setSelectionType] = useState("checkbox");
  // 表格中checkbox的行选中 函数以及数据
  const rowSelection = {
    // onChange: (selectedRowKeys, selectedRows) => {
    //   console.log(
    //     `selectedRowKeys: ${selectedRowKeys}`,
    //     "selectedRows: ",
    //     selectedRows
    //   );
    // },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
  const [open, setOpen] = useState(false);
  // 卡片数据
  // eslint-disable-next-line no-unused-vars
  const [dataSource, setDataSource] = useState([]);
  const handleSearch = async () => {
    try {
      const { fileType } = form.getFieldsValue();
      const params = {
        modelId: modelId,
        fileType: fileType || "",
        employeeId: userInfo?.employeeId,
      };
      const res = await DataApi.queryPDFList(params);
      if (res?.resCode === "0000") {
        setDataSource(res.body);
        setPdfUrl(res.body[0]?.filePath);
      }
    } catch (err) {
      message.error("查询失败");
      console.error(err);
    }
  };
  const deletePdf = async (record) => {
    const { modelId, fileType } = record;
    const params = {
      employeeId: userInfo?.employeeId,
      modelId: modelId,
      fileType: fileType,
    };
    try {
      const res = await DataApi.deletePDF(params);
      if (res?.resCode === "0000") {
        message.success("删除成功");
        handleSearch();
      }
    } catch (err) {
      console.log(err);
      message.success("删除失败");
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const getName = (x) => {
    return x
      .split("/")
      .pop()
      .replace(/\.\w+$/, "");
  };

  return (
    <div className="detail">
      <div className="header">
        <div className="headerLeft">
          <div className="headerContainer">
            <span className="headerTitle">PDF文件预览区</span>
            <Button size="small" type="default" onClick={() => setOpen(true)}>
              上传pdf
            </Button>
          </div>
          <Form
            form={form}
            layout="inline"
            className="form"
            onValuesChange={handleSearch}
          >
            <Form.Item name="fileType" label="筛选">
              <Select
                size="small"
                style={{ width: 150 }}
                placeholder="请选择(默认全部)"
                allowClear
              >
                <Option value="three_views">二维三视图</Option>
                <Option value="engineering_data">工程数据清单</Option>
                <Option value="explosion">爆炸图</Option>
                <Option value="compressor_flow">空压机流程图</Option>
              </Select>
            </Form.Item>
          </Form>
          <div className="cardContainer">
            {dataSource.length === 0 ? (
              <Empty
                description="暂无PDF文件"
                style={{
                  position: "absolute",
                  left: "45%",
                  top: "40%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ) : (
              dataSource.map((item, index) => (
                <div key={index} className="card">
                  <div
                    className="cardTitle"
                    onClick={() => window.open(`${apiUrl + item.filePath}`)}
                  >
                    <FilePdfOutlined style={{ color: "rgba(237,0,84,1)" }} />
                    &nbsp;
                    <Tooltip title={getName(item.filePath)}>
                      <span
                        style={{ textWrap: "break-word", fontSize: "14px" }}
                      >
                        {getName(item.filePath).length > 8
                          ? `${getName(item.filePath).slice(0, 8)}...`
                          : getName(item.filePath)}
                      </span>
                    </Tooltip>
                  </div>
                  <div className="cardAction">
                    <Tooltip title="查看">
                      <EyeTwoTone
                        key="view"
                        onClick={() => setPdfUrl(item.filePath)}
                      />
                    </Tooltip>
                    <Tooltip title="删除">
                      <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => deletePdf(item)}
                      >
                        <DeleteOutlined
                          style={{ marginLeft: "15px", color: "red" }}
                          key="delete"
                        />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {dataSource?.length > 0 ? (
          <div className="headerRight">
            <iframe
              src={`${apiUrl + pdfUrl}`}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ) : (
          <Empty
            description="暂无PDF文件"
            style={{
              position: "absolute",
              left: "63%",
              top: "30%",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      <div className="footer">
        {/* <span className="footerTitle">产品配件列表</span> */}
        <Table
          style={{ width: "100%", height: "95%" }}
          columns={columns}
          dataSource={initialTableData}
          size="small"
          // scroll={{ x: "max-content", y: '400px' }}
          rowSelection={{ type: selectionType, ...rowSelection }}
          pagination={false}
        />
      </div>
      <PdfUploadModal open={open} setOpen={setOpen} onChange={handleSearch} />
    </div>
  );
};

export default Detail;
