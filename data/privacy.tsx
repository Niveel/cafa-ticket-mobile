import { APP_EMAIL, APP_NUMBER } from "@/data/constants";

export interface PrivacyHighlight {
  id: number;
  icon: "lock-closed-outline" | "eye-outline" | "shield-checkmark-outline" | "document-text-outline";
  title: string;
  description: string;
}

export interface PrivacyPolicySection {
  id: number;
  title: string;
  content: string[];
}

export const privacyLastUpdated = "December 19, 2025";

export const privacyHighlights: PrivacyHighlight[] = [
  {
    id: 1,
    icon: "lock-closed-outline",
    title: "Secure by Design",
    description: "Your data is encrypted in transit and at rest.",
  },
  {
    id: 2,
    icon: "eye-outline",
    title: "Transparent",
    description: "We tell you exactly what we collect and why.",
  },
  {
    id: 3,
    icon: "shield-checkmark-outline",
    title: "Your Control",
    description: "Access, correct, or delete your data at any time.",
  },
  {
    id: 4,
    icon: "document-text-outline",
    title: "No Data Selling",
    description: "We never sell your personal data to third parties.",
  },
];

export const privacyPolicySections: PrivacyPolicySection[] = [
  {
    id: 1,
    title: "Who We Are",
    content: [
      "Welcome to Cafa Tickets. We are an event ticketing and management platform that enables people to discover, create, and attend live events. Through our mobile application and website (cafatickets.com), we connect Event Organizers with Consumers and provide tools for seamless event creation, ticket sales, check-in management, and organizer payouts.",
      "This Privacy Policy explains how Cafa Tickets collects, uses, stores, shares, and protects your personal information when you use our platform. It applies to all users of the Cafa Tickets app and website, whether you are an Organizer creating and managing events or a Consumer purchasing tickets and attending events.",
      "When this Privacy Policy uses the term \"Organizer,\" we mean users who create events and sell tickets through the Platform. \"Consumer\" means users who purchase tickets and attend events. \"User,\" \"you,\" or \"your\" refers to all users of the Platform collectively.",
      `If you have any questions or concerns about this Privacy Policy or our data practices at any time, please contact us at ${APP_EMAIL}.`,
    ],
  },
  {
    id: 2,
    title: "Our Privacy Commitment",
    content: [
      "We take the privacy of your personal information seriously. Cafa Tickets is not in the business of selling your personal data. We consider your personal information to be a vital part of our relationship with you, and we will never sell your data to third-party advertisers or data brokers.",
      "We collect only the information we genuinely need to provide you with a high-quality ticketing and event management experience. We are committed to being transparent about what we collect, how we use it, and who we share it with.",
      "By accessing or using the Cafa Tickets Platform, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein. If you do not agree with this Privacy Policy, you must stop using the Platform.",
    ],
  },
  {
    id: 3,
    title: "Personal Data We Collect",
    content: [
      "We collect personal data through several means depending on how you interact with the Platform. \"Personal Data\" means any information that can identify you directly or indirectly as an individual.",
      "Information You Provide Directly: When you create an account, purchase tickets, create an event, or contact us, you voluntarily provide personal data. This may include your full name, email address, phone number, username, password, profile picture, city, country, and any other details you choose to add to your profile.",
      "Account and Authentication Data: When you register, we collect your username, encrypted password, and authentication tokens necessary to keep your account secure and your session active.",
      "Payment Information (Consumers): When you purchase a ticket to a paid event, you will provide payment information such as your card number, expiry date, and billing address to our secure third-party payment processor. Cafa Tickets does not store your complete card details on our servers.",
      "Payment and Banking Information (Organizers): When you set up a payment profile to receive payouts, we collect your bank account details including account number, bank name, and bank code. This information is necessary to disburse your earnings from ticket sales to your account. We may also collect information required for identity verification and tax compliance, including a government-issued ID and a selfie photograph.",
      "Event Data: When you create an event as an Organizer, we collect all event details you provide, including event title, description, date, time, venue, ticket types, prices, and images. When you purchase a ticket as a Consumer, we collect your attendance information, ticket details, and check-in history.",
      "Automatic Data: We automatically collect certain technical data when you use the Platform, including your device type and operating system, app version, IP address, unique device identifiers, in-app behavior (screens visited, features used, time spent), and crash reports. This data helps us maintain, improve, and secure the Platform.",
      "Location Data: With your permission, we may collect approximate location data to help surface relevant nearby events and improve recommendations.",
      "Communications Data: If you contact our support team or send us feedback, we will collect the content of your messages and your contact details in order to respond to you.",
    ],
  },
  {
    id: 4,
    title: "How We Use Your Personal Data",
    content: [
      "We use the personal data we collect in ways that are consistent with this Privacy Policy and applicable law. The specific purposes for which we use your data include:",
      "Service Delivery: To process ticket purchases, issue digital tickets with QR codes, manage event registrations, facilitate event check-ins, send confirmation emails and notifications, and provide all core features of the Platform.",
      "Organizer Payouts: To credit ticket sale proceeds to your Organizer Wallet (net of the 5% Platform Fee), process withdrawal requests to your registered bank account, verify your identity before disbursing funds, and maintain accurate financial records of all transactions.",
      "Account Management: To create and manage your account, authenticate your identity when you log in, and provide customer support when you need it.",
      "Event Management: To enable Organizers to create and manage events, track ticket sales, view attendee lists, manage check-ins, and access revenue analytics through the organizer dashboard.",
      "Platform Improvement: To analyze how users interact with the Platform, identify areas for improvement, diagnose technical issues, and develop new features.",
      "Communications: To send you transactional messages you need to use the Platform (such as ticket confirmations, payout notifications, and account alerts), as well as marketing communications about events or Platform features that may interest you, where you have consented to receive such communications.",
      "Personalization: To personalize your experience, recommend events that may be relevant to your interests based on your location, past purchases, and browsing behavior.",
      "Security and Fraud Prevention: To detect, investigate, and prevent fraudulent activity, unauthorized access, and other misuse of the Platform. To protect the safety and integrity of the Platform and its users.",
      "Legal Compliance: To comply with applicable laws, respond to lawful requests from authorities, enforce our Terms of Service, and resolve disputes.",
    ],
  },
  {
    id: 5,
    title: "How We Share Your Personal Data",
    content: [
      "We do not sell your personal data. We share your personal data only in the limited circumstances described below:",
      "With Event Organizers: When you purchase a ticket to an event as a Consumer, Cafa Tickets shares your name, email address, and attendance information with the Organizer of that event. This sharing is necessary to enable the Organizer to manage their event, communicate with their attendees, and verify tickets at the door. Organizers are required by our Terms of Service to handle your information responsibly and in compliance with applicable data protection laws. However, Cafa Tickets is not responsible for how Organizers use your personal data after it has been shared with them.",
      "With Consumers (by Organizers): If you are an Organizer, your publicly displayed event details (event name, venue, date, time, ticket prices) are visible to all users of the Platform. Your profile name may also be visible in connection with events you create.",
      "With Service Providers: We work with trusted third-party service providers who process personal data on our behalf to help us deliver the Platform. These include payment processors (who handle card transactions securely), cloud hosting providers (who store our data), analytics providers (who help us understand Platform usage), customer support tools, and push notification services. These providers are bound by confidentiality obligations and may only use your data for the specific purposes for which we have engaged them.",
      "Business Transfers: In the event of a merger, acquisition, asset sale, or reorganization involving Cafa Tickets, your personal data may be transferred to the successor entity. We will notify you of any such transfer and ensure your data continues to be protected in accordance with this Privacy Policy.",
      "Legal Requirements: We may disclose your personal data when we are legally required to do so — for example, in response to a valid subpoena, court order, or request from a government authority — or when we reasonably believe disclosure is necessary to protect our rights, the safety of our users, or the public.",
      "With Your Consent: We may share your personal data with third parties in other circumstances if you have given us your explicit consent to do so.",
    ],
  },
  {
    id: 6,
    title: "Organizers and Consumer Data",
    content: [
      "Cafa Tickets acts as an intermediary between Organizers and Consumers. When a Consumer purchases a ticket to an Organizer's event, Cafa Tickets provides the Organizer with the Consumer's registration information (name, email address, and ticket details). This is necessary for the Organizer to manage their event effectively.",
      "Organizers may use the attendee information they receive through the Platform only for the purpose of managing their event and communicating directly with their attendees about that event. Organizers must not use this data for unrelated marketing purposes, share it with third parties not involved in the event, or retain it beyond what is necessary to manage the event, without the explicit consent of each attendee.",
      "Cafa Tickets is not responsible for how Organizers handle personal data they receive through the Platform. If you have concerns about how an Organizer is using your personal data, please contact the Organizer directly or reach out to us at support@cafatickets.com.",
    ],
  },
  {
    id: 7,
    title: "Identity Verification",
    content: [
      "To protect the security of Organizer payouts and comply with applicable financial regulations, Cafa Tickets may require Organizers to complete an identity verification process before withdrawing funds from their Organizer Wallet.",
      "This verification process may require you to upload a clear photograph of a valid government-issued identification document (such as a national ID card, passport, or driver's license) and a selfie photograph to confirm your identity. We use this information solely for the purpose of verifying your identity and preventing fraudulent withdrawals.",
      "Identity verification documents and selfies are processed securely and are not used for any purpose other than identity verification. We retain this information only for as long as necessary to fulfil our legal and compliance obligations.",
    ],
  },
  {
    id: 8,
    title: "Data Security",
    content: [
      "We implement industry-standard technical and organizational security measures designed to protect your personal data against unauthorized access, disclosure, alteration, and destruction. These measures include:",
      "Encryption: All personal data transmitted between your device and our servers is encrypted using SSL/TLS protocols. Sensitive data stored at rest — including passwords, auth tokens, and financial information — is encrypted using strong encryption algorithms.",
      "Secure Credential Storage: Your authentication tokens are stored securely on your device using Expo Secure Store, which leverages your device's native secure storage mechanisms (Keychain on iOS, Keystore on Android). Passwords are hashed and are never stored in plain text.",
      "Access Controls: Access to personal data within Cafa Tickets is restricted to authorized team members who need access to perform their job functions. All access is logged and monitored.",
      "Payment Security: We do not store complete card details on our systems. All payment card transactions are handled by our PCI-DSS compliant third-party payment processing partners.",
      "Despite these measures, no data transmission over the internet or electronic storage system is 100% secure. While we take every reasonable precaution to protect your information, we cannot guarantee absolute security. You should use strong, unique passwords and exercise caution about the information you share.",
    ],
  },
  {
    id: 9,
    title: "Your Rights and Choices",
    content: [
      "You have meaningful rights over your personal data. Specifically, you have the right to:",
      "Access: Request a copy of the personal data we hold about you. You can access much of your personal data directly through your account profile and settings.",
      "Correction: Update or correct inaccurate personal data at any time through your account settings. If you need assistance correcting information you cannot update yourself, contact us at support@cafatickets.com.",
      "Deletion: Request that we delete your personal data and close your account. You can submit a deletion request through your account settings. We will delete or anonymize your personal data, except where we are required to retain it for legal, financial, or regulatory reasons. If you are an Organizer, please ensure all outstanding event obligations and payout requests are resolved before requesting account deletion.",
      "Portability: Request a copy of your personal data in a structured, machine-readable format.",
      "Objection to Marketing: You may opt out of marketing communications from Cafa Tickets at any time by tapping the unsubscribe link in any marketing email or by adjusting your notification preferences in your account settings. Note that opting out of marketing emails does not stop transactional messages such as ticket confirmations and payout notifications, which are necessary for the operation of the Platform.",
      "Restrict Processing: In certain circumstances, you may request that we restrict how we process your personal data while we address a complaint or concern.",
      "To exercise any of these rights, please contact us at support@cafatickets.com. We will respond to your request within a reasonable timeframe and in accordance with applicable law.",
    ],
  },
  {
    id: 10,
    title: "Push Notifications and Communications",
    content: [
      "Cafa Tickets may send you push notifications to your device to keep you informed about ticket confirmations, event updates, check-in reminders, payout status updates, and other Platform activity. You can manage push notification preferences through your device's operating system settings at any time.",
      "We may also send you email communications of a transactional nature (such as ticket confirmation receipts, withdrawal confirmation emails, and account security alerts). These transactional emails are necessary for the operation of your account and cannot be opted out of while your account is active.",
      "Where you have consented to receive marketing communications, we may send you emails or in-app messages about new events, Platform features, or promotions. You may withdraw your consent to marketing communications at any time.",
    ],
  },
  {
    id: 11,
    title: "Data Retention",
    content: [
      "We retain your personal data for as long as your account is active and for a reasonable period thereafter as necessary to: fulfil the purposes described in this Privacy Policy, comply with our legal obligations (such as financial and tax record-keeping requirements), resolve disputes, and enforce our agreements.",
      "When you delete your account, we will delete or anonymize your personal data within a reasonable period. However, certain data — such as transaction records, payout histories, and identity verification records — may be retained for longer periods as required by applicable law, financial regulations, or fraud prevention obligations.",
      "Anonymized or aggregated data (data that cannot be used to identify you) may be retained indefinitely for analytics and platform improvement purposes.",
    ],
  },
  {
    id: 12,
    title: "Third-Party Services and Links",
    content: [
      "The Platform integrates with third-party services to provide core functionality, including payment processors, cloud infrastructure providers, analytics services, and push notification services. When you interact with these integrations, your data may be processed by these third parties in accordance with their own privacy policies.",
      "The Platform may also contain links to third-party websites or services. Cafa Tickets is not responsible for the privacy practices of any third-party website or service. We encourage you to review the privacy policies of any third-party services you interact with.",
    ],
  },
  {
    id: 13,
    title: "Children's Privacy",
    content: [
      "The Cafa Tickets Platform is intended for users who are 18 years of age or older. We do not knowingly collect personal data from individuals under the age of 18. If you are under 18, please do not use the Platform or submit any personal data through it.",
      "If we become aware that we have inadvertently collected personal data from a person under 18 years of age, we will take prompt steps to delete that information from our systems. If you are a parent or guardian and believe your child has provided personal data to us, please contact us immediately at support@cafatickets.com.",
    ],
  },
  {
    id: 14,
    title: "International Data Transfers",
    content: [
      "Cafa Tickets operates primarily in Ghana and may process and store data on servers located in other countries. If your personal data is transferred to and processed in a country other than your own, we take appropriate measures to ensure your data receives a level of protection consistent with this Privacy Policy and applicable law.",
      "By using the Platform, you acknowledge and consent to the transfer of your personal data to other countries as described in this Privacy Policy.",
    ],
  },
  {
    id: 15,
    title: "Cookies and Tracking Technologies",
    content: [
      "The Cafa Tickets mobile application does not use browser cookies. However, we use similar tracking technologies within the app, including device identifiers, session tokens, and analytics SDKs, to maintain your logged-in state, remember your preferences, and understand how you use the Platform.",
      "Our analytics tools collect anonymized usage data — such as which screens you visit, how long you spend in the app, and which features you use — to help us improve the Platform. This data is not used to personally identify you.",
      "You can limit data collection by our analytics tools by adjusting your device's privacy settings. Note that restricting certain data collection may affect the functionality of the Platform.",
    ],
  },
  {
    id: 16,
    title: "Governing Law and Dispute Resolution",
    content: [
      "This Privacy Policy is governed by the laws of the Republic of Ghana. Any disputes arising in connection with this Privacy Policy that cannot be resolved informally will be subject to the jurisdiction of the courts of the Republic of Ghana.",
      "If you have a complaint about how we have handled your personal data, please contact us in the first instance at support@cafatickets.com. We will take reasonable steps to investigate and resolve your complaint. If you are not satisfied with our response, you may escalate your complaint to the relevant data protection authority in your jurisdiction.",
    ],
  },
  {
    id: 17,
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our data practices, the Platform's features, legal requirements, or business needs. When we make material changes, we will notify you by updating the \"Last Updated\" date at the top of this Policy and, where appropriate, by sending you an in-app notification or email.",
      "Material changes will take effect 30 days after they are posted, unless we communicate a different effective date. All other changes take effect immediately upon posting.",
      "Your continued use of the Platform after any updated Privacy Policy takes effect constitutes your acceptance of the updated Policy. We encourage you to review this Policy periodically. If you do not agree with any changes to this Policy, you must stop using the Platform.",
    ],
  },
  {
    id: 18,
    title: "Contact Us",
    content: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices — including requests to access, correct, delete, or port your personal data — please contact us through any of the following channels:",
      `Email: ${APP_EMAIL}`,
      `Phone: ${APP_NUMBER}`,
      `Website: https://cafatickets.com`,
      "We aim to respond to all privacy inquiries within a reasonable timeframe. When contacting us about a specific account or data request, please include your registered email address and a brief description of your request so we can assist you efficiently.",
    ],
  },
];
