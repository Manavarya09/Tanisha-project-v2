// Assessment Questions and Logic

import Papa from 'papaparse';

export interface Question {
  id: string;
  question: string;
  text: string;
  category: string;
  pillar: 'strategy' | 'culture' | 'business' | 'data' | 'infrastructure' | 'people' | 'governance';
  options: Array<{
    value: number;
    label: string;
  }>;
}

export interface AssessmentData {
  companyName: string;
  industry: string;
  companySize: string;
  region?: string;
  assessmentType?: 'free' | 'paid';
  responses: Record<string, number>;
}

export interface PillarScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  color: string;
}

export interface AssessmentResults {
  overallScore: number;
  overallPercentage: number;
  overallLevel: string;
  pillarScores: PillarScore[];
  industryPercentile: number;
  recommendations: Recommendation[];
}

export interface Recommendation {
  pillar: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  timeline: string;
}

export interface CSVQuestion {
  pillar: string;
  subcategory: string;
  question: string;
  maturityLevel: string;
  readinessLevel: string;
  scoreRange: string;
  recommendation: string;
}

export interface PillarQuestions {
  [pillar: string]: {
    [subcategory: string]: CSVQuestion[];
  };
}

export interface CSVRecommendation {
  maturityLevel: string;
  readinessLevel: string;
  scoreRange: string;
  recommendation: string;
}

export interface UniqueCSVQuestion {
  pillar: string;
  subcategory: string;
  question: string;
  recommendations: CSVRecommendation[];
}

export interface PillarQuestionsUnique {
  [pillar: string]: {
    [subcategory: string]: UniqueCSVQuestion[];
  };
}

export interface AirtableQuestionRow {
  "Question ID": string;
  "Subcategory ID": string;
  Pillar: string;
  Subcategory: string;
  Question: string;
  Region?: string;
  "Assessment Type"?: string;
  "Active?"?: string;
}

export type PillarCategoryQuestions = {
  [pillar: string]: {
    [subcategory: string]: UniqueCSVQuestion[];
  };
};

export function parseAirtableCSVByRegion(csvText: string, selectedRegion: string): PillarCategoryQuestions {
  const parsed = Papa.parse(csvText, { header: true });
  const regionNorm = (selectedRegion || 'Global').toLowerCase();
  const regMatches = (cell?: string) => {
    if (!cell) return false;
    const tokens = cell.split(',').map(s => s.trim().toLowerCase());
    if (tokens.includes('global')) return true;
    if (regionNorm === 'global') return true;
    // Normalize common aliases
    const aliases: Record<string, string[]> = {
      'middle east': ['me', 'middle east', 'gulf', 'mena'],
      'europe': ['eu', 'europe', 'europa']
    };
    for (const [key, vals] of Object.entries(aliases)) {
      if (vals.includes(regionNorm)) {
        return tokens.some(t => vals.includes(t));
      }
    }
    return tokens.includes(regionNorm);
  };

  const questions: PillarCategoryQuestions = {};
  (parsed.data as AirtableQuestionRow[]).forEach((row) => {
    if (!row || row["Question ID"] === undefined) return;
    const active = (row["Active?"] || '').toString().toLowerCase() === 'true';
    if (!active) return;
    if (!row.Pillar || !row.Subcategory || !row.Question) return;
    if (!regMatches(row.Region)) return;

    if (!questions[row.Pillar]) questions[row.Pillar] = {};
    if (!questions[row.Pillar][row.Subcategory]) questions[row.Pillar][row.Subcategory] = [];

    questions[row.Pillar][row.Subcategory].push({
      pillar: row.Pillar,
      subcategory: row.Subcategory,
      question: row.Question,
      recommendations: []
    });
  });
  return questions;
}

// Standard Yes/No/Partial options for all questions (both free and paid)
const standardOptions = [
  { value: 1, label: 'No' },
  { value: 3, label: 'Partial' },
  { value: 5, label: 'Yes' }
];

// Helper function to create a question
const createQuestion = (id: string, text: string, category: string, pillar: 'strategy' | 'culture' | 'business' | 'data' | 'infrastructure' | 'people' | 'governance'): Question => ({
  id,
  question: text,
  text,
  category,
  pillar,
  options: standardOptions
});

