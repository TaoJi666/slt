import { useEffect, useState, useContext } from "react";
import {
  Avatar,
  Button,
  Layout,
  Radio,
  Space,
  Dropdown,
  message,
  Badge,
} from "antd";
import {
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ToolFilled,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCart from "../../pages/shoppingCart/ShoppingCart";
import { StoreContext } from "../../store";
import { getShoppingCart } from "./services";

const { Header } = Layout;

const TopHeader = (props) => {
  const [cartVisible, setCartVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { state, dispatch } = useContext(StoreContext); // 使用 useContext 获取全局状态
  const { colorBgContainer, collapsed, setCollapsed, i18n, t, setUserInfo } =
    props;
  const userInfo = JSON.parse(window.localStorage.getItem("userInfo")) || {};
  const navigate = useNavigate();
  let defaultValue =
    window.localStorage.getItem("i18nextLng") !== "zh-CN"
      ? window.localStorage.getItem("i18nextLng")
      : "zh";
  // 是否登录
  const [ifLogin, setIfLogin] = useState(false);

  // 头像下拉菜单
  const [items, setItems] = useState([
    {
      key: 1,
      label: userInfo?.username,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: 2,
      label: <div>{t("My Profile")}</div>,
      icon: <UserOutlined />,
    },
    {
      key: 3,
      label: "设置",
      icon: <SettingOutlined />,
    },
    {
      key: 5,
      label: (
        <div
          onClick={async () => {
            navigate("/changePassword");
          }}
        >
          修改密码
        </div>
      ),
      icon: <ToolFilled />,
    },
    {
      type: "divider",
    },
    {
      key: 4,
      label: (
        <div
          onClick={() => {
            onLogOut();
          }}
        >
          退出
        </div>
      ),
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]);

  useEffect(() => {
    if (userInfo !== null) {
      setIfLogin(true);
    } else {
      setIfLogin(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo !== null) {
      // 调用后端接口获取初始购物车数量
      fetchShoppingCartData();
    }
  }, []);

  // 获取购物车列表数据
  const fetchShoppingCartData = () => {
    getShoppingCart({ employeeId: userInfo.employeeId, language: "CN" }).then(
      (res) => {
        if (res.resCode === "0000") {
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

  const onLogOut = () => {
    window.localStorage.removeItem("userInfo");
    setUserInfo(null);
    navigate("/login");
  };

  return (
    <>
      {contextHolder}
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/*{t("home")}*/}
        {/*左侧展开折叠按钮*/}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "16px", width: 32, height: 32 }}
        />

        {/*右侧功能栏*/}
        <div style={{ marginRight: 40 }}>
          <Space size={"large"}>
            {/*搜索*/}
            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
            {/*购物车*/}
            <Badge count={state.cartCount}>
              <Button
                type="primary"
                shape="circle"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  setCartVisible(true);
                }}
              />
            </Badge>
            {/*中英文切换*/}
            <Radio.Group
              onChange={(evt) => {
                i18n.changeLanguage(evt.target.value);
                // window.localStorage.setItem("i18nextLng", evt.target.value)
              }}
              defaultValue={defaultValue}
              size="small"
              style={{ minWidth: "max-content" }}
            >
              <Radio.Button value="zh">ZH</Radio.Button>
              <Radio.Button value="en">EN</Radio.Button>
            </Radio.Group>
            {/*登录*/}
            {!ifLogin ? (
              <Link to={"/login"}>
                <Avatar size={32} icon={<UserOutlined />} />
              </Link>
            ) : (
              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                overlayStyle={{ paddingTop: 18 }}
                placement="bottom"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Avatar size={32} icon={<UserOutlined />} />
                </a>
              </Dropdown>
            )}
          </Space>
        </div>
      </Header>

      {cartVisible && (
        <ShoppingCart
          visible={cartVisible}
          onClose={() => setCartVisible(false)}
        />
      )}
    </>
  );
};

export default TopHeader;
