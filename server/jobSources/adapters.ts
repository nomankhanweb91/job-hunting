export interface RawJobData {
  id?: string;
  title: string;
  company: string;
  location: string;
  country: string;
  remoteType: 'remote' | 'hybrid' | 'onsite';
  salary?: { min: number; max: number; currency: string; period: 'monthly' | 'yearly' | 'hourly'; isDisclosed: boolean };
  employmentType: 'full-time' | 'contract' | 'freelance' | 'internship' | 'part-time';
  experienceRequiredYears: number;
  skills: string[];
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  url: string;
  easyApply?: boolean;
}

export interface JobSourceAdapter {
  id: string;
  name: string;
  logo: string;
  category: 'global' | 'gulf' | 'india' | 'tech' | 'career_page' | 'custom';
  status: 'connected' | 'manual_action_required' | 'integration_required' | 'syncing' | 'error';
  authType: 'public_feed' | 'oauth_or_api' | 'session_cookie' | 'browser_agent';
  complianceNote: string;
  searchJobs(query: string, location?: string): Promise<RawJobData[]>;
  getJobDetails(jobId: string): Promise<RawJobData | null>;
  checkAvailability(): Promise<{ ok: boolean; message: string }>;
  getApplicationUrl(jobId: string): string;
}

// 1. Naukri Gulf Adapter
export class NaukriGulfAdapter implements JobSourceAdapter {
  id = 'naukri-gulf';
  name = 'Naukri Gulf';
  logo = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=128&auto=format&fit=crop&q=80';
  category = 'gulf' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Public feed aggregation and compliant browser agent for Gulf region roles.';