// Comprehensive Assessment Questions
export const assessmentQuestions: Question[] = [
  // ORGANIZATION READINESS (33 questions)
  // Strategy and Leadership (10 questions)
  createQuestion('org_strategy_1', 'Does the organization have a long-term vision for AI adoption and integration into its business strategy?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_2', 'Is this AI strategy aligned with its business objectives?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_3', 'Does the strategy include a timeline with clear targets?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_4', 'Are senior leaders committed to and actively involved in driving AI adoption within the organization?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_5', 'Is there a designated AI champion or leadership team responsible for overseeing AI initiatives?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_6', 'Are there initiatives to monitor and track emerging trends in AI research, development, and applications to stay ahead of the curve?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_7', 'Is there alignment between the organization\'s culture and values and the goals and objectives of AI initiatives?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_8', 'Are employees across different levels of the organization aware of and aligned with the organization\'s AI strategy and objectives?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_9', 'Is there effective communication and collaboration between different departments or teams involved in AI initiatives?', 'Strategy and Leadership', 'strategy'),
  createQuestion('org_strategy_10', 'Are there channels for sharing knowledge, updates, and insights across departments to foster cross-functional collaboration?', 'Strategy and Leadership', 'strategy'),

  // Culture and Change Management (4 questions)
  createQuestion('org_culture_1', 'Is there a culture of innovation and experimentation that supports AI adoption within the organization?', 'Culture and Change Management', 'culture'),
  createQuestion('org_culture_2', 'Are employees receptive to new technologies and willing to adapt to changes brought by AI?', 'Culture and Change Management', 'culture'),
  createQuestion('org_culture_3', 'Is there a change management plan in place to address potential resistance to AI adoption and facilitate organizational change?', 'Culture and Change Management', 'culture'),
  createQuestion('org_culture_4', 'How confident are employees in using AI technologies without fear of job displacement?', 'Culture and Change Management', 'culture'),

  // Financial Support (3 questions)
  createQuestion('org_financial_1', 'Are there budgeting processes and financial controls in place to track and manage AI-related expenditures?', 'Financial Support', 'strategy'),
  createQuestion('org_financial_2', 'Does the organization have a funding model (e.g., internal budgets, grants, investors) to sustain AI initiatives over 3-5 years?', 'Financial Support', 'strategy'),
  createQuestion('org_financial_3', 'Is there a booked budget for the current year for AI investments?', 'Financial Support', 'strategy'),

  // Talent and Skills (4 questions)
  createQuestion('org_talent_1', 'Does the organization have a sufficient pool of talent with expertise in AI and data science?', 'Talent and Skills', 'people'),
  createQuestion('org_talent_2', 'Are employees equipped with the necessary skills and knowledge to work with AI technologies?', 'Talent and Skills', 'people'),
  createQuestion('org_talent_3', 'Is there a development plan in place for upskilling or hiring additional talent to support AI initiatives?', 'Talent and Skills', 'people'),
  createQuestion('org_talent_4', 'Are there initiatives in place to attract top AI talent, such as recruitment programs, partnerships with educational institutions, or professional development opportunities?', 'Talent and Skills', 'people'),

  // Training and Development (4 questions)
  createQuestion('org_training_1', 'Is the organization committed to continuous learning and improvement in AI adoption through ongoing assessment, feedback, and adaptation?', 'Training and Development', 'people'),
  createQuestion('org_training_2', 'Are there resources, workshops, or online courses available to help employees understand AI concepts, applications, and implications for their roles?', 'Training and Development', 'people'),
  createQuestion('org_training_3', 'Are there forums or platforms for sharing lessons learned and best practices across teams and departments?', 'Training and Development', 'people'),
  createQuestion('org_training_4', 'Does the organization provide training to integrate AI tools into daily workflows for non-technical employees?', 'Training and Development', 'people'),

  // Legal, Governance, Regulatory and Ethical Considerations (4 questions)
  createQuestion('org_legal_1', 'Does the organization have processes in place to ensure responsible and ethical AI deployment?', 'Legal, Governance, Regulatory and Ethical Considerations', 'governance'),
  createQuestion('org_legal_2', 'Does the organization have an ethics committee or oversight body responsible for reviewing and guiding AI projects?', 'Legal, Governance, Regulatory and Ethical Considerations', 'governance'),
  createQuestion('org_legal_3', 'Are there mechanisms for monitoring and addressing potential risks and biases associated with AI algorithms?', 'Legal, Governance, Regulatory and Ethical Considerations', 'governance'),
  createQuestion('org_legal_4', 'Are there mechanisms for ensuring compliance with relevant laws and regulations throughout the AI lifecycle?', 'Legal, Governance, Regulatory and Ethical Considerations', 'governance'),

  // External Partnerships and Ecosystem (4 questions)
  createQuestion('org_partnerships_1', 'Are there partnerships in place to access external data sources or AI tools and technologies?', 'External Partnerships and Ecosystem', 'strategy'),
  createQuestion('org_partnerships_2', 'Does the organization participate in industry collaborations, partnerships, or consortia to exchange knowledge, share best practices, and drive collective progress in AI adoption?', 'External Partnerships and Ecosystem', 'strategy'),
  createQuestion('org_partnerships_3', 'Is the organization part of any AI ecosystems or industry consortia that facilitates knowledge sharing and collaboration?', 'External Partnerships and Ecosystem', 'strategy'),
  createQuestion('org_partnerships_4', 'Does the organization have processes in place for selecting and managing AI vendors and suppliers?', 'External Partnerships and Ecosystem', 'strategy'),

  // Implementation (4 questions)
  createQuestion('org_implementation_1', 'Are there integration challenges with existing systems or processes that need to be addressed for seamless AI adoption?', 'Implementation', 'strategy'),
  createQuestion('org_implementation_2', 'Is there a governance framework in place to oversee AI initiatives and ensure alignment with organizational goals and values?', 'Implementation', 'strategy'),
  createQuestion('org_implementation_3', 'Does the organization have processes in place to capture and document knowledge gained from AI initiatives, including lessons learned and best practices?', 'Implementation', 'strategy'),
  createQuestion('org_implementation_4', 'Does the organization follow agile development practices for AI solutions?', 'Implementation', 'strategy'),

  // DATA READINESS (40 questions)
  // Cybersecurity & Compliance (13 questions)
  createQuestion('data_security_1', 'Are there policies and measures in place to protect sensitive data, prevent unauthorized access, and comply with data protection regulations, such as GDPR or HIPAA?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_2', 'Is the infrastructure audited regularly for vulnerabilities?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_3', 'Are there mechanisms for data anonymization, encryption, and access control to protect against unauthorized access or breaches?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_4', 'Are there measures to ensure digital security and resilience against cyber threats?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_5', 'Are there cybersecurity protocols, incident response plans, and employee training programs to protect AI systems, data assets, and critical infrastructure from cyber attacks?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_6', 'How secure is the infrastructure from cyber threats (e.g., encryption, firewalls, identity management)?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_7', 'Does the company have the necessary software tools for AI/ML development (e.g., TensorFlow, PyTorch, Scikit-learn)?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_8', 'Are there cybersecurity safeguards specifically designed for AI pipelines (e.g., model training, inference stages)?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_9', 'Are there testing methodologies for detecting bugs in AI algorithms?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_10', 'Are there integrated platforms for AI deployment?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_11', 'Are there protocols for model training, testing, evaluation, and iteration to ensure robustness, accuracy, and reliability in real-world scenarios?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_12', 'Are there rigorous testing methodologies, validation processes, and quality assurance standards for detecting bugs, errors, or vulnerabilities in AI algorithms, models, or software components?', 'Cybersecurity & Compliance', 'data'),
  createQuestion('data_security_13', 'Does the organization contribute to open source projects or collaborate with industry consortia to advance AI research, innovation, and standardization?', 'Cybersecurity & Compliance', 'data'),

  // Integration with Legacy Systems (4 questions)
  createQuestion('data_integration_legacy_1', 'Are there APIs for AI integration?', 'Integration with Legacy Systems', 'data'),
  createQuestion('data_integration_legacy_2', 'What challenges exist in integrating AI with existing systems?', 'Integration with Legacy Systems', 'data'),
  createQuestion('data_integration_legacy_3', 'How well can AI solutions be integrated with the company\'s existing IT infrastructure and legacy systems?', 'Integration with Legacy Systems', 'data'),
  createQuestion('data_integration_legacy_4', 'Is the network infrastructure capable of handling high data transfer speeds and low latency for AI workloads?', 'Integration with Legacy Systems', 'data'),

  // Scalability & Flexibility (3 questions)
  createQuestion('data_scalability_1', 'What is the plan for scaling AI operations?', 'Scalability & Flexibility', 'data'),
  createQuestion('data_scalability_2', 'How flexible is the infrastructure?', 'Scalability & Flexibility', 'data'),
  createQuestion('data_scalability_3', 'Is the infrastructure scalable for AI?', 'Scalability & Flexibility', 'data'),

  // Network & Connectivity (2 questions)
  createQuestion('data_network_1', 'Is the network capable of high data speeds?', 'Network & Connectivity', 'data'),
  createQuestion('data_network_2', 'Does the company have a plan for scaling network?', 'Network & Connectivity', 'data'),

  // Disaster Recovery & Redundancy (6 questions)
  createQuestion('data_disaster_1', 'What is the disaster recovery plan for critical AI and data systems?', 'Disaster Recovery & Redundancy', 'data'),
  createQuestion('data_disaster_2', 'Are there redundancies and backups in place for infrastructure supporting AI?', 'Disaster Recovery & Redundancy', 'data'),
  createQuestion('data_disaster_3', 'Is there an AI infrastructure monitoring system in place (e.g., for resource usage, performance, failures)?', 'Disaster Recovery & Redundancy', 'data'),
  createQuestion('data_disaster_4', 'How are maintenance and updates managed?', 'Disaster Recovery & Redundancy', 'data'),
  createQuestion('data_disaster_5', 'Are performance metrics tracked?', 'Disaster Recovery & Redundancy', 'data'),
  createQuestion('data_disaster_6', 'Does the organization use well-defined data processes?', 'Disaster Recovery & Redundancy', 'data'),

  // Data Quality (6 questions)
  createQuestion('data_quality_1', 'Is there a data quality solution in place?', 'Data Quality', 'data'),
  createQuestion('data_quality_2', 'Are there clear targets and measurements to increase data quality?', 'Data Quality', 'data'),
  createQuestion('data_quality_3', 'Is the data stored in a structured format suitable for AI analysis?', 'Data Quality', 'data'),
  createQuestion('data_quality_4', 'Does the organization have labeled datasets available to support AI model training and validation?', 'Data Quality', 'data'),
  createQuestion('data_quality_5', 'Does the organization have access to high-quality data relevant to AI initiatives?', 'Data Quality', 'data'),
  createQuestion('data_quality_6', 'Is the data already usable for training AI models?', 'Data Quality', 'data'),

  // Data Availability (3 questions)
  createQuestion('data_availability_1', 'Is there a common data share agreement or approach?', 'Data Availability', 'data'),
  createQuestion('data_availability_2', 'Is there any data sharing platform or application?', 'Data Availability', 'data'),
  createQuestion('data_availability_3', 'Has the organization successfully eliminated data silos to ensure data availability across departments?', 'Data Availability', 'data'),

  // Data Consistency (3 questions)
  createQuestion('data_consistency_1', 'Does the organization implement standardization protocols to maintain data consistency across systems?', 'Data Consistency', 'data'),
  createQuestion('data_consistency_2', 'Is there a version control system in place to manage data consistency for AI training and operations?', 'Data Consistency', 'data'),
  createQuestion('data_consistency_3', 'Are techniques in place to verify the accuracy of data before its use in AI models?', 'Data Consistency', 'data'),

  // Data Accuracy (3 questions)
  createQuestion('data_accuracy_1', 'Does the organization conduct periodic reviews to assess the historical accuracy of the data used in decision-making?', 'Data Accuracy', 'data'),
  createQuestion('data_accuracy_2', 'Are role-based access controls effectively implemented to restrict data access to authorized personnel only?', 'Data Accuracy', 'data'),
  createQuestion('data_accuracy_3', 'Are techniques in place to verify the accuracy of data before AI use?', 'Data Accuracy', 'data'),

  // Data Accessibility (3 questions)
  createQuestion('data_accessibility_1', 'Can data be easily and promptly retrieved by users as needed?', 'Data Accessibility', 'data'),
  createQuestion('data_accessibility_2', 'Are there repositories for storing and disseminating AI-related information?', 'Data Accessibility', 'data'),
  createQuestion('data_accessibility_3', 'Is there a corporate data compliance audit available?', 'Data Accessibility', 'data'),

  // Data Compliance (3 questions)
  createQuestion('data_compliance_1', 'Is there a data governance framework in place to ensure data quality, security, and compliance?', 'Data Compliance', 'data'),
  createQuestion('data_compliance_2', 'Is there a data protection legal person available?', 'Data Compliance', 'data'),
  createQuestion('data_compliance_3', 'Is the data in silos or is there an integration layer?', 'Data Compliance', 'data'),

  // Data Integration (3 questions)
  createQuestion('data_integration_1', 'Is there a corporate data catalog available?', 'Data Integration', 'data'),
  createQuestion('data_integration_2', 'Is there a data owner per data source defined?', 'Data Integration', 'data'),
  createQuestion('data_integration_3', 'Does the organization maintain detailed records of data lineage?', 'Data Integration', 'data'),

  // Data Transparency (1 question)
  createQuestion('data_transparency_1', 'Are changes in data management policies communicated transparently to all relevant stakeholders?', 'Data Transparency', 'data'),

  // BUSINESS READINESS (30 questions)
  // Business AI Readiness (6 questions)
  createQuestion('business_ai_1', 'How does the organization prioritize user experience and accessibility in its AI-driven products and services?', 'Business AI Readiness', 'business'),
  createQuestion('business_ai_2', 'Are there efforts to design inclusive and user-friendly interfaces, accommodate diverse user needs and preferences, and adhere to accessibility standards?', 'Business AI Readiness', 'business'),
  createQuestion('business_ai_3', 'Does AI enhance the organization\'s value proposition, customer segments, or revenue streams as per its business model?', 'Business AI Readiness', 'business'),
  createQuestion('business_ai_4', 'Is there any MVP concept which has been done?', 'Business AI Readiness', 'business'),
  createQuestion('business_ai_5', 'Are there concrete business problems that AI can solve?', 'Business AI Readiness', 'business'),
  createQuestion('business_ai_6', 'Are there identified use cases or applications for AI that align with the organization\'s strategic objectives?', 'Business AI Readiness', 'business'),

  // Product Readiness (5 questions)
  createQuestion('business_product_1', 'Has the company identified use cases for AI pilot projects?', 'Product Readiness', 'business'),
  createQuestion('business_product_2', 'Are there criteria for evaluating the success of these pilot projects?', 'Product Readiness', 'business'),
  createQuestion('business_product_3', 'Do these pilots help in scaling AI practices across the organization?', 'Product Readiness', 'business'),
  createQuestion('business_product_4', 'Are there key performance indicators for pilot projects?', 'Product Readiness', 'business'),
  createQuestion('business_product_5', 'Are there criteria for evaluating the success of these pilot projects?', 'Product Readiness', 'business'),

  // Business Use Case and ROI (6 questions)
  createQuestion('business_roi_1', 'Has the organization conducted a cost-benefit analysis or ROI assessment for potential AI initiatives?', 'Business Use Case and ROI', 'business'),
  createQuestion('business_roi_2', 'Is there a plan for measuring and tracking the impact of AI initiatives on business outcomes?', 'Business Use Case and ROI', 'business'),
  createQuestion('business_roi_3', 'Has the organization conducted a financial feasibility study of AI adoption?', 'Business Use Case and ROI', 'business'),
  createQuestion('business_roi_4', 'Are there projections or forecasts for the economic impact of AI initiatives on revenue, cost savings, or competitive advantage?', 'Business Use Case and ROI', 'business'),
  createQuestion('business_roi_5', 'Are AI initiatives designed to enhance customer experience and engagement across various touchpoints?', 'Business Use Case and ROI', 'business'),
  createQuestion('business_roi_6', 'Are there projections for the economic impact of AI initiatives?', 'Business Use Case and ROI', 'business'),

  // Customer Centric (6 questions)
  createQuestion('business_customer_1', 'Has the organization conducted user research or feedback surveys to understand customer preferences and expectations regarding AI-driven interactions?', 'Customer Centric', 'business'),
  createQuestion('business_customer_2', 'Is there a plan for continuously improving AI-powered products or services based on customer feedback and insights?', 'Customer Centric', 'business'),
  createQuestion('business_customer_3', 'How does the organization leverage AI to enhance its digital marketing and customer engagement strategies?', 'Customer Centric', 'business'),
  createQuestion('business_customer_4', 'Are there personalized marketing campaigns, recommendation engines, chatbots, and other AI-driven tools for delivering targeted content?', 'Customer Centric', 'business'),
  createQuestion('business_customer_5', 'Does the organization have metrics and KPIs in place to measure the performance and impact of AI initiatives?', 'Customer Centric', 'business'),
  createQuestion('business_customer_6', 'How does the organization leverage AI to enhance digital marketing?', 'Customer Centric', 'business'),

  // Performance (3 questions)
  createQuestion('business_performance_1', 'Are there mechanisms for conducting regular reviews and evaluations to assess the effectiveness of AI solutions and make data-driven decisions for improvement?', 'Performance', 'business'),
  createQuestion('business_performance_2', 'Does the organization have mechanisms for monitoring and measuring the performance of AI systems in real-time?', 'Performance', 'business'),
  createQuestion('business_performance_3', 'Has the organization implemented measures to detect and mitigate bias in AI algorithms and decision-making processes?', 'Performance', 'business'),

  // Transparency (4 questions)
  createQuestion('business_transparency_1', 'Are there procedures for auditing AI systems and ensuring fairness, transparency, and accountability in algorithmic outcomes?', 'Transparency', 'business'),
  createQuestion('business_transparency_2', 'Are there mechanisms for conducting algorithmic audits, providing access to model documentation, and facilitating independent reviews?', 'Transparency', 'business'),
  createQuestion('business_transparency_3', 'Are there procedures for auditing AI systems for fairness and transparency?', 'Transparency', 'business'),
  createQuestion('business_transparency_4', 'Does the organization solicit feedback from customers and end-users regarding their experiences with AI-driven products or services?', 'Transparency', 'business'),

  // INFRASTRUCTURE READINESS (30 questions)
  // Project Management and Governance (9 questions)
  createQuestion('infra_pm_1', 'Are there designated project leads or steering committees responsible for decision-making, risk management, and resource allocation?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_2', 'Does the organization follow agile development practices to iteratively build, test, and refine AI solutions?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_3', 'Are there processes for conducting sprint planning, backlog grooming, and retrospective reviews to improve agility and responsiveness?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_4', 'Does the organization have a structured process for collecting and analyzing feedback from AI deployments (e.g., pilot outcomes, user satisfaction)?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_5', 'Does the organization have processes to capture knowledge from AI initiatives?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_6', 'Does the organization have defined metrics (e.g., time-to-scale, cost estimates) for scaling AI initiatives?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_7', 'Does the organization have project management methodologies for AI initiatives?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_8', 'Does the organization have a plan for integrating AI with IT infrastructure?', 'Project Management and Governance', 'infrastructure'),
  createQuestion('infra_pm_9', 'Is there a governance framework to oversee AI initiatives?', 'Project Management and Governance', 'infrastructure'),

  // Risk Management (6 questions)
  createQuestion('infra_risk_1', 'Are there measures in place to mitigate risks related to data privacy, cybersecurity, and algorithmic bias?', 'Risk Management', 'infrastructure'),
  createQuestion('infra_risk_2', 'Does the organization have a process for monitoring and responding to security incidents or breaches involving AI systems?', 'Risk Management', 'infrastructure'),
  createQuestion('infra_risk_3', 'Is the organization equipped to address cybersecurity threats and protect AI systems and data assets from unauthorized access, breaches, or cyberattacks?', 'Risk Management', 'infrastructure'),
  createQuestion('infra_risk_4', 'Are there protocols for secure data storage, transmission, and processing to safeguard sensitive information used in AI applications?', 'Risk Management', 'infrastructure'),
  createQuestion('infra_risk_5', 'Has the organization identified potential risks and security vulnerabilities?', 'Risk Management', 'infrastructure'),
  createQuestion('infra_risk_6', 'Does the organization have a process for responding to security incidents?', 'Risk Management', 'infrastructure'),

  // Innovation (4 questions)
  createQuestion('infra_innovation_1', 'Are there investments in research and development (R&D), technology scouting, and open innovation to explore emerging technologies and drive digital transformation?', 'Innovation', 'infrastructure'),
  createQuestion('infra_innovation_2', 'Are there initiatives or incentives for employees to propose innovative AI projects or ideas?', 'Innovation', 'infrastructure'),
  createQuestion('infra_innovation_3', 'How innovative is the organization in developing AI-driven products and solutions?', 'Innovation', 'infrastructure'),
  createQuestion('infra_innovation_4', 'Does the organization have a structured pipeline for identifying, prototyping, and deploying AI-driven innovations?', 'Innovation', 'infrastructure'),

  // On Premise Readiness (9 questions)
  createQuestion('infra_onprem_1', 'Are there sufficient computational resources and storage, GPU, CPU, TPU capacity for AI model development and deployment?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_2', 'Is the organization prepared for and respond to potential disasters, emergencies, or crises that may impact AI operations?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_3', 'Are there plans for upgrading or expanding AI infrastructure and resources to support future scalability and performance requirements?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_4', 'Is the organization equipped to integrate AI solution software with existing systems, applications, and workflows?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_5', 'Are there standards or protocols in place to ensure interoperability and compatibility with third-party tools or platforms?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_6', 'Are there investments in modern technologies, such as cloud computing, edge computing, IoT, and advanced analytics, to support AI-driven initiatives?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_7', 'Are there strategies for modernizing legacy systems, migrating data, and ensuring interoperability between new AI technologies and legacy IT environments?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_8', 'Does the company have access to AI-specific hardware (e.g., GPUs, TPUs, FPGAs) to support machine learning and deep learning tasks?', 'On Premise Readiness', 'infrastructure'),
  createQuestion('infra_onprem_9', 'Does the organization have the necessary IT infrastructure and resources to support AI initiatives?', 'On Premise Readiness', 'infrastructure'),

  // Cloud Readiness (3 questions)
  createQuestion('infra_cloud_1', 'Are there already cloud applications which the organization is running in a productive environment?', 'Cloud Readiness', 'infrastructure'),
  createQuestion('infra_cloud_2', 'Is the organization leveraging cloud computing or other scalable platforms for AI development and deployment?', 'Cloud Readiness', 'infrastructure'),
  createQuestion('infra_cloud_3', 'Does the organization support hybrid integration (e.g., on-premise and cloud) to enable seamless AI deployment?', 'Cloud Readiness', 'infrastructure'),

  // AI Tools and Technology (9 questions)
  createQuestion('infra_tools_1', 'Does the organization ensure compliance with industry standards and regulations when deploying AI technologies?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_2', 'Is the organization prepared to scale AI initiatives across different business units, regions, or customer segments?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_3', 'Does the organization ensure the quality and reliability of AI systems and applications?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_4', 'Are there considerations for infrastructure scalability, such as cloud computing, edge computing, or distributed computing architectures, to support growing AI workloads?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_5', 'Are there efforts to design inclusive and user-friendly interfaces?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_6', 'Are there methodologies and best practices the organization follows for developing and validating AI models?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_7', 'Are there protocols for model training, testing, and evaluation?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_8', 'Are there standards for interoperability with third-party tools?', 'AI Tools and Technology', 'infrastructure'),
  createQuestion('infra_tools_9', 'Does the organization have a mature MLOps pipeline for automating AI model development, deployment, and monitoring?', 'AI Tools and Technology', 'infrastructure')
];

