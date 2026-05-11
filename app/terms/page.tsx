import InfoPageLayout from "@/components/layout/InfoPageLayout";

export default function TermsPage() {
  return (
    <InfoPageLayout 
      title="Terms of Service" 
      subtitle="The rules and guidelines for using PrepMate."
    >
      <div className="space-y-8">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By creating an account and using PrepMate, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2>2. Use of Service</h2>
          <p>You agree to use PrepMate only for lawful purposes related to interview preparation. You may not use the service to generate harmful content or attempt to bypass our AI safety filters.</p>
        </section>

        <section>
          <h2>3. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>The PrepMate platform, logo, and proprietary AI algorithms are the property of Nexa. Your answers and interview history belong to you.</p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>PrepMate is provided "as is." While we strive for accuracy, AI-generated feedback is for practice purposes only and does not guarantee job offers or specific career outcomes.</p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
