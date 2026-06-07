import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto" style={{ color: "var(--text-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>1. Information We Collect</h2>
            <p>
              When you use AixMedia and connect your Instagram account via Facebook Login, we request access to your Instagram profile data, media, and insights. This includes your username, follower counts, and engagement metrics. 
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>2. How We Use Your Information</h2>
            <p>
              We use the collected information solely to provide you with AI-driven analytics, content strategies, and profile optimization recommendations. We do not sell your personal information or your social media data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>3. Data Storage and Security</h2>
            <p>
              Your OAuth access tokens are securely encrypted before being stored in our database. We implement industry-standard security measures to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>4. Data Deletion Instructions</h2>
            <p>
              You have the right to request the deletion of your data at any time. You can disconnect your Instagram account directly from the AixMedia dashboard. If you wish to delete your entire account and all associated data, please contact us at support@aixmedia.com. Alternatively, you can remove our app's access directly from your Facebook Business Integrations settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: support@aixmedia.com.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