// Industry benchmarks
export const industryBenchmarks = {
  'Technology': { 
    strategy: 78, culture: 75, business: 75, data: 82, infrastructure: 85, people: 80, governance: 77,
    average: 79, top25: 88, top10: 93
  },
  'Healthcare': { 
    strategy: 65, culture: 63, business: 68, data: 70, infrastructure: 72, people: 66, governance: 70,
    average: 68, top25: 78, top10: 85
  },
  'Financial Services': { 
    strategy: 72, culture: 70, business: 74, data: 78, infrastructure: 80, people: 73, governance: 75,
    average: 75, top25: 84, top10: 90
  },
  'Manufacturing': { 
    strategy: 68, culture: 65, business: 70, data: 65, infrastructure: 75, people: 67, governance: 68,
    average: 68, top25: 79, top10: 86
  },
  'Retail': { 
    strategy: 70, culture: 68, business: 78, data: 68, infrastructure: 72, people: 70, governance: 69,
    average: 71, top25: 81, top10: 87
  },
  'Education': { 
    strategy: 62, culture: 60, business: 65, data: 58, infrastructure: 68, people: 63, governance: 65,
    average: 63, top25: 72, top10: 80
  },
  'Government': { 
    strategy: 58, culture: 56, business: 60, data: 62, infrastructure: 65, people: 59, governance: 68,
    average: 61, top25: 70, top10: 78
  },
  'Other': { 
    strategy: 65, culture: 63, business: 70, data: 68, infrastructure: 72, people: 66, governance: 67,
    average: 67, top25: 78, top10: 84
  }
};

