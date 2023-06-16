import { useEffect, useState } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/Password is required!");
      return;
    }
    setLoadingAPI(true);
    const res = await loginApi(email, password);
    console.log("check res >>> :", res);
    if (res && res.token) {
      // success
      localStorage.setItem("token", res.token);
      toast.success("Login Success!");
      navigate("/");
    } else {
      // error
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingAPI(false);
  };
  return (
    <>
      <div className="login-container col-12 col-sm-4">
        <div className="title">Login</div>
        <div className="text">Email or username (eve.holt@reqres.in)</div>
        <input
          type="text"
          placeholder="Email or username..."
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="input-password">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <i
            className={
              isShowPassword
                ? "fa-solid fa-eye input-icon"
                : "fa-solid fa-eye-slash input-icon"
            }
            onClick={() => {
              setIsShowPassword(!isShowPassword);
            }}></i>
        </div>
        <button
          className={email && password ? "btn btn-primary" : ""}
          disabled={email && password ? false : true}
          onClick={() => handleLogin()}>
          {loadingAPI && <i className="fa-solid fa-sync fa-spin" />} Login
        </button>
        <div className="back">
          <i className="fa-solid fa-angles-left"></i>Go back
        </div>
      </div>
    </>
  );
};

export default Login;
