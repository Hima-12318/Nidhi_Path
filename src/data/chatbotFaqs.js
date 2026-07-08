const categorySeeds = {
  "Education Loan": [
    ["eligibility", "Education loan eligibility usually depends on admission status, course, college, co-applicant income, credit profile and required loan amount.", ["education", "student", "eligibility", "eligible", "admission"]],
    ["collateral", "Collateral may be required for higher loan amounts or certain profiles. Some banks also offer unsecured education loans for eligible colleges and courses.", ["collateral", "security", "property", "guarantee"]],
    ["abroad studies", "For abroad studies, banks commonly review admission letter, country, university ranking, expenses, co-applicant income and visa-related documents.", ["abroad", "overseas", "foreign", "visa", "country"]],
    ["interest rate", "Education loan interest rates vary by bank, course, collateral, co-applicant profile and credit score. Nidhi Path can help compare available options.", ["interest", "rate", "roi"]],
    ["processing time", "Processing time is often 7 to 21 working days after complete documents, but it can change based on bank checks and university requirements.", ["time", "processing", "days", "how long"]],
    ["documents", "Common documents include admission letter, fee structure, KYC, academic records, co-applicant income proof, bank statements and collateral papers if applicable.", ["documents", "papers", "kyc", "marksheet"]],
    ["co-applicant", "Most education loans need a parent, guardian or earning co-applicant so the bank can assess repayment support.", ["co applicant", "co-applicant", "parent", "guardian"]],
    ["moratorium", "Many education loans offer a moratorium during study period and a short additional period. Interest may still accrue during this time.", ["moratorium", "holiday", "study period"]],
    ["repayment", "Repayment normally starts after the moratorium. EMI depends on loan amount, interest rate and tenure.", ["repayment", "emi", "pay back", "tenure"]],
    ["disbursement", "Disbursement is usually made as per college fee schedule after sanction and completion of bank documentation.", ["disbursement", "release", "fee payment"]]
  ],
  "Personal Loan": [
    ["eligibility", "Personal loan eligibility depends on salary or income, employer profile, CIBIL score, existing EMIs and bank policy.", ["personal", "eligibility", "eligible"]],
    ["salary", "Banks usually check monthly salary, job stability and salary account history before approving a personal loan.", ["salary", "income", "job"]],
    ["CIBIL", "A stronger CIBIL score improves approval chances and pricing. Low scores may need profile correction or alternate bank options.", ["cibil", "credit score", "score"]],
    ["interest", "Personal loan interest rates vary by bank, income, score, employer category and repayment history.", ["interest", "rate", "roi"]],
    ["documents", "Typical documents are PAN, Aadhaar, salary slips, bank statements, employee ID and address proof.", ["documents", "papers", "salary slip"]],
    ["processing time", "Personal loans can be processed quickly when documents and bank eligibility are clear, sometimes within a few working days.", ["processing", "time", "fast", "days"]],
    ["loan amount", "The eligible amount depends on net income, existing obligations, employer, tenure and credit assessment.", ["amount", "limit", "how much"]],
    ["repayment", "Repayment is through monthly EMI over the selected tenure. Shorter tenure increases EMI but reduces total interest.", ["repayment", "emi", "tenure"]],
    ["preclosure", "Many banks allow preclosure after a minimum number of EMIs, with charges depending on bank policy.", ["preclose", "preclosure", "foreclose"]],
    ["rejected application", "If rejected, review CIBIL, income obligations, bank statement behavior and documentation before applying again.", ["rejected", "declined", "not approved"]]
  ],
  "Business Loan": [
    ["turnover", "Business loan eligibility often starts with turnover, vintage, banking transactions, profitability and repayment capacity.", ["business", "turnover", "sales"]],
    ["GST", "GST returns help banks understand business activity and turnover consistency.", ["gst", "returns"]],
    ["ITR", "ITR and financial statements are important for assessing profit and repayment capacity.", ["itr", "income tax", "financials"]],
    ["bank statement", "Banks review business bank statements for cash flow, credits, bounces and average balance.", ["bank statement", "statement", "transactions"]],
    ["collateral", "Some business loans are unsecured, while larger limits or weaker profiles may need collateral.", ["collateral", "security", "property"]],
    ["working capital", "Working capital loans support stock, receivables and operating cash flow needs.", ["working capital", "cash flow", "stock"]],
    ["MSME", "MSME registration can help with certain loan schemes, but approval still depends on bank assessment.", ["msme", "udyam", "scheme"]],
    ["interest", "Business loan rates depend on financials, banking behavior, collateral, vintage and lender policy.", ["interest", "rate", "roi"]],
    ["documents", "Common documents include KYC, GST, ITR, bank statements, business proof, financials and ownership documents.", ["documents", "papers", "proof"]],
    ["processing", "Processing can take a few days to a few weeks depending on loan type, documents and field verification.", ["processing", "time", "days"]]
  ],
  "Home Loan": [
    ["eligibility", "Home loan eligibility depends on income, CIBIL, age, property value, legal checks and existing EMIs.", ["home", "eligibility", "house"]],
    ["property documents", "Banks need property title, link documents, approvals, tax receipts, sale agreement and valuation/legal checks.", ["property", "documents", "title", "sale deed"]],
    ["down payment", "Most home loans require buyer contribution. The bank funds only an eligible portion of property value.", ["down payment", "margin", "own contribution"]],
    ["interest rate", "Home loan rates vary by lender, score, income profile, property and loan program.", ["interest", "rate", "roi"]],
    ["tenure", "Longer tenure lowers EMI but increases total interest. Eligibility also depends on applicant age.", ["tenure", "years", "emi"]],
    ["CIBIL", "Good CIBIL improves home loan approval and may help with better rates.", ["cibil", "credit score", "score"]],
    ["income proof", "Salary slips, ITR, bank statements and employment or business proof are commonly required.", ["income proof", "salary", "itr"]],
    ["processing", "Home loan processing includes document collection, credit checks, legal verification, valuation and sanction.", ["processing", "time", "verification"]],
    ["balance transfer", "Balance transfer may help reduce interest cost if the new lender offers better terms after charges.", ["balance transfer", "bt", "transfer"]],
    ["disbursement", "Disbursement happens after sanction, property checks and execution of loan documents.", ["disbursement", "release", "payment"]]
  ],
  "Mutual Funds": [
    ["SIP", "SIP lets you invest a fixed amount regularly and can support disciplined long-term investing.", ["sip", "monthly investment"]],
    ["lump sum", "Lump sum investing means investing a larger amount at once. Suitability depends on risk profile and market conditions.", ["lump sum", "onetime", "one time"]],
    ["risk", "Mutual funds are market-linked. Risk varies across debt, hybrid, index and equity funds.", ["risk", "safe", "market"]],
    ["returns", "Returns are not guaranteed. They depend on fund category, market performance, time horizon and costs.", ["returns", "profit", "growth"]],
    ["KYC", "KYC is required before investing and usually includes PAN, Aadhaar, bank details and verification.", ["kyc", "pan", "aadhaar"]],
    ["tax saving", "ELSS funds may offer tax benefits under applicable tax rules with a lock-in period.", ["tax", "elss", "saving"]],
    ["redemption", "Redemption time depends on fund type. Some funds may have exit loads or lock-in restrictions.", ["redeem", "withdraw", "redemption"]],
    ["long term", "Long-term investing can reduce short-term market noise and support goal-based planning.", ["long term", "goal", "years"]],
    ["portfolio", "A portfolio should match goals, risk tolerance, time horizon and liquidity needs.", ["portfolio", "allocation", "mix"]],
    ["advisory", "Nidhi Path can provide basic guidance and connect you with suitable advisory support for mutual fund planning.", ["advice", "advisor", "guidance"]]
  ],
  "Insurance": [
    ["life insurance", "Life insurance helps protect family finances if the earning member is no longer available.", ["life insurance", "term plan"]],
    ["health insurance", "Health insurance helps cover hospitalization and medical expenses based on policy terms.", ["health insurance", "medical", "hospital"]],
    ["premium", "Premium depends on age, cover amount, health, policy type, tenure and add-ons.", ["premium", "cost", "price"]],
    ["claim", "Claims require policy details, proof, hospital or event documents and insurer verification.", ["claim", "settlement"]],
    ["documents", "Common documents include KYC, income proof for some plans, medical details and nominee information.", ["documents", "papers", "kyc"]],
    ["policy term", "Policy term should match the protection need, income years and family responsibilities.", ["term", "duration", "years"]],
    ["renewal", "Renew policies on time to avoid lapse and waiting period issues.", ["renewal", "renew", "lapse"]],
    ["family cover", "Family floater health plans can cover multiple family members under one sum insured.", ["family", "floater", "parents"]],
    ["tax benefit", "Insurance tax benefits depend on current tax rules and policy type.", ["tax", "benefit", "deduction"]],
    ["eligibility", "Eligibility depends on age, health, income, existing cover and insurer underwriting.", ["eligibility", "eligible"]]
  ],
  "Loan Consultation": [
    ["consultation fee", "Consultation charges, if applicable, are explained before proceeding so you know the scope clearly.", ["fee", "charges", "cost"]],
    ["process", "The process starts with profile review, eligibility discussion, document checklist, bank comparison and next-step planning.", ["process", "steps", "how"]],
    ["bank comparison", "Bank comparison looks at eligibility, rate, processing time, documents, collateral and repayment comfort.", ["compare", "bank comparison", "best bank"]],
    ["documentation support", "Documentation support helps you prepare the right papers before formal bank submission.", ["documentation", "documents", "support"]],
    ["eligibility check", "Eligibility check reviews income, purpose, amount, credit score, obligations and available bank options.", ["eligibility", "check", "profile"]],
    ["loan rejection", "For rejected loans, the team can review likely reasons and suggest a better next approach.", ["rejection", "rejected", "declined"]],
    ["timeline", "Timeline depends on loan type, document readiness, bank checks and customer responsiveness.", ["timeline", "time", "days"]],
    ["appointment", "You can request an appointment through enquiry, phone, WhatsApp or live chat.", ["appointment", "meeting", "visit"]],
    ["follow-up", "Follow-up updates can be shared through the CRM dashboard after your account/application is created.", ["follow up", "follow-up", "status"]],
    ["service support", "Support covers guidance, eligibility, document preparation and coordination, subject to the selected service.", ["support", "help", "service"]]
  ],
  "General Support": [
    ["contact", "You can contact Nidhi Path at +91 97056 82595 or info@nidhipath.in.", ["contact", "reach"]],
    ["office location", "The office is in Vijayawada, Andhra Pradesh. Please contact the team before visiting.", ["office", "location", "address"]],
    ["working hours", "Working hours are generally Monday to Saturday, 10:00 AM to 6:00 PM.", ["working hours", "timing", "open"]],
    ["phone", "Phone support is available at +91 97056 82595.", ["phone", "mobile", "call"]],
    ["email", "Email the team at info@nidhipath.in for enquiries and follow-up.", ["email", "mail"]],
    ["WhatsApp", "You can use the listed phone number for WhatsApp support where available.", ["whatsapp", "wa"]],
    ["website", "The website helps submit enquiries, use EMI tools, chat with support and access dashboards.", ["website", "site"]],
    ["documents", "Document needs depend on service type. Choose a category or share your requirement for a checklist.", ["documents", "papers"]],
    ["status", "Registered users can sign in to the dashboard to view account, application and CRM update status.", ["status", "track", "dashboard"]],
    ["agent", "A live agent can help with detailed or profile-specific questions.", ["agent", "human", "representative", "support"]]
  ]
};

module.exports = Object.entries(categorySeeds).flatMap(([category, rows]) =>
  rows.map(([question, answer, keywords]) => ({ category, question, answer, keywords }))
);