// Calculate assessment results
export function calculateAssessmentResults(data: AssessmentData): AssessmentResults {
  console.log('Calculating assessment results for data:', data);
  
  if (!data || !data.responses) {
    console.error('Invalid assessment data provided:', data);
    throw new Error('Invalid assessment data');
  }
  
  const pillarQuestions = {
    strategy: assessmentQuestions.filter(q => q.pillar === 'strategy'),
    culture: assessmentQuestions.filter(q => q.pillar === 'culture'),
    business: assessmentQuestions.filter(q => q.pillar === 'business'),
    data: assessmentQuestions.filter(q => q.pillar === 'data'),
    infrastructure: assessmentQuestions.filter(q => q.pillar === 'infrastructure'),
    people: assessmentQuestions.filter(q => q.pillar === 'people'),
    governance: assessmentQuestions.filter(q => q.pillar === 'governance')
  };

  console.log('Pillar questions count:', {
    strategy: pillarQuestions.strategy.length,
    culture: pillarQuestions.culture.length,
    business: pillarQuestions.business.length,
    data: pillarQuestions.data.length,
    infrastructure: pillarQuestions.infrastructure.length,
    people: pillarQuestions.people.length,
    governance: pillarQuestions.governance.length
  });

  // Calculate individual pillar scores
  const strategyScore = calculatePillarScore(pillarQuestions.strategy, data.responses);
  const cultureScore = calculatePillarScore(pillarQuestions.culture, data.responses);
  const businessScore = calculatePillarScore(pillarQuestions.business, data.responses);
  const dataScore = calculatePillarScore(pillarQuestions.data, data.responses);
  const infrastructureScore = calculatePillarScore(pillarQuestions.infrastructure, data.responses);
  const peopleScore = calculatePillarScore(pillarQuestions.people, data.responses);
  const governanceScore = calculatePillarScore(pillarQuestions.governance, data.responses);

  console.log('Individual pillar scores:', {
    strategy: strategyScore,
    culture: cultureScore,
    business: businessScore,
    data: dataScore,
    infrastructure: infrastructureScore,
    people: peopleScore,
    governance: governanceScore
  });

  const pillarScores: PillarScore[] = [
    {
      name: 'Strategy & Leadership',
      score: Math.round((strategyScore / 100) * pillarQuestions.strategy.length * 5),
      maxScore: pillarQuestions.strategy.length * 5,
      percentage: strategyScore,
      level: getPerformanceLevel(strategyScore),
      color: '#2563EB'
    },
    {
      name: 'AI Organization & Culture',
      score: Math.round((cultureScore / 100) * pillarQuestions.culture.length * 5),
      maxScore: pillarQuestions.culture.length * 5,
      percentage: cultureScore,
      level: getPerformanceLevel(cultureScore),
      color: '#7C3AED'
    },
    {
      name: 'Business Readiness',
      score: Math.round((businessScore / 100) * pillarQuestions.business.length * 5),
      maxScore: pillarQuestions.business.length * 5,
      percentage: businessScore,
      level: getPerformanceLevel(businessScore),
      color: '#F59E0B'
    },
    {
      name: 'Data Readiness',
      score: Math.round((dataScore / 100) * pillarQuestions.data.length * 5),
      maxScore: pillarQuestions.data.length * 5,
      percentage: dataScore,
      level: getPerformanceLevel(dataScore),
      color: '#10B981'
    },
    {
      name: 'Infrastructure Readiness',
      score: Math.round((infrastructureScore / 100) * pillarQuestions.infrastructure.length * 5),
      maxScore: pillarQuestions.infrastructure.length * 5,
      percentage: infrastructureScore,
      level: getPerformanceLevel(infrastructureScore),
      color: '#EF4444'
    },
    {
      name: 'People & Skills',
      score: Math.round((peopleScore / 100) * pillarQuestions.people.length * 5),
      maxScore: pillarQuestions.people.length * 5,
      percentage: peopleScore,
      level: getPerformanceLevel(peopleScore),
      color: '#06B6D4'
    },
    {
      name: 'AI Governance & Ethics',
      score: Math.round((governanceScore / 100) * pillarQuestions.governance.length * 5),
      maxScore: pillarQuestions.governance.length * 5,
      percentage: governanceScore,
      level: getPerformanceLevel(governanceScore),
      color: '#EC4899'
    }
  ];

  console.log('Pillar scores array:', pillarScores);

  const overallPercentage = Math.round(
    (strategyScore + cultureScore + businessScore + dataScore + infrastructureScore + peopleScore + governanceScore) / 7
  );

  const totalQuestions = pillarQuestions.strategy.length + pillarQuestions.culture.length + 
    pillarQuestions.business.length + pillarQuestions.data.length + 
    pillarQuestions.infrastructure.length + pillarQuestions.people.length + pillarQuestions.governance.length;
  const overallScore = Math.round((overallPercentage / 100) * totalQuestions * 5);
  const overallLevel = getPerformanceLevel(overallPercentage);
  const industryPercentile = Math.round(calculateIndustryPercentile(overallPercentage, data.industry));
  const recommendations = generateRecommendations({
    strategy: strategyScore,
    culture: cultureScore,
    business: businessScore,
    data: dataScore,
    infrastructure: infrastructureScore,
    people: peopleScore,
    governance: governanceScore
  }, data);

  const results = {
    overallScore,
    overallPercentage,
    overallLevel,
    pillarScores,
    industryPercentile,
    recommendations
  };

  console.log('Final assessment results:', results);
  return results;
}

