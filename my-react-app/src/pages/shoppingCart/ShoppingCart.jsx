import { useState, useEffect } from "react";
import {
  Card,
  List,
  Typography,
  Image,
  Button,
  message,
  Tooltip,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Drawer,
  Space,
  Checkbox,
  Badge,
  Empty,
  Spin,
  Popconfirm,
} from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getShoppingCart,
  deleteShoppingCart,
  createOrder,
  getUserInfo,
} from "./services";
import "./ShoppingCart.css";
import image from "../../assets/image.png";

const { Text, Title } = Typography;

const ShoppingCart = (props) => {
  const { visible, onClose } = props;
  const [cart, setCart] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
  const { employeeId } = userInfo || {};

  const [userInfoList, setUserInfoList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchShoppingCartData();
      fetchUserInfo();
    }
  }, [visible]);

  const fetchUserInfo = () => {
    getUserInfo({ employeeId }).then((res) => {
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
  };

  // 获取购物车列表数据
  const fetchShoppingCartData = () => {
    setLoading(true);
    getShoppingCart({ employeeId, language: "CN" })
      .then((res) => {
        if (res.resCode === "0000") {
          if (!res.body) {
            setCart([]);
          } else if (Array.isArray(res.body)) {
            setCart(
              res.body.map((item) => ({
                ...item,
                image: image,
              }))
            );
          }
          setSelectedItems([]);
          setSelectAll(false);
        } else {
          messageApi.open({
            type: "error",
            content: res?.resMsg,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // 删除商品
  const removeItem = (item) => {
    const { productType, productId, quantity } = item;
    deleteShoppingCart({
      employeeId,
      language: "CN",
      productType,
      productId,
      quantity,
    }).then((res) => {
      if (res.resCode === "0000") {
        messageApi.open({
          type: "success",
          content: "删除成功",
        });
        fetchShoppingCartData();
      } else {
        messageApi.open({
          type: "error",
          content: res?.resMsg,
        });
      }
    });
  };

  // 批量删除商品
  const batchRemoveItems = () => {
    messageApi.open({
      type: "warning",
      content: "暂不支持批量清理",
    });
    return;
    // if (selectedItems.length === 0) {
    //   messageApi.open({
    //     type: "warning",
    //     content: "请先选择要删除的商品",
    //   });
    //   return;
    // }

    // Modal.confirm({
    //   title: "确认删除",
    //   content: `确定要删除选中的 ${selectedItems.length} 件商品吗？`,
    //   okText: "确认",
    //   cancelText: "取消",
    //   onOk: async () => {
    //     try {
    //       for (const itemId of selectedItems) {
    //         const item = cart.find(
    //           (cartItem) =>
    //             `${cartItem.productId}-${cartItem.productType}` === itemId
    //         );
    //         if (item) {
    //           await deleteShoppingCart({
    //             employeeId,
    //             language: "CN",
    //             productType: item.productType,
    //             productId: item.productId,
    //             quantity: item.quantity,
    //           });
    //         }
    //       }
    //       messageApi.open({
    //         type: "success",
    //         content: "批量删除成功",
    //       });
    //       fetchShoppingCartData();
    //     } catch (error) {
    //       messageApi.open({
    //         type: "error",
    //         content: "删除失败，请重试",
    //       });
    //     }
    //   },
    // });
  };

  // 提交订单
  const handleCreateOrder = async () => {
    form
      .validateFields()
      .then(async (values) => {
        const { deliveryDate, ...rest } = values;
        try {
          const response = await createOrder({
            ...rest,
            deliveryDate: deliveryDate.format("YYYY-MM-DDTHH:mm:ss"),
            employeeId,
            language: "CN",
          });
          if (response.resCode === "0000") {
            messageApi.open({
              type: "success",
              content: "订单生成成功",
            });
            form.resetFields();
            setOrderModalVisible(false);
            fetchShoppingCartData();
          } else {
            messageApi.open({
              type: "error",
              content: response.resMsg,
            });
          }
        } catch (error) {
          messageApi.open({
            type: "error",
            content: "生成订单时发生错误",
          });
        }
      })
      .catch(() => {
        message.error("请填写完整信息！");
      });
  };

  // 处理选择商品
  const handleSelectItem = (itemId) => {
    const newSelectedItems = [...selectedItems];
    const index = newSelectedItems.indexOf(itemId);

    if (index === -1) {
      newSelectedItems.push(itemId);
    } else {
      newSelectedItems.splice(index, 1);
    }

    setSelectedItems(newSelectedItems);
    setSelectAll(newSelectedItems.length === cart.length);
  };

  // 处理全选
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      setSelectedItems(
        cart.map((item) => `${item.productId}-${item.productType}`)
      );
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={
          <div className="cart-drawer-header">
            <Space>
              <ShoppingCartOutlined />
              <span>购物车</span>
              <Badge
                count={cart.length}
                style={{ backgroundColor: "#1890ff" }}
              />
            </Space>
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={520}
        footer={
          <div className="cart-drawer-footer">
            <Checkbox checked={selectAll} onChange={handleSelectAll}>
              全选
            </Checkbox>
            <Space>
              <Button
                danger
                onClick={batchRemoveItems}
                disabled={selectedItems.length === 0}
              >
                批量清理
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (cart.length === 0) {
                    messageApi.open({
                      type: "error",
                      content: "购物车为空，请先添加商品",
                    });
                    return;
                  }
                  setOrderModalVisible(true);
                }}
              >
                生成订单
              </Button>
            </Space>
          </div>
        }
        className="cart-drawer"
      >
        {loading ? (
          <div className="cart-loading">
            <Spin size="large" />
          </div>
        ) : cart.length === 0 ? (
          <Empty description="购物车是空的" />
        ) : (
          <List
            dataSource={cart}
            className="cart-list"
            renderItem={(item) => {
              const itemId = `${item.productId}-${item.productType}`;
              return (
                <List.Item className="cart-item">
                  <Card className="cart-item-card">
                    <div className="cart-item-content">
                      <Checkbox
                        checked={selectedItems.includes(itemId)}
                        onChange={() => handleSelectItem(itemId)}
                        className="cart-item-checkbox"
                      />
                      <div className="cart-item-image">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={80}
                          preview={false}
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-shop">{item.productId}</div>
                        <Tooltip title={item.productName}>
                          <Title level={5} ellipsis className="cart-item-name">
                            {item.productName}
                          </Title>
                        </Tooltip>
                        <Text type="secondary" className="cart-item-type">
                          {item.productType}
                        </Text>
                        <div className="cart-item-price-quantity">
                          <Text className="cart-item-quantity">
                            数量: {item.quantity}
                          </Text>
                        </div>
                      </div>
                      <Popconfirm
                        title="确定要删除该商品吗?"
                        onConfirm={() => removeItem(item)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="cart-item-delete"
                        />
                      </Popconfirm>
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </Drawer>

      {/* 生成订单的弹窗 */}
      <Modal
        title="生成订单"
        open={orderModalVisible}
        onCancel={() => {
          form.resetFields();
          setOrderModalVisible(false);
        }}
        cancelText="取消"
        onOk={handleCreateOrder}
        okText="确定"
        width={450}
      >
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Form.Item
            label="目标客户"
            name="userId"
            rules={[{ required: true, message: "请选择目标客户" }]}
          >
            <Select options={userInfoList} placeholder="请选择目标客户" />
          </Form.Item>

          <Form.Item
            label="订单号"
            name="orderId"
            rules={[{ required: true, message: "请输入订单号" }]}
          >
            <Input placeholder="请输入订单号" />
          </Form.Item>

          <Form.Item
            label="订单总金额"
            name="totalAmount"
            rules={[{ required: true, message: "请输入订单总金额" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入订单总金额"
            />
          </Form.Item>

          <Form.Item label="支付方式" name="paymentMethod">
            <Input placeholder="请输入支付方式" />
          </Form.Item>

          <Form.Item label="收货地址" name="shippingAddress">
            <Input placeholder="请输入收货地址" />
          </Form.Item>

          <Form.Item label="预计送达时间" name="deliveryDate">
            <DatePicker
              style={{ width: "100%" }}
              showTime
              placeholder="请选择预计送达时间"
            />
          </Form.Item>

          <Form.Item label="订单备注" name="remark">
            <Input.TextArea placeholder="请输入订单备注" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ShoppingCart;
