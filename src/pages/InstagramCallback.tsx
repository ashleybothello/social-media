import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Instagram, ChevronRight, Zap } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function InstagramCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError("Access was denied or cancelled. Please try again.");
      setLoading(false);
      return;
    }
    if (!code) {
      setError("No authorization code received from Facebook.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("aix_access_token") ?? "";
    fetch(`${API_BASE}/api/instagram/callback?code=${encodeURIComponent(code)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res: any) => {
        if (res.accounts?.length > 0) {
          setAccounts(res.accounts);
        } else {
          setError("No Instagram Professional accounts found linked to your Facebook Pages.");
        }
      })
      .catch((err) => setError(err.message || "Connection failed."))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSelectAccount = async (instagram_id: string) => {
    setSelecting(true);
    const token = localStorage.getItem("aix_access_token") ?? "";
    try {
      const res = await fetch(`${API_BASE}/api/instagram/select-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ instagram_id }),
      });
      if (!res.ok) throw new Error("Failed to link account");
      toast.success("Instagram connected successfully!");
      navigate("/instagram");
    } catch (err: any) {
      setError(err.message || "Failed to link account.");
      setSelecting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="glass-card p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
            <Zap size={14} color="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>AIXMedia</span>
        </div>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 size={36} className="mx-auto mb-4 animate-spin" style={{ color: "#7c6ef5" }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Authenticating…</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Fetching your linked Instagram accounts from Meta.
            </p>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <AlertCircle size={36} className="mx-auto mb-4" style={{ color: "var(--danger)" }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--danger)" }}>Connection Failed</h2>
            <div className="text-sm mb-4 p-3 rounded-lg text-left" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", color: "var(--text-secondary)" }}>
              {error}
            </div>
            <button onClick={() => navigate("/instagram/connect")} className="btn-ghost w-full justify-center">
              Try again
            </button>
          </motion.div>
        ) : selecting ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 size={36} className="mx-auto mb-4 animate-spin" style={{ color: "#7c6ef5" }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Linking Account…</h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Syncing your profile data.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(45deg, #f09433, #dc2743, #bc1888)" }}>
              <Instagram size={20} color="#fff" />
            </div>
            <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Select Account</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Found {accounts.length} Professional account{accounts.length !== 1 ? "s" : ""}. Select one to connect.
            </p>
            <div className="space-y-2 text-left">
              {accounts.map((acc) => (
                <motion.button
                  key={acc.instagram_id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectAccount(acc.instagram_id)}
                  className="w-full glass-card p-3 flex items-center justify-between"
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(45deg, #f09433, #bc1888)" }}>
                      <Instagram size={18} color="#fff" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{acc.page_name}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>ID: {acc.instagram_id}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