function calculatePillarScore(questions: Question[], responses: Record<string, number>): number {
  const scores = questions.map(q => responses[q.id] || 1);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round((average / 5) * 100);
}

function getPerformanceLevel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Advanced';
  if (score >= 70) return 'Proficient';
  if (score >= 60) return 'Developing';
  if (score >= 50) return 'Basic';
  return 'Needs Improvement';
}

function calculateIndustryPercentile(score: number, industry: string): number {
  const benchmark = industryBenchmarks[industry as keyof typeof industryBenchmarks] || industryBenchmarks.Other;
  const avgIndustryScore = (benchmark.strategy + benchmark.culture + benchmark.business + 
    benchmark.data + benchmark.infrastructure + benchmark.people + benchmark.governance) / 7;
  
  if (score > avgIndustryScore) {
    return Math.min(95, 50 + ((score - avgIndustryScore) / avgIndustryScore) * 45);
  } else {
    return Math.max(5, 50 - ((avgIndustryScore - score) / avgIndustryScore) * 45);
  }
}

function generateRecommendations(pillarScores: { strategy: number; culture: number; business: number; data: number; infrastructure: number; people: number; governance: number; }, data: AssessmentData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Strategy & Leadership recommendations
  if (pillarScores.strategy < 70) {
    recommendations.push({
      pillar: 'Strategy & Leadership',
      category: 'AI Vision Alignment',
      priority: 'High',
      title: 'Develop AI Strategy and Leadership',
      description: 'Establish a clear AI strategy with designated leadership and governance framework aligned with corporate strategy.',
      timeline: '3-6 months'
    });
  }
  
  if (pillarScores.strategy < 60) {
    recommendations.push({
      pillar: 'Strategy & Leadership',
      category: 'Executive Sponsorship',
      priority: 'High',
      title: 'Secure Executive Sponsorship',
      description: 'Ensure executives actively sponsor and communicate AI initiatives across the organization.',
      timeline: '2-4 months'
    });
  }

  // AI Organization & Culture recommendations
  if (pillarScores.culture < 70) {
    recommendations.push({
      pillar: 'AI Organization & Culture',
      category: 'Change Management',
      priority: 'High',
      title: 'Build AI-Ready Culture',
      description: 'Foster a culture of innovation and experimentation that supports AI adoption.',
      timeline: '6-12 months'
    });
  }

  if (pillarScores.culture < 60) {
    recommendations.push({
      pillar: 'AI Organization & Culture',
      category: 'Organizational Alignment',
      priority: 'Medium',
      title: 'Establish Cross-Functional Collaboration',
      description: 'Create channels for collaboration and knowledge sharing across departments.',
      timeline: '3-6 months'
    });
  }

  // Business Readiness recommendations
  if (pillarScores.business < 70) {
    recommendations.push({
      pillar: 'Business Readiness',
      category: 'AI Use Cases',
      priority: 'High',
      title: 'Define AI Business Cases',
      description: 'Identify and validate priority AI use cases with clear ROI frameworks.',
      timeline: '2-4 months'
    });
  }

  if (pillarScores.business < 60) {
    recommendations.push({
      pillar: 'Business Readiness',
      category: 'Innovation Pipeline',
      priority: 'Medium',
      title: 'Integrate AI into Innovation Pipeline',
      description: 'Make AI part of the innovation and product development pipeline.',
      timeline: '3-6 months'
    });
  }

  // Data Readiness recommendations
  if (pillarScores.data < 70) {
    recommendations.push({
      pillar: 'Data Readiness',
      category: 'Data Quality',
      priority: 'High',
      title: 'Improve Data Quality and Governance',
      description: 'Implement data quality solutions and establish clear data governance frameworks.',
      timeline: '3-9 months'
    });
  }

  if (pillarScores.data < 60) {
    recommendations.push({
      pillar: 'Data Readiness',
      category: 'Cybersecurity & Compliance',
      priority: 'High',
      title: 'Strengthen Data Security',
      description: 'Enhance cybersecurity measures and ensure compliance with data protection regulations.',
      timeline: '2-6 months'
    });
  }

  // Infrastructure Readiness recommendations
  if (pillarScores.infrastructure < 70) {
    recommendations.push({
      pillar: 'Infrastructure Readiness',
      category: 'Cloud Readiness',
      priority: 'High',
      title: 'Modernize IT Infrastructure',
      description: 'Invest in cloud computing and scalable infrastructure to support AI workloads.',
      timeline: '6-12 months'
    });
  }

  if (pillarScores.infrastructure < 60) {
    recommendations.push({
      pillar: 'Infrastructure Readiness',
      category: 'AI Tools and Technology',
      priority: 'Medium',
      title: 'Implement MLOps Pipeline',
      description: 'Establish MLOps practices for AI model development, deployment, and monitoring.',
      timeline: '4-8 months'
    });
  }

  // People & Skills recommendations
  if (pillarScores.people < 70) {
    recommendations.push({
      pillar: 'People & Skills',
      category: 'Talent Development',
      priority: 'High',
      title: 'Build AI Talent Pipeline',
      description: 'Invest in AI talent acquisition and upskilling programs for existing employees.',
      timeline: '6-12 months'
    });
  }

  if (pillarScores.people < 60) {
    recommendations.push({
      pillar: 'People & Skills',
      category: 'Training Programs',
      priority: 'Medium',
      title: 'Implement AI Training Programs',
      description: 'Develop comprehensive AI literacy and skills development programs.',
      timeline: '3-9 months'
    });
  }

  // AI Governance & Ethics recommendations
  if (pillarScores.governance < 70) {
    recommendations.push({
      pillar: 'AI Governance & Ethics',
      category: 'Ethical Framework',
      priority: 'High',
      title: 'Establish AI Ethics Framework',
      description: 'Develop and implement responsible AI practices and ethical guidelines.',
      timeline: '3-6 months'
    });
  }

  if (pillarScores.governance < 60) {
    recommendations.push({
      pillar: 'AI Governance & Ethics',
      category: 'Compliance',
      priority: 'High',
      title: 'Ensure Regulatory Compliance',
      description: 'Establish mechanisms for compliance with AI-related regulations and standards.',
      timeline: '2-5 months'
    });
  }

  return recommendations;
}

