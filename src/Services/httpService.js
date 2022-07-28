import axios from "axios";
import {
  toast
} from "react-toastify";
import {
  showLocalStorage,
  removeLocalStorage,
  addLocalStorage
} from "../Routers/localStorage"
import {
  UserApiUrl
} from "../config";



export function setToken() {
  var StorageToken = getTokenLocal();
  var bearer = "Bearer " + StorageToken;
  axios.defaults.headers.common["Authorization"] = bearer;
}

export function getTokenLocal() {
  const storageUser = showLocalStorage("user");
  return storageUser.AccessToken
}



axios.interceptors.response.use(c => {
    return {
      Data: c.data.data,
      Status: c.status,
      Error: null
    }
  },
  async (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (error.response.status === 401) {
      const storageUser = showLocalStorage("user");
      const refreshToken = await axios.get(UserApiUrl + "RegenerateToken/?regenerateToken=" + storageUser.RefreshToken);
      if (refreshToken.Data) {
        const adduser = {
          Id: storageUser.Id,
          FirstName: storageUser.FirstName,
          LastName: storageUser.LastName,
          userName: "",
          Gender: storageUser.Gender,
          CardNumber1: storageUser.CardNumber1,
          CardNumber2: storageUser.CardNumber2,
          LastLogin: storageUser.LastLogin,
          AccessToken: refreshToken.Data.accessToken,
          RefreshToken: refreshToken.Data.refreshToken,
        }
        removeLocalStorage('user')
        addLocalStorage(JSON.stringify(adduser), "user")
        window.location.reload()
        return;
      } else
        removeLocalStorage('user')
    } else if (error.response.status === 403) {
      removeLocalStorage('user')
      toast.warning("دسترسی نداری!");
      return;
    } else if (error.response.status === 423) {
      toast.warning("شما بلاک شده اید!");
      return;
    } else if (error.response.status === 451) {
      toast.warning("مبلغ پرداخت مجاز نیست!");
      return;
    } else if (error.response.status === 426) {
      removeLocalStorage('user');
      window.location.reload()
      return;
    }
    if (error.toString().includes("Network Error")) {
      toast.error("خطای ارتباط با سرور");
      return Promise.resolve({
        Data: null,
        Error: {
          Status: 598,
          Message: error
        },
        Status: 598

      });
    } else
      //خطاهای پیش بینی شده عموما در بازه‌ی 400 تا 500 قرار دارند.
      if (!expectedError) {
        //console.log("Error", error);
        toast.error("یک خطای غیر منتظره به وجود آمده است  لطفا با پشتیبانی تماس بگیرید.");
      }

    if (error?.response?.data?.error != null) {
      return Promise.resolve({
        Data: null,
        Error: {
          Status: error.response.data.error.status,
          Message: error.response.data.error.message
        },
        Status: error.response.status,
      });
    }

    return Promise.resolve({
      Data: null,
      Error: {
        Status: error.response.status,
        Message: error.response.data
      },
      Status: error.response.status,
    });

  });


export default {
  setToken,
  get: axios.get,
  post: axios.post,
  put: axios.put
};