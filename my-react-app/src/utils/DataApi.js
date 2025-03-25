import ConstVar from "./SysConst";
import axios from "axios";

const DataApi = {
  getProductsFilterCheckboxData,
  getProductsTableData,
  getLogin,
  getEmployeeRegister,
  getClientRegister,
  getUserInfo,
  getEmployeeList,
  insertProdModel,
  getSelectParams,
  updateProdModel,
  deleteProdModel,
  queryPDFList,
  uploadFile,
  deletePDF,
  getProdModelById
  // getChangePassword,
};

// async function getChangePassword() {
//     try {

//     } catch (err) {
//         console.log(err, "err")
//     }
// }

// 获取员工信息列表
async function getEmployeeList(path, employeeId) {
  try {
    return await Fetch(path, { employeeId });
  } catch (err) {
    console.log(err, "err");
  }
}

// 获取客户信息列表
async function getUserInfo(path, employeeId) {
  try {
    return await Fetch(path, { employeeId });
  } catch (err) {
    console.log(err, "err");
  }
}

// 客户注册
async function getClientRegister(path, clientInfo) {
  try {
    return await Fetch(path, clientInfo);
  } catch (err) {
    console.log(err, "err");
  }
}

// 员工注册
async function getEmployeeRegister(path, employeeInfo) {
  try {
    return await Fetch(path, employeeInfo);
  } catch (err) {
    console.log(err, "err");
  }
}

// 登录
async function getLogin(path, username, password) {
  try {
    return await Fetch(path, { username, password });
  } catch (err) {
    console.log(err, "err");
  }
}

/**
 * 获取产品筛选条件数据
 * @param {*} path
 * @param {*} productId
 * @param {*} language
 * @manager {*} jitao
 */
async function getProductsFilterCheckboxData(path, productId, language) {
  try {
    return await Fetch(path, { productId, language });
    // const data = await Fetch(path, {productId, language})
    // return data.message
  } catch (err) {
    console.log(err, "err");
  }
}

async function getProductsTableData(path, filters) {
  try {
    return await Fetch(path, filters);
  } catch (err) {
    console.log(err, "err");
  }
}

// 新增产品接口
async function insertProdModel(params) {
  try {
    return await Fetch("/api/prod/insertProdModel", params);
  } catch (err) {
    console.log(err, "err");
  }
}

// 新增产品获取下拉框参数接口
async function getSelectParams(params) {
  try {
    const res = await Fetch("/api/prod/getSelectParams", params);
    // 数据格式转换
    const formatData = (data) => Array.isArray(data) ? data : [data];
    return {
      ...res,
      body: {
        productSeriesData: formatData(res.body.productSeriesData),
        connectionMethodData: formatData(res.body.connectionMethodData),
        styleCodeData: formatData(res.body.styleCodeData),
        hostCodeData: formatData(res.body.hostCodeData),
        drawingIdentificationData: formatData(res.body.drawingIdentificationData),
        protectionLevelData: formatData(res.body.protectionLevelData),
        hostLevelData: formatData(res.body.hostLevelData),
        fanTypeData: formatData(res.body.fanTypeData),
        coolingMethodData: formatData(res.body.coolingMethodData),
        configurationData: formatData(res.body.configurationData)
      }
    };
  } catch (err) {
    console.log(err, "err");
    return { body: {} }; // 返回空对象防止解构错误
  }
}

//  修改产品信息接口  /api/prod/updateProdModel
async function updateProdModel(params) {
  try {
    return await Fetch("/api/prod/updateProdModel", params);
  }catch(err){
    console.log(err, "err");
  } 
}

// 删除产品接口
async function deleteProdModel(params) {
  try {
    return await Fetch("/api/prod/deleteProdModel", params);
  }catch(err){
    console.log(err, "err");
  }
}

//getProdModelById
async function getProdModelById(params) {
  try {
    return await Fetch("/api/prod/getProdModelById", params);
  }catch(err){
    console.log(err, "err");
  }

}

//查询指定产品型号的PDF文件接口/api/prod/queryPDFList
async function queryPDFList(params) {
  try {
    return await Fetch("/api/prod/queryPDFList", params);
  }catch(err){
    console.log(err, "err");
  }
}

// // 上传PDF文件接口/api/prod/uploadPDF
// async function uploadPDF(params) {
//   // headers: {
//   //   "Content-Type": "multipart/form-data",
//   // }
//   // try {
//   //   return await Fetch("/api/prod/uploadPDF", params);
//   // }catch(err){
//   //   console.log(err, "err");
//   // }
// }

// 删除PDF文件接口
async function deletePDF(params) {
  try {
    return await Fetch("/api/prod/deletePDF", params);
  }catch(err){
    console.log(err, "err");
  }
}

function Fetch(path, props) {
  return fetch(`${ConstVar.apiUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ...props }),
  }).then((res) => res.json());
  // .then(data => data.message)
}

export async function uploadFile(params) {
  return axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `http://175.24.81.16:8090/api/prod/uploadPDF`,
    method: 'post',
    data: params,
    errorTitle: '上传文件'
  });
}

export default DataApi;