export const parseAssessmentCSV = (csvText: string): PillarQuestions => {
  const parsed = Papa.parse(csvText, { header: true });
  const questions: PillarQuestions = {};
  parsed.data.forEach((row: any) => {
    if (!row.Pillar || !row.Subcategory || !row.Question) return;
    if (!questions[row.Pillar]) questions[row.Pillar] = {};
    if (!questions[row.Pillar][row.Subcategory]) questions[row.Pillar][row.Subcategory] = [];
    questions[row.Pillar][row.Subcategory].push({
      pillar: row.Pillar,
      subcategory: row.Subcategory,
      question: row.Question,
      maturityLevel: row['Maturity Level'],
      readinessLevel: row['Readiness Level'],
      scoreRange: row['Score Range'],
      recommendation: row.Recommendation
    });
  });
  return questions;
};

export const parseAssessmentCSVUnique = (csvText: string): PillarQuestionsUnique => {
  const parsed = Papa.parse(csvText, { header: true });
  const questions: PillarQuestionsUnique = {};
  parsed.data.forEach((row: any) => {
    if (!row.Pillar || !row.Subcategory || !row.Question) return;
    if (!questions[row.Pillar]) questions[row.Pillar] = {};
    if (!questions[row.Pillar][row.Subcategory]) questions[row.Pillar][row.Subcategory] = [];
    let q = questions[row.Pillar][row.Subcategory].find(q => q.question === row.Question);
    if (!q) {
      q = {
        pillar: row.Pillar,
        subcategory: row.Subcategory,
        question: row.Question,
        recommendations: []
      };
      questions[row.Pillar][row.Subcategory].push(q);
    }
    q.recommendations.push({
      maturityLevel: row['Maturity Level'],
      readinessLevel: row['Readiness Level'],
      scoreRange: row['Score Range'],
      recommendation: row.Recommendation
    });
  });
  return questions;
};
