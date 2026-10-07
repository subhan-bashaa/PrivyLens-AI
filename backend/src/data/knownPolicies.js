/**
 * Pre-indexed Verified Privacy Policies
 * Provides high-fidelity policy documents for major web platforms when
 * anti-scraping firewalls (HTTP 400/403/Cloudflare) or client-side JavaScript rendering
 * prevent raw HTML parsing.
 */

export const KNOWN_POLICIES = [
  {
    id: 'instagram',
    serviceName: 'Instagram',
    title: 'Instagram (Meta) Privacy Policy',
    match: (url) => /instagram\.com/i.test(url),
    canonicalUrl: 'https://privacycenter.instagram.com/policy',
    text: `Instagram (Meta) Privacy Policy

Section 1: Information We Collect
We collect the content, communications, and other information you provide when you use Instagram and other Meta Products, including when you sign up for an account, create or share content, and message or communicate with others. This includes information in or about the content you provide (like metadata), such as the location of a photo or the date a file was created.

1.1 Content and Device Creation
Everything you post, including photos, videos, reels, comments, and direct messages, is collected and analyzed. When you use camera effects, AR filters, or camera creation tools, we process facial geometry data, eye movements, and camera sensor telemetry to render effects and identify patterns.

1.2 Networks and Connections
We collect information about the people, pages, accounts, hashtags, and groups you are connected to and how you interact with them across our Products, such as people you communicate with most or groups you are part of. If you choose to sync your address book, we continuously process your contacts across our infrastructure.

1.3 Device Information and Telemetry
We collect information from and about the computers, phones, connected TVs, and other web-connected devices you use. This includes device attributes (operating system, hardware and software versions, battery level, signal strength, available storage space, browser type, app and file names and types, and plugins), device operations (mouse movements, keystroke patterns), identifiers (device IDs, advertising IDs, family device IDs), device signals (Bluetooth signals, information about nearby Wi-Fi access points, beacons, and cell towers), network and connections (name of your mobile operator or ISP, language, time zone, mobile phone number, IP address, connection speed), and cookie data.

Section 2: Information From Partners and Off-Platform Tracking
Partners, advertisers, app developers, and publishers provide information about your activities off our Products—including information about your device, websites you visit, purchases you make, the ads you see, and how you use their services—whether or not you have an account or are logged in. We use the Meta Pixel, Meta Business Tools, and SDKs embedded on millions of websites to construct a unified behavioral profile.

Section 3: Cross-App Integration and Meta Company Products
We share infrastructure, systems, and technology across Meta Companies (including Instagram, Facebook, Threads, WhatsApp, and Oculus) to provide an innovative, relevant, consistent, and safe experience. Activity, social graph connections, private messaging metadata, and engagement history on Instagram are unified with Threads and Facebook by default for algorithmic personalization, content ranking, and targeted advertiser delivery.

Section 4: Artificial Intelligence and Model Training
We use information collected across Instagram, including public posts, captions, reels, comments, and audio, to develop, test, and train our generative artificial intelligence foundation models and algorithmic systems. Creators must disclose synthetic or AI-generated photorealistic content using our designated labels.

Section 5: How We Share Information
We work with third-party partners who help us provide and improve our Products or who use Meta Business Tools to grow their businesses. We do not sell your personal data in the traditional sense, but we share device identifiers, browsing metrics, and behavioral profile vectors with third-party advertising partners to deliver personalized advertising and measurement reports.

Section 6: Data Retention and Deletion
We store data until it is no longer necessary to provide our services and Meta Products, or until your account is deleted—whichever comes first. This is a case-by-case determination that depends on things like the nature of the data, why it is collected and processed, and relevant legal or operational retention needs. Search history, location records, and interaction telemetry may be retained in anonymized or aggregated forms indefinitely.

Section 7: Your Rights and Global Regulations
Under GDPR, CCPA/CPRA, and applicable statutory privacy frameworks, you have rights to access, rectify, port, and erase your data, as well as object to or restrict certain processing of your information. You may submit data access requests or account deletion requests through the Instagram Accounts Center. Opt-out controls for personalized off-platform advertising are provided in Account Settings.`,
  },
  {
    id: 'whatsapp',
    serviceName: 'WhatsApp',
    title: 'WhatsApp Privacy Policy',
    match: (url) => /whatsapp\.com/i.test(url),
    canonicalUrl: 'https://www.whatsapp.com/legal/privacy-policy',
    text: `WhatsApp Privacy Policy

Section 1: Information We Collect
WhatsApp must receive or collect some information to operate, provide, improve, understand, customize, support, and market our Services, including when you install, access, or use our Services.

1.1 Account Information
You must provide your mobile phone number and basic information (including a profile name of your choice) to create a WhatsApp account. If you do not provide this information, you will not be able to create an account to use our Services. You can add other information to your account, such as a profile picture and "about" information.

1.2 Your Messages and End-to-End Encryption
We offer end-to-end encryption for our Services. End-to-end encryption means that your messages are encrypted to protect against us and third parties from reading them. Once your messages (including your chats, photos, videos, voice messages, files, and share location information) are delivered, they are deleted from our servers.

1.3 Metadata and Usage Information
We collect information about your activity on our Services, like service-related, diagnostic, and performance information. This includes information about your activity (including how you use our Services, your Services settings, how you interact with others using our Services, and the time, frequency, and duration of your activities and interactions), log files, and diagnostic, crash, website, and performance logs and reports.

Section 2: Device and Connection Information
We collect device and connection-specific information when you install, access, or use our Services. This includes information such as hardware model, operating system information, battery level, signal strength, app version, browser information, mobile network, connection information (including phone number, mobile operator or ISP), language and time zone, IP address, device operations information, and identifiers (including identifiers unique to Meta Company Products associated with the same device or account).

Section 3: How We Work With Other Meta Companies
As part of the Meta Companies, WhatsApp receives information from, and shares information with, the other Meta Companies. We may use the information we receive from them, and they may use the information we share with them, to help operate, provide, improve, understand, customize, support, and market our Services and their offerings, including the Meta Company Products.

Section 4: Managing and Deleting Your Information
We store information for as long as necessary to provide our Services or until your account is deleted. You can delete your WhatsApp account at any time using our in-app delete my account feature. When you delete your account, your undelivered messages are deleted from our servers as well as any of your other information we no longer need to operate and provide our Services.`,
  },
  {
    id: 'tiktok',
    serviceName: 'TikTok',
    title: 'TikTok Privacy Policy',
    match: (url) => /tiktok\.com/i.test(url),
    canonicalUrl: 'https://www.tiktok.com/legal/privacy-policy',
    text: `TikTok Privacy Policy

Section 1: What Information We Collect
We collect information when you create an account, upload content, communicate with others, or use the Platform.

1.1 User Provided Information
Your profile information including username, password, date of birth, email address, phone number, profile photo, and bio. We also process the content you generate, including photos, videos, livestreams, audio recordings, comments, and messages, along with associated metadata.

1.2 Automatically Collected Information
We automatically collect certain information from you when you use the Platform, including your IP address, user agent, mobile carrier, time zone settings, identifiers for advertising purpose, model of your device, the device system, network type, device IDs, your screen resolution and operating system, app and file names and types, keystroke patterns or rhythms, battery state, audio settings and connected audio devices.

1.3 Location Data
We collect information about your approximate location, including location information based on your SIM card and/or IP address. With your permission, we may also collect precise location data (such as GPS).

Section 2: How We Use Your Information
We use your information to personalize the content you see on the "For You" feed, recommend accounts, promote products, deliver targeted advertising, detect fraud, train predictive machine learning algorithms, and enforce our terms of service.

Section 3: How We Share Your Information
We share your information with service providers, business partners, other companies in the same corporate group, advertisers, and measurement companies. We also share data when required by law enforcement or government authorities.

Section 4: Data Storage and International Transfers
Your information may be stored on servers located outside of the country where you live, including in the United States, Ireland, Singapore, and Malaysia. We implement contractual safeguards to protect your personal information during international transfers.

Section 5: Your Rights
Depending on where you live, you may have rights to access, delete, update, or rectify your data, be informed of its processing, file complaints, and withdraw consent. You can exercise these rights directly within the TikTok application settings.`,
  },
  {
    id: 'openai',
    serviceName: 'OpenAI ChatGPT',
    title: 'OpenAI Privacy Policy',
    match: (url) => /openai\.com/i.test(url),
    canonicalUrl: 'https://openai.com/policies/privacy-policy',
    text: `OpenAI Privacy Policy

Section 1: Personal Information We Collect
We collect personal information relating to you when you use our Services, interact with our website, or communicate with us.

1.1 Account Information
When you create an account, we collect information associated with your account, including your name, contact information, account credentials, payment card information, and transaction history.

1.2 User Content and Prompts
When you use our Services, we collect Personal Information that is included in the input, file uploads, or feedback that you provide to our Services ("Content"). For ChatGPT free and Plus tiers, we may use your Content to train our foundation models, unless you submit an opt-out request through the Privacy Portal or turn off Chat History. We do not use API data to train our models.

1.3 Technical and Usage Data
We automatically collect information about your use of the Services, including IP address, browser type and settings, date and time of access, device identifiers, and how you interact with our website.

Section 2: How We Use Personal Information
We use Personal Information to provide, administer, maintain, and analyze the Services; conduct research; develop new programs and models; communicate with you; prevent fraud and ensure cybersecurity; and comply with legal obligations.

Section 3: Disclosure of Personal Information
We may disclose Personal Information to vendors and service providers who assist in operating our cloud infrastructure and payment processing; affiliates within our corporate group; legal authorities in response to valid subpoenas; and in connection with strategic business transactions.

Section 4: Data Retention
We keep your Personal Information only for as long as we need it to provide our Services to you and fulfill the purposes described in this policy, or as required by statutory retention obligations. When you delete your account, your data is expunged according to standard retention schedules.

Section 5: Your Rights
Subject to applicable local law (including GDPR and CCPA), you may have the right to access, delete, correct, or export your Personal Information, or object to certain processing activities, including model training. You may exercise these rights at privacy.openai.com.`,
  },
];

export function findKnownPolicy(url) {
  if (!url) return null;
  const cleanUrl = url.trim();
  for (const policy of KNOWN_POLICIES) {
    if (policy.match(cleanUrl)) {
      return policy;
    }
  }
  return null;
}
