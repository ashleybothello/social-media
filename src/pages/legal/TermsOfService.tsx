import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto" style={{ color: "var(--text-primary)" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using AixMedia, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>2. Service Description</h2>
            <p>
              AixMedia is an AI-powered social media management tool that analyzes Instagram data to provide recommendations. We require access to your Instagram Business or Creator account to provide these services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>3. User Obligations</h2>
            <p>
              You agree to provide accurate information when registering and to maintain the security of your account credentials. You must have the legal right and authority to connect the Facebook Pages and Instagram accounts you authorize on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>4. Limitation of Liability</h2>
            <p>
              AixMedia provides analytics and AI-generated suggestions "as is". We do not guarantee specific growth metrics, engagement rates, or outcomes as a result of using our recommendations. We are not liable for any account actions taken by Meta Platforms, Inc.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after such modifications constitutes your acceptance of the revised terms.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
