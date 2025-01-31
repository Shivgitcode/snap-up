import type * as React from "react";

export interface EmailTemplateProps {
  firstName: string;
  websiteUrl: string;
  errorDetails: string;
  estimatedResolutionTime: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  websiteUrl,
  errorDetails,
  estimatedResolutionTime,
}) => (
  <div
    style={{
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      lineHeight: "1.4",
      color: "#333333",
      backgroundColor: "#f4f7f9",
      padding: "40px 0",
    }}
  >
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          backgroundColor: "#4a5568",
          color: "#ffffff",
          padding: "30px",
          textAlign: "center" as const,
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Website Status Alert
        </h1>
      </div>

      <div style={{ padding: "30px" }}>
        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          Hello {firstName},
        </p>

        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          We've detected an issue with your website:
          <br />
          <strong style={{ color: "#4a5568", fontSize: "18px" }}>
            {websiteUrl}
          </strong>
        </p>

        <div
          style={{
            backgroundColor: "#fed7d7",
            borderLeft: "4px solid #f56565",
            borderRadius: "4px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              color: "#c53030",
              margin: "0 0 8px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Error Details:
          </h2>
          <p style={{ fontSize: "14px", margin: "0", color: "#2d3748" }}>
            {errorDetails}
          </p>
        </div>

        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          Our team is actively working on resolving this issue. We estimate it
          will be fixed by:
          <br />
          <strong style={{ color: "#4a5568", fontSize: "18px" }}>
            {estimatedResolutionTime}
          </strong>
        </p>

        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          We apologize for any inconvenience and appreciate your patience. If
          you need immediate assistance, please contact our support team.
        </p>

        <div
          style={{
            backgroundColor: "#e6fffa",
            borderRadius: "4px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "14px", margin: "0", color: "#234e52" }}>
            <strong>Need help?</strong> Reply to this email or call us at +1
            (888) 888-8888.
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #e2e8f0",
          padding: "20px 30px",
          fontSize: "14px",
          color: "#718096",
          textAlign: "center" as const,
        }}
      >
        <p style={{ margin: "0 0 8px" }}>Thank you for your understanding,</p>
        <p style={{ margin: "0", fontWeight: "bold" }}>
          Your Website Support Team
        </p>
      </div>
    </div>
  </div>
);
