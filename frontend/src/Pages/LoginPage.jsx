import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { BriefcaseIcon, Lock, Mail, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(formData);
    setLoading(false);
    if (success) navigate("/");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const success = await googleLogin(credentialResponse.credential);
      if (success) navigate("/");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed or was closed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-content/10">
        <div className="card-body p-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-4 text-center">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <BriefcaseIcon className="size-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
            <p className="text-sm text-base-content/70">
              Sign in to manage your job applications
            </p>
          </div>

          {/* Google Sign-in */}
          <div className="flex justify-center w-full my-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              shape="rectangular"
              size="large"
              width="100%"
            />
          </div>

          <div className="divider text-xs text-base-content/40 uppercase font-semibold my-3">
            Or continue with email
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-10 bg-base-200/50 text-sm focus:border-primary"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <Mail className="size-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-xs">Password</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10 bg-base-200/50 text-sm focus:border-primary"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <Lock className="size-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 font-semibold shadow-sm"
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-base-content/70 mt-5">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link link-primary font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;