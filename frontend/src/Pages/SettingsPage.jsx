import React, { useState } from "react";
import { ArrowLeftIcon, LockKeyholeIcon } from "lucide-react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { setPassword } = useAuth();
  const [password, setPasswordValue] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) return;
    if (password !== confirmation) return;

    setSaving(true);
    const updated = await setPassword(password);
    setSaving(false);

    if (updated) {
      setPasswordValue("");
      setConfirmation("");
    }
  };

  const passwordsMatch = !confirmation || password === confirmation;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6 gap-2">
            <ArrowLeftIcon className="size-5" />
            Back to Applications
          </Link>

          <section className="card bg-base-100 shadow-sm border border-base-content/10">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <LockKeyholeIcon className="size-6 text-primary" />
                <h1 className="card-title text-2xl">Account Settings</h1>
              </div>
              <p className="text-sm text-base-content/70 mb-4">
                Set a password to also sign in with your email address.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label" htmlFor="new-password">
                    <span className="label-text font-medium">New password</span>
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    minLength={6}
                    required
                    value={password}
                    onChange={(event) => setPasswordValue(event.target.value)}
                    className="input input-bordered w-full"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="confirm-password">
                    <span className="label-text font-medium">Confirm password</span>
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    minLength={6}
                    required
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    className={`input input-bordered w-full ${!passwordsMatch ? "input-error" : ""}`}
                    placeholder="Repeat your password"
                  />
                  {!passwordsMatch && (
                    <span className="label-text-alt text-error mt-1">Passwords do not match.</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || password.length < 6 || password !== confirmation}
                  className="btn btn-primary"
                >
                  {saving ? "Saving..." : "Set Password"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
