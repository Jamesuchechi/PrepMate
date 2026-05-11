import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function PrivacyPage() {
  return (
    <InfoPageLayout 
      title="Privacy Policy" 
      subtitle="How we handle your data and protect your privacy."
    >
      <div className="space-y-8">
        <section>
          <h2>Introduction</h2>
          <p>At PrepMate, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        </section>

        <section>
          <h2>Data We Collect</h2>
          <ul>
            <li><strong>Account Data:</strong> Email address and authentication details provided via Supabase Auth.</li>
            <li><strong>Profile Data:</strong> Full name, target role, and experience level provided during onboarding.</li>
            <li><strong>Session Data:</strong> Interview questions, your answers, scores, and AI feedback.</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Data</h2>
          <p>We use your data primarily to provide the core coaching service: generating questions and evaluating your answers. We also use aggregated, anonymized data to improve our AI models and platform performance.</p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>We use industry-standard security measures, including Supabase's built-in encryption and Row Level Security, to ensure that your data is only accessible by you.</p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal data at any time. You can do this through your account dashboard or by contacting us.</p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
