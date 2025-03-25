import { useState, memo } from "react";
import { Button, Modal, Upload, message, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { uploadFile } from "../../../utils/DataApi";

const { Dragger } = Upload;
const { Option } = Select;

const PdfUploadModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { open, setOpen, onChange } = props;
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { search } = window.location;
  const [fileType, setFileType] = useState("");
  const modelId = new URLSearchParams(search).get("modelId");
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo"))
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;

  const handleSelect = (value) => {
    setFileType(value);
  };
  const handleUpload = async () => {
    try {
      setLoading(true);
      if (!fileList?.[0]?.originFileObj) {
        message.warning("文件对象不存在，请重新选择文件");
        return;
      }
      const formData = new FormData();
      formData.append("employeeId", userInfo?.employeeId || "");
      formData.append("modelId", modelId || "");
      formData.append("fileType", fileType || "");
      const fileObject = fileList[0].originFileObj;
      formData.append("file", fileObject, fileObject.name);
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      await uploadFile(formData);
      message.success("上传成功");
      onChange();
      setFileList([]);
      setFileType("");
      setOpen(false);
    } catch (err) {
      console.log(err);
      message.error("上传失败");
    } finally {
      setLoading(false);
    }
  };
  const props1 = {
    name: "file",
    multiple: false,
    action: undefined,
    maxCount: 1,
    beforeUpload: () => false,
    onChange(info) {
      setFileList(info.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Modal
      destroyOnClose
      title="PDF上传"
      open={open}
      onCancel={() => {
        setFileList([]);
        setFileType("");
        setOpen(false);
      }}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)}>
          取消
        </Button>,
        <Button
          key="upload"
          type="primary"
          loading={loading}
          onClick={handleUpload}
        >
          上传
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        文件类型：
        <Select
          style={{ width: 120 }}
          placeholder="请选择"
          onSelect={handleSelect}
          valeu={fileType}
          allowClear
        >
          <Option value="three_views">二维三视图</Option>
          <Option value="engineering_data">工程数据清单</Option>
          <Option value="explosion">爆炸图</Option>
          <Option value="compressor_flow">空压机流程图</Option>
        </Select>
      </div>
      <Dragger {...props1}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      </Dragger>
    </Modal>
  );
};
export default memo(PdfUploadModal);
