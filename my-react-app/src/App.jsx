import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ProductOutlined,
  OrderedListOutlined,
  UserOutlined,
  ToolOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import Router from "./routes/index.jsx";
import { useTranslation } from "react-i18next";
import TopHeader from "./component/topHeader/TopHeader.jsx";
import { StoreProvider } from "./store";

const { Sider, Content } = Layout;
import "./utils/i18n.js";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前路径
  const showNavBar = !["/login", "/detail"].includes(location.pathname); // 判断是否显示导航栏
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [userInfo, setUserInfo] = useState(
    window.localStorage.getItem("userInfo")
      ? JSON.parse(window.localStorage.getItem("userInfo"))
      : null
  );
  // const userInfo = window.localStorage.getItem("userInfo") ? JSON.parse(window.localStorage.getItem("userInfo")) : null

  // 中英文切换
  const { t, i18n } = useTranslation();

  // 侧边栏是否展开
  const [collapsed, setCollapsed] = useState(true);
  // 侧边栏数据
  const menuData = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: <Link to={"/home"}>首页</Link>,
    },
    {
      key: "products",
      icon: <ProductOutlined />,
      label: "产品",
      children: [
        {
          key: "/products",
          label: <Link to={"/products"}>喷油与螺杆压缩机</Link>,
        },
      ],
    },
    {
      icon: <ToolOutlined />,
      label: "配件",
      children: [
        {
          key: "1",
          label: <Link to={"/home"}>配件列表</Link>,
        },
      ],
    },
    {
      key: "order",
      icon: <OrderedListOutlined />,
      label: "订单",
      children: [
        {
          key: "/order",
          label: <Link to={"/order"}>订单列表</Link>,
        },
        {
          key: "2",
          label: <Link to={"/home"}>订单录入</Link>,
        },
        {
          key: "3",
          label: <Link to={"/home"}>待处理订单</Link>,
        },
      ],
    },
    {
      key: "user",
      icon: <UserOutlined />,
      label: "用户",
      children: [
        {
          key: "/user-clientList",
          label: <Link to={"/user-clientList"}>客户列表</Link>,
        },
        {
          key: "/user-employeeList",
          label: <Link to={"/user-employeeList"}>员工列表</Link>,
        },
      ],
    },
    {
      icon: <SettingOutlined />,
      label: "设置",
      children: [
        {
          key: "4",
          label: <Link to={"/home"}>账户信息</Link>,
        },
      ],
    },
  ];
  // 点击侧边栏事件
  const onClickMenu = (e) => {
    // 将侧边栏选择高亮的信息储存
    window.localStorage.setItem("keyPath", JSON.stringify(e.keyPath));
  };

  useEffect(() => {
    if (!userInfo || !userInfo?.employeeId) {
      navigate("/login");
    }
  }, [userInfo]);

  // 提取路径中的字段
  const extractFieldFromPath = (path) => {
    const match = path.match(/^\/([^/-]+)/);
    return match ? match[1] : null;
  };

  return (
    <StoreProvider>
      <Layout style={{ height: "100vh", overflow: "overlay" }}>
        {/*侧边栏*/}
        {showNavBar && (
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical"></div>
            <Menu
              theme="dark"
              mode="inline"
              key={userInfo}
              selectedKeys={[location.pathname]}
              defaultOpenKeys={[extractFieldFromPath(location.pathname)]}
              onClick={onClickMenu}
              items={menuData}
              style={{
                height: "calc(100vh - 64px)",
                overflow: "auto",
                position: "sticky",
                insetInlineStart: 0,
                top: 0,
                bottom: 0,
                scrollbarWidth: "thin",
                scrollbarGutter: "stable",
              }}
            />
          </Sider>
        )}
        {/*右侧内容*/}
        <Layout>
          {/*顶部栏*/}
          {showNavBar && (
            <TopHeader
              colorBgContainer={colorBgContainer}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              i18n={i18n}
              t={t}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
            />
          )}

          {/*路由*/}
          <Content
            style={{
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto",
            }}
          >
            <Router />
          </Content>
        </Layout>
      </Layout>
    </StoreProvider>
  );
}

export default App;