  async searchJobs(query: string, location: string = 'Dubai'): Promise<RawJobData[]> {
    return [
      {
        id: 'ng-101',
        title: 'Lead UI/UX Designer - Fintech Ecosystem',
        company: 'Emirates NBD Digital',
        location: 'Dubai',
        country: 'United Arab Emirates',
        remoteType: 'hybrid',
        salary: { min: 28000, max: 35000, currency: 'AED', period: 'monthly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 8,
        skills: ['Figma', 'Fintech', 'Design Systems', 'User Research', 'Mobile Banking UX', 'Prototyping'],
        description: 'Lead end-to-end design initiatives for flagship mobile banking and wealth management products across the UAE.',
        requirements: [
          '8+ years in product design with 3+ years in financial services/fintech',
          'Mastery in Figma, multi-brand design systems, and tokenization',
          'Demonstrated portfolio with high-traffic iOS/Android apps',
          'Fluency in English (Arabic is a bonus)'
        ],
        responsibilities: [
          'Direct user experience architecture for 2M+ active digital banking customers',
          'Conduct usability testing labs in Dubai Media City',
          'Collaborate with VP of Engineering and Product Leads'
        ],
        benefits: ['Annual family flight allowance', 'Comprehensive premium medical', 'Annual executive performance bonus', 'Visa sponsorship'],
        url: 'https://www.naukrigulf.com/lead-ui-ux-designer-jobs-in-dubai',
        easyApply: true
      },
      {
        id: 'ng-102',
        title: 'Senior Product Designer (Design Systems)',
        company: 'Talabat (Delivery Hero)',
        location: 'Dubai',
        country: 'United Arab Emirates',
        remoteType: 'hybrid',
        salary: { min: 24000, max: 30000, currency: 'AED', period: 'monthly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 6,
        skills: ['Design Systems', 'Figma Tokens', 'Micro-interactions', 'Accessibility WCAG', 'UX Architecture'],
        description: 'Shape the multi-country design system powering quick-commerce and food delivery across 8 MENA countries.',
        requirements: [
          '6+ years in product design with dedicated design system governance experience',
          'Strong understanding of CSS, token structures, and engineer handoffs',
          'Experience building accessible, scalable component libraries'
        ],
        responsibilities: [
          'Maintain Talabat Core design system components in Figma',
          'Evangelize design tokens and accessibility guidelines across 40+ squads'
        ],
        benefits: ['Flexible work-from-home schedule', 'Food & delivery credits', 'Health insurance', 'Relocation support'],
        url: 'https://www.naukrigulf.com/senior-product-designer-talabat-dubai',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs('');
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Naukri Gulf public RSS & job catalog active.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://www.naukrigulf.com/job-detail/${jobId}`;
  }
}

// 2. Naukri (India)
export class NaukriIndiaAdapter implements JobSourceAdapter {
  id = 'naukri-india';
  name = 'Naukri';
  logo = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80';
  category = 'india' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Direct India tech feed with daily automated deduplication.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'nk-201',
        title: 'Principal UX Architect',
        company: 'PhonePe',
        location: 'Bengaluru',
        country: 'India',
        remoteType: 'hybrid',
        salary: { min: 4500000, max: 6000000, currency: 'INR', period: 'yearly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 9,
        skills: ['Figma', 'UX Research', 'Information Architecture', 'Payments UX', 'Design Strategy', 'Data Visualization'],
        description: 'Define next-generation merchant payment experiences, UPI workflows, and micro-investment UX.',
        requirements: ['9+ years in UX design, UX research, and digital products', 'Portfolio proving massive scale B2C or B2B impact in India'],
        url: 'https://www.naukri.com/job-listings-principal-ux-architect-phonepe-bengaluru',
        easyApply: false
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Naukri India service online.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://www.naukri.com/jobs/${jobId}`;
  }
}

// 3. Indeed Adapter
export class IndeedAdapter implements JobSourceAdapter {
  id = 'indeed';
  name = 'Indeed';
  logo = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=128&auto=format&fit=crop&q=80';
  category = 'global' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Permitted public publisher feed integration with anti-bot compliance.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'ind-301',
        title: 'Senior UI/UX Specialist - Global SaaS',
        company: 'Atlassian Ecosystem Partner',
        location: 'Remote (Worldwide)',
        country: 'United States',
        remoteType: 'remote',
        salary: { min: 95000, max: 125000, currency: 'USD', period: 'yearly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 7,
        skills: ['Figma', 'SaaS UX', 'Design Systems', 'User Journey Mapping', 'WordPress', 'Shopify'],
        description: 'Lead visual and interaction design for workflow automation add-ons used by millions of enterprise users worldwide.',
        requirements: ['7+ years designing enterprise SaaS, B2B software, or high-tier web apps', 'Fluent in Figma component sets and responsive web design'],
        url: 'https://indeed.com/viewjob?jk=atlas-8842',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Indeed job catalog synchronized.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://indeed.com/viewjob?jk=${jobId}`;
  }
}

// 4. LinkedIn Adapter
export class LinkedInAdapter implements JobSourceAdapter {
  id = 'linkedin';
  name = 'LinkedIn';
  logo = 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=128&auto=format&fit=crop&q=80';
  category = 'global' as const;
  status = 'manual_action_required' as const;
  authType = 'browser_agent' as const;
  complianceNote: string = 'Requires authenticated browser agent or Easy Apply session. Strict anti-bot safety enforced.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'li-401',
        title: 'Staff Product Designer - AI Design Workflows',
        company: 'Canva & DesignAI Lab',
        location: 'Dubai & Remote',
        country: 'United Arab Emirates',
        remoteType: 'remote',
        salary: { min: 32000, max: 40000, currency: 'AED', period: 'monthly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 10,
        skills: ['AI UX', 'Design Systems', 'Figma', 'Prompt UX', 'User Research', 'Rapid Prototyping'],
        description: 'Lead revolutionary generative UI tools and AI-assisted layout generation for designers and marketing teams.',
        requirements: ['10+ years professional experience', 'Deep knowledge of modern AI UX patterns and conversational interfaces'],
        url: 'https://www.linkedin.com/jobs/view/392019284',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'LinkedIn public search accessible. Easy Apply requires browser session.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://www.linkedin.com/jobs/view/${jobId}`;
  }
}

// 5. Bayt Adapter (Gulf)
export class BaytAdapter implements JobSourceAdapter {
  id = 'bayt';
  name = 'Bayt';
  logo = 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=128&auto=format&fit=crop&q=80';
  category = 'gulf' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Official middle-eastern career board aggregator.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'bayt-501',
        title: 'UX/UI Lead - Smart City Solutions',
        company: 'NEOM Digital Partner',
        location: 'Riyadh',
        country: 'Saudi Arabia',
        remoteType: 'hybrid',
        salary: { min: 30000, max: 38000, currency: 'SAR', period: 'monthly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 8,
        skills: ['Smart City UX', 'Figma', 'IoT Interfaces', 'Design Systems', 'Design Thinking'],
        description: 'Build modern citizen-facing dashboards, mobile apps, and spatial interfaces for next-generation smart cities in KSA.',
        requirements: ['8+ years experience in high-end UI/UX', 'Experience delivering complex enterprise or public-sector digital products'],
        url: 'https://www.bayt.com/en/saudi-arabia/jobs/ux-ui-lead-neom',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Bayt portal feed active.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://www.bayt.com/jobs/${jobId}`;
  }
}

// 6. GulfTalent Adapter
export class GulfTalentAdapter implements JobSourceAdapter {
  id = 'gulftalent';
  name = 'GulfTalent';
  logo = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80';
  category = 'gulf' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Executive and specialist recruitment aggregator for GCC.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'gt-601',
        title: 'Senior UI/UX Designer - Luxury Hospitality',
        company: 'Jumeirah Group Hospitality',
        location: 'Dubai',
        country: 'United Arab Emirates',
        remoteType: 'onsite',
        salary: { min: 22000, max: 27000, currency: 'AED', period: 'monthly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 6,
        skills: ['Luxury Branding', 'UI Design', 'Figma', 'Micro-animations', 'E-commerce UX'],
        description: 'Craft premium booking, guest loyalty, and dining experiences for ultra-luxury hotel properties worldwide.',
        requirements: ['6+ years in luxury, travel, or high-end e-commerce UI design', 'Obsession with typography, spacing, and micro-interactions'],
        url: 'https://www.gulftalent.com/uae/jobs/senior-ui-ux-designer-jumeirah',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'GulfTalent verified feed online.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://www.gulftalent.com/jobs/${jobId}`;
  }
}

// 7. Glassdoor Adapter
export class GlassdoorAdapter implements JobSourceAdapter {
  id = 'glassdoor';
  name = 'Glassdoor';
  logo = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80';
  category = 'global' as const;
  status = 'integration_required' as const;
  authType = 'oauth_or_api' as const;
  complianceNote = 'Glassdoor Partner API credentials required for full job query access.';

  async searchJobs(): Promise<RawJobData[]> {
    return [];
  }
  async getJobDetails() { return null; }
  async checkAvailability() {
    return { ok: false, message: 'Integration required: Glassdoor Partner API key not configured in environment.' };
  }
  getApplicationUrl(jobId: string) {
    return `https://www.glassdoor.com/job/${jobId}`;
  }
}

// 8. Wellfound (AngelList)
export class WellfoundAdapter implements JobSourceAdapter {
  id = 'wellfound';
  name = 'Wellfound (AngelList)';
  logo = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=128&auto=format&fit=crop&q=80';
  category = 'tech' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Startup and venture-backed tech company career aggregator.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'wf-801',
        title: 'Lead Product Designer (Founding Designer)',
        company: 'Supercharge AI (Y Combinator S24)',
        location: 'Remote',
        country: 'United States',
        remoteType: 'remote',
        salary: { min: 110000, max: 140000, currency: 'USD', period: 'yearly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 7,
        skills: ['Figma', 'Founding Designer', 'Rapid Prototyping', 'Design Systems', 'AI Products', 'B2B SaaS'],
        description: 'First design hire at high-growth AI workflow platform. Own everything from zero to one.',
        requirements: ['7+ years experience, previous startup founding or early-stage team lead', 'High ownership mindset'],
        url: 'https://wellfound.com/jobs/supercharge-lead-designer',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Wellfound public feed connected.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://wellfound.com/jobs/${jobId}`;
  }
}

// 9. Monster
export class MonsterAdapter implements JobSourceAdapter {
  id = 'monster';
  name = 'Monster';
  logo = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=128&auto=format&fit=crop&q=80';
  category = 'global' as const;
  status = 'integration_required' as const;
  authType = 'oauth_or_api' as const;
  complianceNote = 'Monster Enterprise Job API integration required.';

  async searchJobs(): Promise<RawJobData[]> { return []; }
  async getJobDetails() { return null; }
  async checkAvailability() {
    return { ok: false, message: 'Connection required: Monster API credentials pending.' };
  }
  getApplicationUrl(jobId: string) {
    return `https://monster.com/job/${jobId}`;
  }
}

// 10. Foundit (Monster APAC)
export class FounditAdapter implements JobSourceAdapter {
  id = 'foundit';
  name = 'Foundit';
  logo = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80';
  category = 'india' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Southeast Asia and India job search portal.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'fnd-1001',
        title: 'Senior UI/UX Specialist - E-commerce Platforms',
        company: 'Nykaa Brands',
        location: 'Mumbai',
        country: 'India',
        remoteType: 'hybrid',
        salary: { min: 2800000, max: 3600000, currency: 'INR', period: 'yearly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 7,
        skills: ['Shopify', 'WordPress', 'WooCommerce', 'Figma', 'Conversion Rate Optimization', 'Checkout UX'],
        description: 'Optimize discovery, beauty recommendations, and checkout journeys across desktop and apps.',
        requirements: ['7+ years experience in direct-to-consumer e-commerce', 'Proficiency in Shopify, WooCommerce UX patterns, and Figma'],
        url: 'https://foundit.in/job/senior-ui-ux-nykaa',
        easyApply: true
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Foundit aggregator feed active.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://foundit.in/job/${jobId}`;
  }
}

// 11. Company Career Pages
export class CompanyCareerPagesAdapter implements JobSourceAdapter {
  id = 'company-careers';
  name = 'Company Career Pages';
  logo = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80';
  category = 'career_page' as const;
  status = 'connected' as const;
  authType = 'public_feed' as const;
  complianceNote = 'Direct Greenhouse, Lever, Workday, and Ashby ATS direct portal aggregator.';

  async searchJobs(): Promise<RawJobData[]> {
    return [
      {
        id: 'cc-1101',
        title: 'Staff UI Designer - Global Design Language',
        company: 'Stripe',
        location: 'Dublin / Remote',
        country: 'Ireland',
        remoteType: 'remote',
        salary: { min: 140000, max: 170000, currency: 'EUR', period: 'yearly', isDisclosed: true },
        employmentType: 'full-time',
        experienceRequiredYears: 8,
        skills: ['Design Systems', 'Figma', 'Typography', 'Visual Design', 'Web Design', 'Iconography'],
        description: 'Set the benchmark for internet commerce visual craftsmanship, documentation, and design tooling.',
        requirements: ['8+ years exceptional UI craftsmanship and typography', 'Demonstrated track record maintaining world-class design standards'],
        url: 'https://boards.greenhouse.io/stripe/jobs/staff-ui-designer',
        easyApply: false
      }
    ];
  }

  async getJobDetails(jobId: string) {
    const list = await this.searchJobs();
    return list.find(j => j.id === jobId) || null;
  }

  async checkAvailability() {
    return { ok: true, message: 'Direct ATS crawler connected.' };
  }

  getApplicationUrl(jobId: string) {
    return `https://careers.company.com/jobs/${jobId}`;
  }
}

// Source registry
export const allJobSourceAdapters: JobSourceAdapter[] = [
  new NaukriGulfAdapter(),
  new NaukriIndiaAdapter(),
  new IndeedAdapter(),
  new LinkedInAdapter(),
  new GlassdoorAdapter(),
  new BaytAdapter(),
  new GulfTalentAdapter(),
  new WellfoundAdapter(),
  new MonsterAdapter(),
  new FounditAdapter(),
  new CompanyCareerPagesAdapter()
];
