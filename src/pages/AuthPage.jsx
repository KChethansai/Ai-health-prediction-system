import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/store/useAuth";
import { buttonClass, cardClass, errorClass, formGroup, inputClass, labelClass, pageWrapClass } from "@/styles/common";
import * as React from "react";
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();
  const onSubmit = async (v) => {
    try {
      if (isLogin) {
        await login(v.email, v.password);
        toast.success("Welcome back!");
      } else {
        await signup(v.email, v.password, v.fullName || "");
        toast.success("Account created!");
      }
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.response?.data?.error || e.message || "Authentication failed");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: `${pageWrapClass} flex items-center justify-center px-4` }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-md" }, /* @__PURE__ */ React.createElement(Link, { to: "/", className: "mb-8 flex items-center justify-center gap-2 font-display text-2xl font-bold" }, /* @__PURE__ */ React.createElement("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#0066cc]" }, /* @__PURE__ */ React.createElement(Heart, { className: "h-5 w-5 text-white" })), "MediPredict"), /* @__PURE__ */ React.createElement("div", { className: cardClass }, /* @__PURE__ */ React.createElement("h1", { className: "mb-6 text-center text-xl font-semibold" }, isLogin ? "Sign in to your account" : "Create your account"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4" }, !isLogin && /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass, htmlFor: "fullName" }, "Full Name"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "fullName",
      className: inputClass,
      placeholder: "John Doe",
      ...register("fullName", { required: !isLogin && "Please enter your name" })
    }
  ), errors.fullName && /* @__PURE__ */ React.createElement("p", { className: errorClass }, errors.fullName.message)), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass, htmlFor: "email" }, "Email"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "email",
      type: "email",
      className: inputClass,
      placeholder: "you@example.com",
      ...register("email", {
        required: "Email is required",
        pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" }
      })
    }
  ), errors.email && /* @__PURE__ */ React.createElement("p", { className: errorClass }, errors.email.message)), /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass, htmlFor: "password" }, "Password"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "password",
      type: "password",
      className: inputClass,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      ...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })
    }
  ), errors.password && /* @__PURE__ */ React.createElement("p", { className: errorClass }, errors.password.message)), !isLogin && /* @__PURE__ */ React.createElement("div", { className: formGroup }, /* @__PURE__ */ React.createElement("label", { className: labelClass, htmlFor: "confirmPassword" }, "Confirm Password"), /* @__PURE__ */ React.createElement(
    "input",
    {
      id: "confirmPassword",
      type: "password",
      className: inputClass,
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      ...register("confirmPassword", {
        validate: (v) => v === watch("password") || "Passwords do not match"
      })
    }
  ), errors.confirmPassword && /* @__PURE__ */ React.createElement("p", { className: errorClass }, errors.confirmPassword.message)), /* @__PURE__ */ React.createElement("button", { type: "submit", className: `${buttonClass} flex w-full items-center justify-center gap-2`, disabled: isSubmitting }, isSubmitting && /* @__PURE__ */ React.createElement(Loader2, { className: "h-4 w-4 animate-spin" }), isLogin ? "Sign In" : "Create Account")), /* @__PURE__ */ React.createElement("p", { className: "mt-6 text-center text-sm text-gray-500" }, isLogin ? "Don't have an account? " : "Already have an account? ", /* @__PURE__ */ React.createElement("button", { className: "font-medium text-[#0066cc] hover:underline", onClick: () => setIsLogin(!isLogin) }, isLogin ? "Sign Up" : "Sign In")))));
}
var AuthPage_default = AuthPage;
export {
  AuthPage_default as default
};
