"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';

import { API_BASE_URL } from "@/lib/api";

/**
 * Task Categories Admin - Manage dynamic task category pages
 */
const TaskCategoriesAdmin = () => {
  // Category options
  const taskerCategories = [
    "Accountant Tasks",
    "Admin Assistant Tasks",
    "Appliance Repair Tasks",
    "Architect Tasks",
    "Auto Electrician Tasks",
    "AV Specialist Tasks",
    "Barista Tasks",
    "Bartender Tasks",
    "Bricklayer Tasks",
    "Cabinet Maker Tasks",
    "Car Wash Tasks",
    "Carpenter Tasks",
    "Carpet Cleaner Tasks",
    "Caterer Tasks",
    "Chef Tasks",
    "Cleaner Tasks",
    "Clothing Alteration Tasks",
    "Commercial Cleaner Tasks",
    "Concreter Tasks",
    "Cooking Tasks",
    "Copywriter Tasks",
    "Courier Services Tasks",
    "Data Entry Specialist Tasks",
    "Decking Tasks",
    "Delivery Tasks",
    "Designer Tasks",
    "Digital Design Tasks",
    "Drafting Tasks",
    "Driving Tasks",
    "End of Lease Cleaner Tasks",
    "Engraving Tasks",
    "Entertainment Tasks",
    "Events Staff Tasks",
    "Fencing Tasks",
    "Flooring Tasks",
    "Food Delivery Tasks",
    "Furniture Assembler Tasks",
    "Gardener Tasks",
    "General Labour Tasks",
    "Graffiti Artist Tasks",
    "Grocery Delivery Tasks",
    "Handyman Tasks",
    "HIIT Trainer Tasks",
    "House Cleaner Tasks",
    "Housekeeper Tasks",
    "Interior Designer Tasks",
    "IT Support Tasks",
    "Landscaper Tasks",
    "Locksmith Tasks",
    "Logo Designer Tasks",
    "Makeup Artist Tasks",
    "Marketing Tasks",
    "Mechanic Tasks",
    "Mobile Bike Repair Tasks",
    "Office Cleaner Tasks",
    "Painter Tasks",
    "Paver Tasks",
    "Pest Controller Tasks",
    "Pet Groomer Tasks",
    "Pet Minder Tasks",
    "Pilates Instructor Tasks",
    "Plasterer Tasks",
    "Project Management Tasks",
    "Proofreader Tasks",
    "Property Maintenance Tasks",
    "Receptionist Tasks",
    "Removalist Tasks",
    "Research Assistant Tasks",
    "Resume Writer Tasks",
    "Roofing Tasks",
    "Rubbish Removal Tasks",
    "Tradesman Tasks",
    "Translator Tasks",
    "Turf Laying Tasks",
    "Tutor Tasks",
    "Virtual Assistant Tasks",
    "Wait Staff Tasks",
    "Waterproofing Tasks",
    "Web Design & Developer Tasks",
    "Wedding Services Tasks",
    "Window Cleaner Tasks",
    "Yoga Instructor Tasks"
  ];
  

  const posterCategories = [
    "Accountants Services",
    "Admin Services",
    "Alterations Services",
    "Appliances Services",
    "Assembly Services",
    "Auto Electricians Services",
    "Bakers Services",
    "Barbers Services",
    "Beauticians Services",
    "Bicycle Service Services",
    "Bricklaying Services",
    "Building & Construction Services",
    "Business Services",
    "Car Body Work Services",
    "Car Detailing Services",
    "Car Repair Services",
    "Car Service Services",
    "Carpentry Services",
    "Cat Care Services",
    "Catering Services",
    "Chef Services",
    "Cladding Services",
    "Cleaning Services",
    "Computers & IT Services",
    "Concreting Services",
    "Decking Services",
    "Delivery Services",
    "Design Services",
    "Dog Care Services",
    "Draftsman Services",
    "Driving Services",
    "Electricians Services",
    "Entertainment Services",
    "Events Services",
    "Fencing Services",
    "Flooring Services",
    "Florist Services",
    "Furniture Assembly Services",
    "Gardening Services",
    "Gate Installation Services",
    "Hairdressers Services",
    "Handyman Services",
    "Heating & Cooling Services",
    "Home Automation and Security Services",
    "Home Theatre Services",
    "Interior Designer Services",
    "Landscaping Services",
    "Laundry Services",
    "Lawn Care Services",
    "Lessons Services",
    "Locksmith Services",
    "Makeup Artist Services",
    "Marketing Services",
    "Mobile Mechanic Services",
    "Painting Services",
    "Paving Services",
    "Pest Control Services",
    "Pet Care Services",
    "Photographers Services",
    "Plasterer Services",
    "Plumbing Services",
    "Pool Maintenance Services",
    "Removals Services",
    "Roofing Services",
    "Sharpening Services",
    "Staffing Services",
    "Tailors Services",
    "Tattoo Artists Services",
    "Tiling Services",
    "Tradesman Services",
    "Tutoring Services",
    "Wall Hanging & Mounting Services",
    "Wallpapering Services",
    "Waterproofing Services",
    "Web Services",
    "Wheel & Tyre Service Services",
    "Writing Services"
  ];
  

  // Subcategory mapping - maps category names to their subcategories
  const subcategoriesMap = {
    "Accountant Tasks": ["Financial Modelling", "Financial Planning", "Financial Reporting"],
  
    "Admin Assistant Tasks": ["Data Entry", "Office Work", "Personal Assistant", "Research Assistant", "Virtual Assistant"],
  
    "Appliance Repair Tasks": ["Wedding Dress Alterations"],
  
    "Architect Tasks": ["Appliance Repair", "Coffee Machine Repairs", "Fridge Repair & Installation", "Gas Fitters", "Gas Oven Repair and Installation", "Vacuum Cleaner Repair", "Washing Machine Repairs & Installation"],
  
    "Auto Electrician Tasks": ["House Renovation"],
  
    "AV Specialist Tasks": ["Trampoline Assembly"],
  
    "Barista Tasks": ["Music Production", "Video Editing", "Videographers"],
  
    "Bartender Tasks": ["Reversing Camera Installation", "UHF Radio Installations"],
  
    "Bricklayer Tasks": ["Mobile Barbers"],
  
    "Cabinet Maker Tasks": ["Eyebrow Waxing", "Nail Technicians"],
  
    "Car Wash Tasks": [],
  
    "Carpenter Tasks": ["Demolition", "Drafting", "Driveway Repair", "Driveway Sealing", "Feature Walls", "Patios", "Plunge Pool"],
  
    "Carpet Cleaner Tasks": [],
  
    "Caterer Tasks": ["Banquet Catering"],
  
    "Chef Tasks": ["Private Chef"],
  
    "Cleaner Tasks": ["Airbnb Cleaning", "End of Lease Cleaning", "Housekeepers", "Maid Service", "Office Cleaning", "Oven Cleaning", "Upholstery Cleaning"],
  
    "Clothing Alteration Tasks": ["Dressmakers", "Sewing", "Zipper Repair and Replacement"],
  
    "Commercial Cleaner Tasks": [],
  
    "Concreter Tasks": ["Concrete Cutting"],
  
    "Cooking Tasks": [],
  
    "Copywriter Tasks": ["Copywriting", "Content Creation", "Blog Writing", "Academic Writing", "Report Writing"],
  
    "Courier Services Tasks": [],
  
    "Data Entry Specialist Tasks": ["Data Entry"],
  
    "Decking Tasks": ["Deck Repair", "Deck Sanding"],
  
    "Delivery Tasks": [],
  
    "Designer Tasks": ["3D Modelling", "3D Rendering", "Animation", "Graphic Designers", "Logo Design", "Packaging Design", "UX Design"],
  
    "Digital Design Tasks": ["Digital Design"],
  
    "Drafting Tasks": ["Drafting"],
  
    "Driving Tasks": [],
  
    "End of Lease Cleaner Tasks": ["End of Lease Cleaning"],
  
    "Engraving Tasks": [],
  
    "Entertainment Tasks": ["Clown", "DJ", "Dancer", "Face Painting", "Magician", "Singer"],
  
    "Events Staff Tasks": ["Event Security"],
  
    "Fencing Tasks": ["Temporary Fencing"],
  
    "Flooring Tasks": ["Timber Flooring"],
  
    "Food Delivery Tasks": [],
  
    "Furniture Assembler Tasks": ["Chair Repair", "Recliner Chair Repair", "Upholstery Repair"],
  
    "Gardener Tasks": ["Garden Designers", "Garden Edging", "Shrub & Bush Trimming"],
  
    "General Labour Tasks": ["General Labour"],
  
    "Graffiti Artist Tasks": ["Graffiti Artist"],
  
    "Grocery Delivery Tasks": ["Aldi Grocery Delivery", "Coles Grocery Delivery", "Woolworths Delivery"],
  
    "Handyman Tasks": [
      "Ceiling Fan Installation",
      "Chandelier Installation",
      "Clock Repair",
      "General Labour",
      "Pressure Washer Repair",
      "Render Repair",
      "Ring Doorbell Installation",
      "Toilet Seat Fitting",
      "Treadmill Repair"
    ],
  
    "HIIT Trainer Tasks": ["HIIT Training"],
  
    "House Cleaner Tasks": [],
  
    "Housekeeper Tasks": ["Housekeepers"],
  
    "Interior Designer Tasks": [],
  
    "IT Support Tasks": [
      "Android App Development",
      "App Development",
      "Computer Repairs",
      "Data Recovery",
      "IT Support",
      "Microsoft Onenote Help",
      "Mobile App Development",
      "Software Development",
      "Technical Support",
      "iOS Development"
    ],
  
    "Landscaper Tasks": [
      "Boring Excavation",
      "Earthmoving Contractors",
      "Hedging",
      "Irrigation Repair",
      "Landscape Designers"
    ],
  
    "Locksmith Tasks": [],
  
    "Logo Designer Tasks": ["Logo Design"],
  
    "Makeup Artist Tasks": ["Hair Stylist"],
  
    "Marketing Tasks": [
      "Advertising",
      "Content Marketing",
      "Digital Marketing",
      "Digital Media",
      "Email Marketing",
      "Facebook Marketing",
      "Focus Group Candidates",
      "Google Adwords Management",
      "Market Research",
      "Marketing Strategy",
      "Mystery Shopping",
      "PR",
      "Search Engine Marketing",
      "Social Media Marketing & Management"
    ],
  
    "Mechanic Tasks": ["Brake Pad Replacement", "Head Unit Installation", "Light Bar Installation"],
  
    "Mobile Bike Repair Tasks": ["Mobile Bike Repair"],
  
    "Office Cleaner Tasks": ["Office Cleaning"],
  
    "Painter Tasks": ["Fence Painting", "Furniture Painting", "Interior Painting"],
  
    "Paver Tasks": [],
  
    "Pest Controller Tasks": [],
  
    "Pet Groomer Tasks": ["Pet Grooming"],
  
    "Pet Minder Tasks": ["Pet Minding", "Pet Sitting"],
  
    "Pilates Instructor Tasks": ["Pilates Instructor"],
  
    "Plasterer Tasks": ["Plaster Repair"],
  
    "Project Management Tasks": ["Project Management"],
  
    "Proofreader Tasks": ["Proofreading"],
  
    "Property Maintenance Tasks": ["Property Maintenance"],
  
    "Receptionist Tasks": ["Receptionist"],
  
    "Removalist Tasks": [
      "Appliance Removals",
      "Brisbane to Sydney Removals",
      "Interstate Removals",
      "Man With a Van",
      "Melbourne to Sydney Removals",
      "Shed Removals",
      "Sofa Removals",
      "Sydney to Brisbane Removals",
      "Sydney to Melbourne Removals"
    ],
  
    "Research Assistant Tasks": ["Research Assistant"],
  
    "Resume Writer Tasks": ["Resume Writing"],
  
    "Roofing Tasks": ["Flat Roofing", "Gutter Cleaning", "Insulation", "Roof Installation"],
  
    "Rubbish Removal Tasks": [
      "Asbestos Removal",
      "Dishwasher Removal",
      "Fridge Removal & Disposal",
      "Pallet Collection & Disposal",
      "Skip Hire",
      "Sofa Removal and Disposal",
      "Soil Removal",
      "Trampoline Removal",
      "Washing Machine Removal",
      "White Goods Removal"
    ],
  
    "Tradesman Tasks": ["Balustrading", "Rendering & Resurfacing", "Sauna Installation"],
  
    "Translator Tasks": ["Spanish Translation"],
  
    "Turf Laying Tasks": ["Turf Laying"],
  
    "Tutor Tasks": [
      "Accounting Tutor",
      "Art Tutor",
      "Biology Tutor",
      "Engineering Tutor",
      "English Tutor",
      "Environment Science Tutor",
      "Maths Tutor",
      "Physics Tutor",
      "Public Speaking",
      "Science Tutor"
    ],
  
    "Virtual Assistant Tasks": ["Virtual Assistant"],
  
    "Wait Staff Tasks": ["Wait Staff", "Waiter", "Waitress"],
  
    "Waterproofing Tasks": [],
  
    "Web Design & Developer Tasks": [
      "Bootstrap Developer",
      "CMS Developer",
      "CSS Developer",
      "Database Developer",
      "HTML Developer",
      "Java Developer",
      "Javascript Developer",
      "Joomla Developer",
      "Magento Developer",
      "MySQL Developer",
      "PHP Developer",
      "Programming",
      "SQL Developer",
      "Shopify Developer",
      "Squarespace Developer",
      "VBA Developer",
      "Web Design & Development",
      "Web Hosting",
      "Website & App Testing",
      "jQuery Developer"
    ],
  
    "Wedding Services Tasks": ["Wedding Photographers", "Wedding Videographer"],
  
    "Window Cleaner Tasks": [],
  
    "Yoga Instructor Tasks": ["Yoga Instructor"]
  };
  

  // Form state
  const [formData, setFormData] = useState({
    categoryType: "", // "As A Tasker" or "As A Poster"
    name: "",
    subcategory: "",
    subcategorySlug: "",
    slug: "",
    heroTitle: "",
    heroDescription: "",
    heroImage: "",
    imageFile: null, // For file upload
    defaultEarnings: "₹1,039",
    earningsPeriod: "per month",
    earnings1to2: "₹1,039",
    earnings3to5: "₹2,598",
    earnings5plus: "₹3,637",
    location: "India",
    disclaimer: "Based on average accounting task prices. Actual marketplace earnings may vary",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
    // Earnings card
    earningsCard: {
      weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
      monthly: { "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637+" },
      yearly: { "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680+" },
    },
    // Earnings by job types (simplified for now)
    earningsByJobTypes: {},
    // Why Join Extrahand Section
    whyJoinTitle: "Why join Extrahand",
    whyJoinFeatures: [
      {
        title: "All on your terms",
        description: "See a job that fits your skills and timeframe? Go for it. Extrahand's flexible to your schedule."
      },
      {
        title: "Get going for free",
        description: "Check tasks and get going straight away. Services fees occur when you've completed the task."
      },
      {
        title: "Secure payments",
        description: "Nobody likes chasing money, so we secure customer payments upfront. When a task is marked complete, your bank account will know about it."
      },
      {
        title: "Skills can thrill",
        description: "Never thought your knack for crocheting would be useful? Think again. We're all about earning from unexpected skills at Extrahand."
      }
    ],
    whyJoinButtonText: "Join Extrahand",
    // Task Section
    staticTasksSectionTitle: "",
    staticTasksSectionDescription: "Check out what tasks people want done near you right now...",
    staticTasks: [],
    browseAllTasksButtonText: "Browse all tasks",
    lastUpdatedText: "Last updated on 4th Dec 2025",
    // Earning Potential Section
    earningPotentialTitle: "Discover your earning potential in India",
    earningPotentialDescription: "Earn money with every accounting task",
    earningPotentialButtonText: "Join Extrahand",
    earningPotentialData: {
      weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
      monthly: { "1-2": "₹1039", "3-5": "₹2598", "5+": "₹3637+" },
      yearly: { "1-2": "₹12480", "3-5": "₹31200", "5+": "₹43680+" },
    },
    earningPotentialDisclaimer: "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
    // Income Opportunities Section
    incomeOpportunitiesTitle: "Unlock new income opportunities in India",
    incomeOpportunitiesDescription: "Explore accounting related tasks and discover your financial opportunities",
    incomeOpportunitiesData: {
      weekly: [
        { jobType: "Accounting", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
        { jobType: "Tax Accountants", "1-2": "₹220", "3-5": "₹550", "5+": "₹770" },
        { jobType: "XERO Accounting", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
        { jobType: "Bookkeeping", "1-2": "₹200", "3-5": "₹500", "5+": "₹700" },
        { jobType: "MYOB Accountant", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
        { jobType: "XERO Training", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
        { jobType: "Payroll Accountant", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
        { jobType: "BAS Accounting", "1-2": "₹154", "3-5": "₹385", "5+": "₹539" },
        { jobType: "Tax Advisor", "1-2": "₹178", "3-5": "₹445", "5+": "₹623" },
        { jobType: "MYOB Training", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
      ],
      monthly: [
        { jobType: "Accounting", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
        { jobType: "Tax Accountants", "1-2": "₹953", "3-5": "₹2,382", "5+": "₹3,334" },
        { jobType: "XERO Accounting", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
        { jobType: "Bookkeeping", "1-2": "₹866", "3-5": "₹2,165", "5+": "₹3,031" },
        { jobType: "MYOB Accountant", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
        { jobType: "XERO Training", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
        { jobType: "Payroll Accountant", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
        { jobType: "BAS Accounting", "1-2": "₹667", "3-5": "₹1,667", "5+": "₹2,334" },
        { jobType: "Tax Advisor", "1-2": "₹771", "3-5": "₹1,927", "5+": "₹2,698" },
        { jobType: "MYOB Training", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
      ],
      yearly: [
        { jobType: "Accounting", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
        { jobType: "Tax Accountants", "1-2": "₹11,440", "3-5": "₹28,600", "5+": "₹40,040" },
        { jobType: "XERO Accounting", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
        { jobType: "Bookkeeping", "1-2": "₹10,400", "3-5": "₹26,000", "5+": "₹36,400" },
        { jobType: "MYOB Accountant", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
        { jobType: "XERO Training", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
        { jobType: "Payroll Accountant", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
        { jobType: "BAS Accounting", "1-2": "₹8,008", "3-5": "₹20,020", "5+": "₹28,028" },
        { jobType: "Tax Advisor", "1-2": "₹9,256", "3-5": "₹23,140", "5+": "₹32,396" },
        { jobType: "MYOB Training", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
      ],
    },
    incomeOpportunitiesDisclaimer: "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
    // How to Earn Money Section
    howToEarnTitle: "How to earn money on Extrahand",
    howToEarnSteps: [
      {
        image: "",
        subtitle: "Job opportunities that find you",
        description: "Set up notifications and be alerted when a nearby, well-matched job is posted. Let customers book you directly by setting up a listing. Provide a great service and work with them again with Contacts.",
      },
      {
        image: "",
        subtitle: "Set your price",
        description: "Found a job you're up for? Set your price and make an offer. You can adjust and discuss it later if you need to.",
      },
      {
        image: "",
        subtitle: "Work. Get paid. Quickly.",
        description: "When tasks are complete, request for payment to be released and money will appear in your account instantly.",
      },
    ],
    howToEarnButtonText: "Post a task",
    // Image files for how to earn section
    howToEarnImageFiles: [null, null, null],
    // Tasks array
    tasks: [],
    // Get Inspired Section
    getInspiredTitle: "Get Inspired: Top Accounting Taskers in India",
    getInspiredButtonText: "Join Extrahand",
    topTaskers: [
      {
        meetText: "meet",
        profileImage: "",
        profileImageFile: null,
        name: "Nathalia MID",
        yearsOnExtrahand: "3 years on Extrahand",
        location: "Ultimo NSW",
        rating: "5",
        overallRatingText: "Overall rating",
        reviewsCount: "46 reviews",
        completionRate: "98.11%",
        completionRateText: "Completion rate",
        tasksCount: "53 tasks",
      },
      {
        meetText: "meet",
        profileImage: "",
        profileImageFile: null,
        name: "Muhammad omar MID",
        yearsOnExtrahand: "8 years on Extrahand",
        location: "Clayton VIC",
        rating: "4.9",
        overallRatingText: "Overall rating",
        reviewsCount: "1140 reviews",
        completionRate: "99.93%",
        completionRateText: "Completion rate",
        tasksCount: "1382 tasks",
      },
      {
        meetText: "meet",
        profileImage: "",
        profileImageFile: null,
        name: "Emma-lee SID",
        yearsOnExtrahand: "8 years on Extrahand",
        location: "Springfield Lakes QLD",
        rating: "4.9",
        overallRatingText: "Overall rating",
        reviewsCount: "118 reviews",
        completionRate: "95.68%",
        completionRateText: "Completion rate",
        tasksCount: "162 tasks",
      },
    ],
    // We've Got You Covered Section
    insuranceCoverTitle: "We've got you covered",
    insuranceCoverDescription: "Whether you're a posting a task or completing a task, you can do both with the peace of mind that Extrahand is there to support.",
    insuranceCoverButtonText: "Extrahand's insurance cover",
    insuranceCoverFeatures: [
      {
        icon: "human", // "human" for human icon
        subtitle: "Public liability insurance",
        subdescription: "Extrahand Insurance covers you for any accidental injury to the customer or property damage whilst performing certain task activities",
      },
      {
        icon: "star", // "star" for star icon
        subtitle: "Top rated insurance",
        subdescription: "Extrahand Insurance is provided by Chubb Insurance India Limited, one of the world's most reputable, stable and innovative",
      },
    ],
    // Top Accounting related questions Section
    questionsTitle: "",
    questions: [
      {
        subtitle: "How much can I earn as a freelance bookkeeper or accountant on Airtasker?",
        description: "Most bookkeepers on Extrahand earn between ₹100 and ₹250 per task, depending on the scope. Quick tasks like reconciling Xero accounts or helping with BAS can sit around ₹100–₹150, while more involved tasks like setting up business accounts or doing a full tax return often land in the ₹200–₹600+ range. Offering a clear quote and explaining what's included can help win more tasks.",
      },
      {
        subtitle: "What types of bookkeeping and accounting tasks are most in demand?",
        description: "There's strong demand for help with Xero setup, reconciling accounts, preparing BAS, and completing tax returns—especially for small business owners and sole traders. You'll also see tasks like \"check my expenses in a spreadsheet,\" \"fix overdue taxes,\" or \"help me get my ABN sorted.\" Clients often need a mix of compliance and catch-up help, and they value clear, no-fuss communication.",
      },
      {
        subtitle: "Is there more demand for bookkeeping services at tax time?",
        description: "Absolutely! Around EOFY (June–August) and again during BAS quarters, task volume tends to spike. Many customers will post last-minute jobs like \"Need tax agent this weekend\" or \"Help me lodge 3 years of returns.\" It's a great time to update your availability and reply quickly to listings.",
      },
      {
        subtitle: "What do customers usually look for when hiring a bookkeeper or tax agent?",
        description: "They're often after someone who can \"explain things clearly,\" \"sort it fast,\" or \"clean up my books.\" Credentials like being a registered BAS or tax agent help, but so does being responsive and approachable. Clients love when you make things feel easy, especially if they're stressed or behind on their taxes.",
      },
      {
        subtitle: "How should I price services like tax returns, Xero setup, or business advice?",
        description: "For solo returns or one-off reconciliations, Taskers typically charge ₹100–₹200. Full company tax returns or multi-year catch-ups can go up to ₹600 or more, depending on the complexity. For advisory or setup tasks (like \"set up invoicing in Xero\" or \"build me a cash flow report\"), pricing by the hour (₹50–₹100/hr) or offering package rates often works well.",
      },
      {
        subtitle: "What tools or software should I be familiar with to get more jobs?",
        description: "Xero is by far the most requested, but MYOB, QuickBooks, and basic Excel come up regularly too. Knowing how to reconcile transactions, run reports, and manage payroll inside these platforms is a big plus. Customers often say things like \"need someone good with Xero\" or \"help me automate reports\"—so mentioning these tools in your profile helps you show up in searches.",
      },
      {
        subtitle: "How can I increase my earnings by offering bundled services or ongoing support?",
        description: "One-off jobs are great, but many clients need ongoing support. You could offer monthly packages for \"bookkeeping plus BAS,\" or bundle services like \"Xero setup + one hour of training.\" Regular gigs often come from jobs where the customer says things like \"need someone reliable long-term\" or \"might need this every quarter.\" After completing a job, don't be afraid to offer follow-up support—they'll appreciate it.",
      },
      {
        subtitle: "Do customers prefer in-person or remote bookkeeping and tax help?",
        description: "Most jobs can be done remotely, especially things like spreadsheets, tax returns, and software setup. But some clients still ask for \"in-person\" help, especially if they have paper receipts or need someone to \"come to the office for a few hours.\" Make it clear in your profile if you're available for remote, in-person, or hybrid—being flexible opens up more opportunities.",
      },
    ],
    // Ways to earn money with accounting tasks section
    waysToEarnTitle: "Ways to earn money with accounting tasks on Extrahand",
    waysToEarnContent: [
      {
        heading: "",
        text: "Accounting isn't just about crunching numbers — it's about helping individuals and businesses stay financially healthy, organised, and compliant. On Extrahand, there's steady demand for accountants and bookkeepers who can provide support on everything from day-to-day record-keeping to complex tax returns.\n\nMany of these tasks can be done remotely, giving you the flexibility to build a client base from home while working around your own schedule. Others may require on-site visits, particularly when a client needs help setting up systems or organising paperwork.",
      },
      {
        heading: "Bookkeeping and day-to-day finance management",
        text: "Bookkeeping is one of the most common requests on Extrahand, and it forms the foundation of financial management for many clients. Small businesses, sole traders, and even busy households often need someone to keep track of expenses, reconcile bank accounts, and maintain accurate financial records.\n\nThese tasks might involve entering receipts into accounting software, matching transactions, or setting up systems that make it easier for the client to stay on top of things in the future. Having experience with popular platforms like Xero, MYOB, or QuickBooks is a major advantage, as many clients are already using these tools.",
      },
      {
        heading: "Tax preparation and BAS services",
        text: "Tax season is one of the busiest times for accounting tasks on Extrahand. Individuals often look for help lodging their tax returns, while businesses may need support with BAS statements, GST reporting, or end-of-year financial statements. For registered tax agents and BAS agents, this is an excellent way to connect with clients who may later come back for broader financial services. The ability to explain tax obligations in simple, jargon-free language is a valuable skill, as many people find the process overwhelming.",
      },
      {
        heading: "Payroll and employee management",
        text: "Payroll is another area where businesses often turn to Extrahand for help. Even a small team requires accurate wage calculations, superannuation contributions, leave tracking, and compliance with Fair Work and ATO rules. Mistakes in payroll can have serious legal and financial consequences, so clients are eager to hire accountants who are thorough and experienced. Additionally, managing PAYG withholding, preparing BAS or IAS lodgements, reconciling payroll tax obligations, and ensuring proper reporting to the ATO all demand strong tax knowledge to keep businesses compliant.",
      },
      {
        heading: "System setup and advisory work",
        text: "Some clients aren't just looking for help with ongoing tasks but need assistance setting up their systems correctly from the start. This could mean moving from manual spreadsheets to a cloud-based platform, integrating point-of-sale systems with accounting software, or setting up invoicing and payment processes. Advisory tasks like these are highly valued because they save clients time and headaches in the long run.",
      },
      {
        heading: "Tips to increase your accounting income",
        text: "To maximise your opportunities on Extrahand, keep your profile detailed and professional. Highlight your qualifications, registrations, and areas of expertise so potential clients can see your credibility at a glance. Sharing testimonials, case studies, or examples of the types of businesses you've helped can also make a strong impression.\n\nSince accounting often involves handling sensitive information, trustworthiness is just as important as skill, so be clear about your professional standards. You might also outline your security practices, communication style, turnaround times, and commitment to accuracy to reassure clients that their finances are in reliable hands.",
      },
    ],
    // Explore other ways to earn money section
    exploreOtherWaysTitle: "Explore other ways to earn money in India",
    exploreOtherWaysImage: "",
    exploreOtherWaysImageFile: null,
    exploreOtherWaysTasks: [
      {
        subtitle: "Admin tasks",
        subheading: "Earn ₹240/week*",
        image: "",
        imageFile: null,
      },
      {
        subtitle: "Accounting Tutor tasks",
        subheading: "Earn ₹126/week*",
        image: "",
        imageFile: null,
      },
    ],
    exploreOtherWaysButtonText: "Explore more tasks",
    exploreOtherWaysDisclaimer: "*Based on average prices from 1-2 completed tasks in India. Actual marketplace earnings may vary.",
    // Top Locations Section
    topLocationsIcon: "location",
    topLocationsTitle: "Browse our top locations",
    topLocationsHeadings: [
      "Delhi",
      "Mumbai",
      "Kolkata",
      "Chennai",
      "Pune",
      "Surat",
      "Jaipur",
      "Bangalore",
      "Hyderabad",
      "Ahmedabad",
      "Noida",
      "Gurugram",
    ],
    // Browse Similar Tasks Section
    browseSimilarTasksIcons: [],
    browseSimilarTasksTitle: "Browse similar tasks near me",
    browseSimilarTasksHeadings: [],
    // Footer Section
    footer: {
      // First Column - Discover
      discoverHeading: "Discover",
      discoverLinks: [
        "How it works",
        "Extrahand for business",
        "Earn money",
        "Side Hustle Calculator",
        "Search tasks",
        "Cost Guides",
        "Service Guides",
        "Comparison Guides",
        "Gift Cards",
        "Student Discount",
        "Partners",
        "New users FAQ"
      ],
      // Second Column - Company
      companyHeading: "Company",
      companyLinks: [
        "About us",
        "Careers",
        "Media enquiries",
        "Community Guidelines",
        "Tasker Principles",
        "Terms and Conditions",
        "Blog",
        "Contact us",
        "Privacy policy",
        "Investors"
      ],
      // Third Column - Existing Members
      existingMembersHeading: "Existing Members",
      existingMembersLinks: [
        "Post a task",
        "Browse tasks",
        "Login",
        "Support centre"
      ],
      // Fourth Column - Popular Categories
      popularCategoriesHeading: "Popular Categories",
      popularCategoriesLinks: [
        "Handyman Services",
        "Cleaning Services",
        "Delivery Services",
        "Removalists",
        "Gardening Services",
        "Auto Electricians",
        "Assembly Services",
        "All Services"
      ],
      // Fifth Column - Popular Locations
      popularLocationsHeading: "Popular Locations",
      popularLocations: [
        "Chennai",
        "Pune",
        "Surat",
        "Jaipur",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad"
      ],
      // Bottom Section
      copyrightText: "Extrahand Limited 2011-2025 ©, All rights reserved",
      appleStoreImage: "",
      appleStoreImageFile: null,
      googlePlayImage: "",
      googlePlayImageFile: null
    },
  });

  // UI state
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [imagePreview, setImagePreview] = useState(null);
  const [howToEarnImagePreviews, setHowToEarnImagePreviews] = useState([null, null, null]);
  const [taskerImagePreviews, setTaskerImagePreviews] = useState([null, null, null]);
  const [exploreOtherWaysImagePreview, setExploreOtherWaysImagePreview] = useState(null);
  const [exploreOtherWaysTaskImagePreviews, setExploreOtherWaysTaskImagePreviews] = useState([null, null]);
  const [appleStoreImagePreview, setAppleStoreImagePreview] = useState(null);
  const [googlePlayImagePreview, setGooglePlayImagePreview] = useState(null);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);

  // Auto-generate slug from name
  // Removes "Tasks" or " tasks" from the end for URL slugs (but keeps it in stored data)
  const generateSlug = (name) => {
    let processedName = name
      .trim()
      // Remove "Tasks" or " tasks" from the end (case-insensitive)
      .replace(/\s+[Tt]asks\s*$/g, "")
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return processedName;
  };

  // Helper function to add " tasks" only if value doesn't already end with "Tasks"
  const addTasksSuffix = (value) => {
    if (!value) return value;
    const trimmedValue = value.trim();
    // Check if value already ends with "Tasks" or "tasks" (case-insensitive)
    if (/\s+[Tt]asks\s*$/i.test(trimmedValue)) {
      return trimmedValue;
    }
    return `${trimmedValue} tasks`;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // When category type changes, reset name and slug
      if (name === "categoryType") {
        newData.name = "";
        newData.subcategory = "";
        newData.subcategorySlug = "";
        newData.slug = "";
        newData.heroTitle = "";
        newData.heroDescription = "";
      }

      // When name (category) is selected, auto-generate slug and reset subcategory
      if (name === "name" && value) {
        const categorySlug = generateSlug(value);
        // Reset subcategory when category changes (different categories have different subcategories)
        newData.subcategory = "";
        newData.subcategorySlug = "";
        // Set slug to category slug (will be updated if subcategory is selected later)
        newData.slug = categorySlug;
        // Auto-generate heroTitle from name
        if (!prev.heroTitle || prev.heroTitle === `${prev.name} tasks near you`) {
          newData.heroTitle = `${addTasksSuffix(value)} near you`;
        }
        // Auto-generate heroDescription
        if (!prev.heroDescription || prev.heroDescription.includes(prev.name)) {
          newData.heroDescription = `Browse through over 500 ${addTasksSuffix(value)}.`;
        }
        // Auto-generate staticTasksSectionTitle from name
        if (!prev.staticTasksSectionTitle || prev.staticTasksSectionTitle.includes(prev.name)) {
          newData.staticTasksSectionTitle = `${addTasksSuffix(value)} in India`;
        }
        // Auto-generate earningPotentialDescription from name
        if (!prev.earningPotentialDescription || prev.earningPotentialDescription.includes(prev.name)) {
          newData.earningPotentialDescription = `Earn money with every ${value}`;
        }
        // Auto-generate incomeOpportunitiesDescription from name
        if (!prev.incomeOpportunitiesDescription || prev.incomeOpportunitiesDescription.includes(prev.name)) {
          newData.incomeOpportunitiesDescription = `Explore ${value} related tasks and discover your financial opportunities`;
        }
        // Auto-generate incomeOpportunitiesDisclaimer from name
        if (!prev.incomeOpportunitiesDisclaimer || prev.incomeOpportunitiesDisclaimer.includes(prev.name)) {
          newData.incomeOpportunitiesDisclaimer = `*Based on average ${value} task prices in India. Actual marketplace earnings may vary`;
        }
        // Auto-generate waysToEarnTitle from name
        if (!prev.waysToEarnTitle || 
            prev.waysToEarnTitle.includes("accounting") || 
            prev.waysToEarnTitle.includes(prev.name)) {
          newData.waysToEarnTitle = `Ways to earn money with ${addTasksSuffix(value)} on Extrahand`;
        }
        // Auto-generate getInspiredTitle from name
        if (!prev.getInspiredTitle || 
            prev.getInspiredTitle.includes("Accounting") || 
            prev.getInspiredTitle.includes(prev.name) ||
            prev.getInspiredTitle === "Get Inspired: Top Accounting Taskers in India") {
          newData.getInspiredTitle = `Get Inspired: Top ${value} Taskers in India`;
        }
        // Auto-generate questionsTitle from name
        if (!prev.questionsTitle || 
            prev.questionsTitle.includes("Accounting") || 
            prev.questionsTitle.includes(prev.name) ||
            prev.questionsTitle === "Top Accounting related questions") {
          newData.questionsTitle = `Top ${value} related questions`;
        }
        // Replace "bookkeeper" and "Accounting" with category name in questions
        if (prev.questions && Array.isArray(prev.questions)) {
          newData.questions = prev.questions.map(question => {
            let newSubtitle = question.subtitle || "";
            let newDescription = question.description || "";
            
            // First, handle "bookkeeper or accountant" as a single phrase - replace with just category name
            newSubtitle = newSubtitle.replace(/bookkeeper\s+or\s+accountant/gi, value);
            newDescription = newDescription.replace(/bookkeeper\s+or\s+accountant/gi, value);
            
            // Handle "bookkeeping and" - remove "bookkeeping and" entirely
            newSubtitle = newSubtitle.replace(/bookkeeping\s+and\s+/gi, "");
            newDescription = newDescription.replace(/bookkeeping\s+and\s+/gi, "");
            
            // Replace "bookkeeping" (case-insensitive) with category name
            newSubtitle = newSubtitle.replace(/bookkeeping/gi, value);
            newDescription = newDescription.replace(/bookkeeping/gi, value);
            
            // Replace "bookkeeper" (case-insensitive) with category name
            newSubtitle = newSubtitle.replace(/bookkeeper/gi, value);
            newDescription = newDescription.replace(/bookkeeper/gi, value);
            
            // Replace "accounting" (case-insensitive) with category name
            newSubtitle = newSubtitle.replace(/accounting/gi, value);
            newDescription = newDescription.replace(/accounting/gi, value);
            
            // Replace "accountant" (case-insensitive) with category name
            newSubtitle = newSubtitle.replace(/accountant/gi, value);
            newDescription = newDescription.replace(/accountant/gi, value);
            
            // Clean up duplicates like "Carpenter or Carpenter" -> "Carpenter"
            const categoryRegex = new RegExp(`(${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s+or\\s+\\1`, 'gi');
            newSubtitle = newSubtitle.replace(categoryRegex, value);
            newDescription = newDescription.replace(categoryRegex, value);
            
            return {
              ...question,
              subtitle: newSubtitle,
              description: newDescription,
            };
          });
        }
        // Replace "accounting" and "Bookkeeping" with category name in waysToEarnContent
        if (prev.waysToEarnContent && Array.isArray(prev.waysToEarnContent)) {
          newData.waysToEarnContent = prev.waysToEarnContent.map(item => {
            let newHeading = item.heading || "";
            let newText = item.text || "";
            
            // Replace "accounting" (case-insensitive) with category name
            newHeading = newHeading.replace(/accounting/gi, value);
            newText = newText.replace(/accounting/gi, value);
            
            // Replace "Bookkeeping" (case-insensitive) with category name
            newHeading = newHeading.replace(/bookkeeping/gi, value);
            newText = newText.replace(/bookkeeping/gi, value);
            
            // Replace "bookkeeper" (case-insensitive) with category name
            newHeading = newHeading.replace(/bookkeeper/gi, value);
            newText = newText.replace(/bookkeeper/gi, value);
            
            // Replace "accountant" (case-insensitive) with category name
            newHeading = newHeading.replace(/accountant/gi, value);
            newText = newText.replace(/accountant/gi, value);
            
            return {
              ...item,
              heading: newHeading,
              text: newText,
            };
          });
        }
        
        // Replace "accounting" with category name in incomeOpportunitiesData
        if (prev.incomeOpportunitiesData) {
          const replaceAccountingInData = (data) => {
            if (Array.isArray(data)) {
              return data.map(item => {
                if (typeof item === 'object' && item !== null) {
                  const newItem = { ...item };
                  if (newItem.jobType) {
                    newItem.jobType = newItem.jobType.replace(/accounting/gi, value);
                  }
                  return newItem;
                }
                return item;
              });
            }
            return data;
          };
          
          newData.incomeOpportunitiesData = {
            weekly: replaceAccountingInData(prev.incomeOpportunitiesData.weekly || []),
            monthly: replaceAccountingInData(prev.incomeOpportunitiesData.monthly || []),
            yearly: replaceAccountingInData(prev.incomeOpportunitiesData.yearly || []),
          };
        }
        
        // Auto-populate Browse Similar Tasks Section with subcategories from subcategoriesMap
        const subcategories = subcategoriesMap[value] || [];
        if (subcategories.length > 0) {
          // Default icons to use (cycle through if more subcategories than icons)
          const defaultIcons = ["wrench", "brush", "pencil", "hammer", "tool", "gear", "screwdriver", "paintbrush"];
          
          // Create icons array matching the number of subcategories
          const icons = subcategories.map((_, index) => defaultIcons[index % defaultIcons.length]);
          
          // Update browseSimilarTasksHeadings with all subcategories
          newData.browseSimilarTasksHeadings = subcategories;
          newData.browseSimilarTasksIcons = icons;
        } else {
          // If no subcategories, reset to empty arrays
          newData.browseSimilarTasksHeadings = [];
          newData.browseSimilarTasksIcons = [];
        }
      }

      // When subcategory is selected, auto-generate subcategory slug
      if (name === "subcategory") {
        if (value === "__CUSTOM__") {
          // Custom subcategory option selected - show input field
          setIsCustomSubcategory(true);
          newData.subcategory = "";
          newData.subcategorySlug = "";
          // Reset slug to just category slug
          if (newData.name) {
            newData.slug = generateSlug(newData.name);
          }
        } else if (value) {
          // Predefined subcategory selected
          setIsCustomSubcategory(false);
          newData.subcategorySlug = generateSlug(value);
          // Always get category slug from the original category name (formData.name)
          // Never use existing slug as it might contain nested subcategory slugs
          const categorySlug = formData.name ? generateSlug(formData.name) : "";
          if (categorySlug) {
            newData.slug = `${categorySlug}/${newData.subcategorySlug}`;
          }
          
          // Auto-fill all sections with subcategory name (similar to category selection)
          // Auto-generate heroTitle from subcategory name
          if (!prev.heroTitle || prev.heroTitle === `${prev.subcategory} tasks near you` || prev.heroTitle === `${prev.name} tasks near you`) {
            newData.heroTitle = `${addTasksSuffix(value)} near you`;
          }
          // Auto-generate heroDescription
          if (!prev.heroDescription || prev.heroDescription.includes(prev.subcategory) || prev.heroDescription.includes(prev.name)) {
            newData.heroDescription = `Browse through over 500 ${addTasksSuffix(value)}.`;
          }
          // Auto-generate staticTasksSectionTitle from subcategory name
          if (!prev.staticTasksSectionTitle || prev.staticTasksSectionTitle.includes(prev.subcategory) || prev.staticTasksSectionTitle.includes(prev.name)) {
            newData.staticTasksSectionTitle = `${addTasksSuffix(value)} in India`;
          }
          // Auto-generate earningPotentialDescription from subcategory name
          if (!prev.earningPotentialDescription || prev.earningPotentialDescription.includes(prev.subcategory) || prev.earningPotentialDescription.includes(prev.name)) {
            newData.earningPotentialDescription = `Earn money with every ${value}`;
          }
          // Auto-generate incomeOpportunitiesDescription from subcategory name
          if (!prev.incomeOpportunitiesDescription || prev.incomeOpportunitiesDescription.includes(prev.subcategory) || prev.incomeOpportunitiesDescription.includes(prev.name)) {
            newData.incomeOpportunitiesDescription = `Explore ${value} related tasks and discover your financial opportunities`;
          }
          // Auto-generate disclaimer from subcategory name
          if (!prev.disclaimer || prev.disclaimer.includes(prev.subcategory) || prev.disclaimer.includes(prev.name) || prev.disclaimer.includes("accounting")) {
            newData.disclaimer = `Based on average ${value} task prices. Actual marketplace earnings may vary`;
          }
          // Auto-generate incomeOpportunitiesDisclaimer from subcategory name
          if (!prev.incomeOpportunitiesDisclaimer || prev.incomeOpportunitiesDisclaimer.includes(prev.subcategory) || prev.incomeOpportunitiesDisclaimer.includes(prev.name)) {
            newData.incomeOpportunitiesDisclaimer = `*Based on average ${value} task prices in India. Actual marketplace earnings may vary`;
          }
          // Auto-generate earningPotentialDisclaimer from subcategory name
          if (!prev.earningPotentialDisclaimer || prev.earningPotentialDisclaimer.includes(prev.subcategory) || prev.earningPotentialDisclaimer.includes(prev.name)) {
            newData.earningPotentialDisclaimer = `*Based on average ${value} task prices in India. Actual marketplace earnings may vary`;
          }
          // Auto-generate waysToEarnTitle from subcategory name
          if (!prev.waysToEarnTitle || 
              prev.waysToEarnTitle.includes("accounting") || 
              prev.waysToEarnTitle.includes(prev.subcategory) || 
              prev.waysToEarnTitle.includes(prev.name)) {
            newData.waysToEarnTitle = `Ways to earn money with ${addTasksSuffix(value)} on Extrahand`;
          }
          // Auto-generate getInspiredTitle from subcategory name
          if (!prev.getInspiredTitle || 
              prev.getInspiredTitle.includes("Accounting") || 
              prev.getInspiredTitle.includes(prev.subcategory) ||
              prev.getInspiredTitle.includes(prev.name) ||
              prev.getInspiredTitle === "Get Inspired: Top Accounting Taskers in India") {
            newData.getInspiredTitle = `Get Inspired: Top ${value} Taskers in India`;
          }
          // Auto-generate questionsTitle from subcategory name
          if (!prev.questionsTitle || 
              prev.questionsTitle.includes("Accounting") || 
              prev.questionsTitle.includes(prev.subcategory) || 
              prev.questionsTitle.includes(prev.name) ||
              prev.questionsTitle === "Top Accounting related questions") {
            newData.questionsTitle = `Top ${value} related questions`;
          }
        } else {
          // Subcategory cleared - reset subcategory slug and main slug
          setIsCustomSubcategory(false);
          newData.subcategory = "";
          newData.subcategorySlug = "";
          // Reset slug to just category slug
          if (newData.name) {
            newData.slug = generateSlug(newData.name);
          }
        }
      }

      // Handle custom subcategory input
      if (name === "customSubcategory") {
        newData.subcategory = value || "";
        if (value && value.trim()) {
          newData.subcategorySlug = generateSlug(value);
          // Always get category slug from the original category name (formData.name)
          // Never use existing slug as it might contain nested subcategory slugs
          const categorySlug = formData.name ? generateSlug(formData.name) : "";
          if (categorySlug) {
            newData.slug = `${categorySlug}/${newData.subcategorySlug}`;
          }
          
          // Auto-fill all sections with custom subcategory name (similar to predefined subcategory)
          // Auto-generate heroTitle from subcategory name
          if (!prev.heroTitle || prev.heroTitle === `${prev.subcategory} tasks near you` || prev.heroTitle === `${prev.name} tasks near you`) {
            newData.heroTitle = `${addTasksSuffix(value)} near you`;
          }
          // Auto-generate heroDescription
          if (!prev.heroDescription || prev.heroDescription.includes(prev.subcategory) || prev.heroDescription.includes(prev.name)) {
            newData.heroDescription = `Browse through over 500 ${addTasksSuffix(value)}.`;
          }
          // Auto-generate staticTasksSectionTitle from subcategory name
          if (!prev.staticTasksSectionTitle || prev.staticTasksSectionTitle.includes(prev.subcategory) || prev.staticTasksSectionTitle.includes(prev.name)) {
            newData.staticTasksSectionTitle = `${addTasksSuffix(value)} in India`;
          }
          // Auto-generate earningPotentialDescription from subcategory name
          if (!prev.earningPotentialDescription || prev.earningPotentialDescription.includes(prev.subcategory) || prev.earningPotentialDescription.includes(prev.name)) {
            newData.earningPotentialDescription = `Earn money with every ${value}`;
          }
          // Auto-generate incomeOpportunitiesDescription from subcategory name
          if (!prev.incomeOpportunitiesDescription || prev.incomeOpportunitiesDescription.includes(prev.subcategory) || prev.incomeOpportunitiesDescription.includes(prev.name)) {
            newData.incomeOpportunitiesDescription = `Explore ${value} related tasks and discover your financial opportunities`;
          }
          // Auto-generate disclaimer from subcategory name
          if (!prev.disclaimer || prev.disclaimer.includes(prev.subcategory) || prev.disclaimer.includes(prev.name) || prev.disclaimer.includes("accounting")) {
            newData.disclaimer = `Based on average ${value} task prices. Actual marketplace earnings may vary`;
          }
          // Auto-generate incomeOpportunitiesDisclaimer from subcategory name
          if (!prev.incomeOpportunitiesDisclaimer || prev.incomeOpportunitiesDisclaimer.includes(prev.subcategory) || prev.incomeOpportunitiesDisclaimer.includes(prev.name)) {
            newData.incomeOpportunitiesDisclaimer = `*Based on average ${value} task prices in India. Actual marketplace earnings may vary`;
          }
          // Auto-generate earningPotentialDisclaimer from subcategory name
          if (!prev.earningPotentialDisclaimer || prev.earningPotentialDisclaimer.includes(prev.subcategory) || prev.earningPotentialDisclaimer.includes(prev.name)) {
            newData.earningPotentialDisclaimer = `*Based on average ${value} task prices in India. Actual marketplace earnings may vary`;
          }
          // Auto-generate waysToEarnTitle from subcategory name
          if (!prev.waysToEarnTitle || 
              prev.waysToEarnTitle.includes("accounting") || 
              prev.waysToEarnTitle.includes(prev.subcategory) || 
              prev.waysToEarnTitle.includes(prev.name)) {
            newData.waysToEarnTitle = `Ways to earn money with ${addTasksSuffix(value)} on Extrahand`;
          }
          // Auto-generate getInspiredTitle from subcategory name
          if (!prev.getInspiredTitle || 
              prev.getInspiredTitle.includes("Accounting") || 
              prev.getInspiredTitle.includes(prev.subcategory) ||
              prev.getInspiredTitle.includes(prev.name) ||
              prev.getInspiredTitle === "Get Inspired: Top Accounting Taskers in India") {
            newData.getInspiredTitle = `Get Inspired: Top ${value} Taskers in India`;
          }
          // Auto-generate questionsTitle from subcategory name
          if (!prev.questionsTitle || 
              prev.questionsTitle.includes("Accounting") || 
              prev.questionsTitle.includes(prev.subcategory) || 
              prev.questionsTitle.includes(prev.name) ||
              prev.questionsTitle === "Top Accounting related questions") {
            newData.questionsTitle = `Top ${value} related questions`;
          }
        } else {
          // Empty value - reset to just category slug
          newData.subcategorySlug = "";
          if (formData.name) {
            newData.slug = generateSlug(formData.name);
          }
        }
      }

      // When slug is manually selected, update name if it matches
      if (name === "slug" && value) {
        const selectedCategory = formData.categoryType === "As A Tasker" 
          ? taskerCategories.find(cat => generateSlug(cat) === value)
          : posterCategories.find(cat => generateSlug(cat) === value);
        if (selectedCategory) {
          newData.name = selectedCategory;
        }
      }

      return newData;
    });
  };

  // Handle image file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ 
        type: "error", 
        text: "Please upload only image files (JPG, PNG, GIF, WEBP, SVG). PDFs and other documents are not allowed." 
      });
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        type: "error", 
        text: "Image size should be less than 5MB" 
      });
      e.target.value = "";
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        heroImage: reader.result, // Store as base64 for now
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      heroImage: "",
    }));
  };

  // Handle how to earn image upload
  const handleHowToEarnImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...howToEarnImagePreviews];
      newPreviews[index] = reader.result;
      setHowToEarnImagePreviews(newPreviews);

      const newImageFiles = [...formData.howToEarnImageFiles];
      newImageFiles[index] = file;

      const newSteps = [...formData.howToEarnSteps];
      newSteps[index] = {
        ...newSteps[index],
        image: reader.result,
      };

      setFormData((prev) => ({
        ...prev,
        howToEarnImageFiles: newImageFiles,
        howToEarnSteps: newSteps,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove how to earn image
  const handleRemoveHowToEarnImage = (index) => {
    const newPreviews = [...howToEarnImagePreviews];
    newPreviews[index] = null;
    setHowToEarnImagePreviews(newPreviews);

    const newImageFiles = [...formData.howToEarnImageFiles];
    newImageFiles[index] = null;

    const newSteps = [...formData.howToEarnSteps];
    newSteps[index] = {
      ...newSteps[index],
      image: "",
    };

    setFormData((prev) => ({
      ...prev,
      howToEarnImageFiles: newImageFiles,
      howToEarnSteps: newSteps,
    }));
  };

  // Handle tasker image upload
  const handleTaskerImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...taskerImagePreviews];
      newPreviews[index] = reader.result;
      setTaskerImagePreviews(newPreviews);

      const newTaskers = [...formData.topTaskers];
      newTaskers[index] = {
        ...newTaskers[index],
        profileImage: reader.result,
        profileImageFile: file,
      };

      setFormData((prev) => ({
        ...prev,
        topTaskers: newTaskers,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove tasker image
  const handleRemoveTaskerImage = (index) => {
    const newPreviews = [...taskerImagePreviews];
    newPreviews[index] = null;
    setTaskerImagePreviews(newPreviews);

    const newTaskers = [...formData.topTaskers];
    newTaskers[index] = {
      ...newTaskers[index],
      profileImage: "",
      profileImageFile: null,
    };

    setFormData((prev) => ({
      ...prev,
      topTaskers: newTaskers,
    }));
  };

  // Handle explore other ways main image upload
  const handleExploreOtherWaysImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setExploreOtherWaysImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        exploreOtherWaysImage: reader.result,
        exploreOtherWaysImageFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove explore other ways main image
  const handleRemoveExploreOtherWaysImage = () => {
    setExploreOtherWaysImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      exploreOtherWaysImage: "",
      exploreOtherWaysImageFile: null,
    }));
  };

  // Handle explore other ways task image upload
  const handleExploreOtherWaysTaskImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...exploreOtherWaysTaskImagePreviews];
      newPreviews[index] = reader.result;
      setExploreOtherWaysTaskImagePreviews(newPreviews);

      const newTasks = [...formData.exploreOtherWaysTasks];
      newTasks[index] = {
        ...newTasks[index],
        image: reader.result,
        imageFile: file,
      };

      setFormData((prev) => ({
        ...prev,
        exploreOtherWaysTasks: newTasks,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove explore other ways task image
  const handleRemoveExploreOtherWaysTaskImage = (index) => {
    const newPreviews = [...exploreOtherWaysTaskImagePreviews];
    newPreviews[index] = null;
    setExploreOtherWaysTaskImagePreviews(newPreviews);

    const newTasks = [...formData.exploreOtherWaysTasks];
    newTasks[index] = {
      ...newTasks[index],
      image: "",
      imageFile: null,
    };

    setFormData((prev) => ({
      ...prev,
      exploreOtherWaysTasks: newTasks,
    }));
  };

  // Handle Apple Store image upload
  const handleAppleStoreImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAppleStoreImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        footer: {
          ...prev.footer,
          appleStoreImage: reader.result,
          appleStoreImageFile: file,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove Apple Store image
  const handleRemoveAppleStoreImage = () => {
    setAppleStoreImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        appleStoreImage: "",
        appleStoreImageFile: null,
      },
    }));
  };

  // Handle Google Play image upload
  const handleGooglePlayImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validImageTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setGooglePlayImagePreview(reader.result);
      setFormData((prev) => ({
        ...prev,
        footer: {
          ...prev.footer,
          googlePlayImage: reader.result,
          googlePlayImageFile: file,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Remove Google Play image
  const handleRemoveGooglePlayImage = () => {
    setGooglePlayImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        googlePlayImage: "",
        googlePlayImageFile: null,
      },
    }));
  };

  // Fetch all categories and subcategories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" }); // Clear any previous messages
      
      // Fetch categories
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/task-categories`);
      let allItems = [];
      
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        allItems = Array.isArray(categoriesData) ? categoriesData : [];
      }
      
      // Fetch subcategories
      const subcategoriesResponse = await fetch(`${API_BASE_URL}/api/task-subcategories`);
      if (subcategoriesResponse.ok) {
        const subcategoriesData = await subcategoriesResponse.json();
        if (Array.isArray(subcategoriesData)) {
          allItems = [...allItems, ...subcategoriesData];
        }
      }
      
      setCategories(allItems);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Don't show error message to user, just log it
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Clean formData - remove imageFile and howToEarnImageFiles as they're not needed in database
      const { imageFile, howToEarnImageFiles, exploreOtherWaysImageFile, ...cleanFormData } = formData;
      
      // Clean staticTasks - remove profileImageFile from each task
      if (cleanFormData.staticTasks && Array.isArray(cleanFormData.staticTasks)) {
        cleanFormData.staticTasks = cleanFormData.staticTasks.map(task => {
          const { profileImageFile, ...cleanTask } = task;
          return cleanTask;
        });
      }
      
      // Clean topTaskers - remove profileImageFile from each tasker
      if (cleanFormData.topTaskers && Array.isArray(cleanFormData.topTaskers)) {
        cleanFormData.topTaskers = cleanFormData.topTaskers.map(tasker => {
          const { profileImageFile, ...cleanTasker } = tasker;
          return cleanTasker;
        });
      }
      
      // Clean exploreOtherWaysTasks - remove imageFile from each task
      if (cleanFormData.exploreOtherWaysTasks && Array.isArray(cleanFormData.exploreOtherWaysTasks)) {
        cleanFormData.exploreOtherWaysTasks = cleanFormData.exploreOtherWaysTasks.map(task => {
          const { imageFile, ...cleanTask } = task;
          return cleanTask;
        });
      }
      
      // Clean insuranceCoverFeatures - remove _id from each feature (MongoDB subdocument IDs)
      if (cleanFormData.insuranceCoverFeatures && Array.isArray(cleanFormData.insuranceCoverFeatures)) {
        cleanFormData.insuranceCoverFeatures = cleanFormData.insuranceCoverFeatures.map((feature, index) => {
          const { _id, ...cleanFeature } = feature;
          // Ensure icon is set correctly based on index
          return {
            ...cleanFeature,
            icon: index === 0 ? "human" : "star",
          };
        });
      }
      
      // Clean questions - remove _id from each question (MongoDB subdocument IDs)
      if (cleanFormData.questions && Array.isArray(cleanFormData.questions)) {
        cleanFormData.questions = cleanFormData.questions.map(question => {
          const { _id, ...cleanQuestion } = question;
          return cleanQuestion;
        });
      }
      
      // Clean footer - remove imageFile from footer
      if (cleanFormData.footer) {
        const { appleStoreImageFile, googlePlayImageFile, ...cleanFooter } = cleanFormData.footer;
        cleanFormData.footer = cleanFooter;
      }
      
      // Ensure whyJoinFeatures is properly structured
      if (!cleanFormData.whyJoinFeatures || !Array.isArray(cleanFormData.whyJoinFeatures)) {
        cleanFormData.whyJoinFeatures = [
          {
            title: "All on your terms",
            description: "See a job that fits your skills and timeframe? Go for it. Extrahand's flexible to your schedule."
          },
          {
            title: "Get going for free",
            description: "Check tasks and get going straight away. Services fees occur when you've completed the task."
          },
          {
            title: "Secure payments",
            description: "Nobody likes chasing money, so we secure customer payments upfront. When a task is marked complete, your bank account will know about it."
          },
          {
            title: "Skills can thrill",
            description: "Never thought your knack for crocheting would be useful? Think again. We're all about earning from unexpected skills at Extrahand."
          }
        ];
      }
      
      // Ensure incomeOpportunitiesData has default values if empty or missing
      if (!cleanFormData.incomeOpportunitiesData || 
          !cleanFormData.incomeOpportunitiesData.weekly || 
          cleanFormData.incomeOpportunitiesData.weekly.length === 0 ||
          !cleanFormData.incomeOpportunitiesData.monthly || 
          cleanFormData.incomeOpportunitiesData.monthly.length === 0 ||
          !cleanFormData.incomeOpportunitiesData.yearly || 
          cleanFormData.incomeOpportunitiesData.yearly.length === 0) {
        cleanFormData.incomeOpportunitiesData = {
          weekly: [
            { jobType: "Accounting", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
            { jobType: "Tax Accountants", "1-2": "₹220", "3-5": "₹550", "5+": "₹770" },
            { jobType: "XERO Accounting", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
            { jobType: "Bookkeeping", "1-2": "₹200", "3-5": "₹500", "5+": "₹700" },
            { jobType: "MYOB Accountant", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
            { jobType: "XERO Training", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
            { jobType: "Payroll Accountant", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
            { jobType: "BAS Accounting", "1-2": "₹154", "3-5": "₹385", "5+": "₹539" },
            { jobType: "Tax Advisor", "1-2": "₹178", "3-5": "₹445", "5+": "₹623" },
            { jobType: "MYOB Training", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
          ],
          monthly: [
            { jobType: "Accounting", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
            { jobType: "Tax Accountants", "1-2": "₹953", "3-5": "₹2,382", "5+": "₹3,334" },
            { jobType: "XERO Accounting", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
            { jobType: "Bookkeeping", "1-2": "₹866", "3-5": "₹2,165", "5+": "₹3,031" },
            { jobType: "MYOB Accountant", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
            { jobType: "XERO Training", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
            { jobType: "Payroll Accountant", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
            { jobType: "BAS Accounting", "1-2": "₹667", "3-5": "₹1,667", "5+": "₹2,334" },
            { jobType: "Tax Advisor", "1-2": "₹771", "3-5": "₹1,927", "5+": "₹2,698" },
            { jobType: "MYOB Training", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
          ],
          yearly: [
            { jobType: "Accounting", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
            { jobType: "Tax Accountants", "1-2": "₹11,440", "3-5": "₹28,600", "5+": "₹40,040" },
            { jobType: "XERO Accounting", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
            { jobType: "Bookkeeping", "1-2": "₹10,400", "3-5": "₹26,000", "5+": "₹36,400" },
            { jobType: "MYOB Accountant", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
            { jobType: "XERO Training", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
            { jobType: "Payroll Accountant", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
            { jobType: "BAS Accounting", "1-2": "₹8,008", "3-5": "₹20,020", "5+": "₹28,028" },
            { jobType: "Tax Advisor", "1-2": "₹9,256", "3-5": "₹23,140", "5+": "₹32,396" },
            { jobType: "MYOB Training", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
          ],
        };
      }
      
      // Ensure insuranceCoverFeatures is properly structured (already cleaned _id above)
      if (!cleanFormData.insuranceCoverFeatures || !Array.isArray(cleanFormData.insuranceCoverFeatures) || cleanFormData.insuranceCoverFeatures.length !== 2) {
        cleanFormData.insuranceCoverFeatures = [
          {
            icon: "human",
            subtitle: "Public liability insurance",
            subdescription: "Extrahand Insurance covers you for any accidental injury to the customer or property damage whilst performing certain task activities",
          },
          {
            icon: "star",
            subtitle: "Top rated insurance",
            subdescription: "Extrahand Insurance is provided by Chubb Insurance India Limited, one of the world's most reputable, stable and innovative",
          },
        ];
      }
      
      // Debug: Log the data being sent
      console.log("Form data being sent:", cleanFormData);
      console.log("Income Opportunities Data:", cleanFormData.incomeOpportunitiesData);
      console.log("Why Join Features:", cleanFormData.whyJoinFeatures);
      console.log("Insurance Cover Title:", cleanFormData.insuranceCoverTitle);
      console.log("Insurance Cover Description:", cleanFormData.insuranceCoverDescription);
      console.log("Insurance Cover Button Text:", cleanFormData.insuranceCoverButtonText);
      console.log("Insurance Cover Features:", JSON.stringify(cleanFormData.insuranceCoverFeatures, null, 2));
      console.log("Questions Title:", cleanFormData.questionsTitle);
      console.log("Questions:", JSON.stringify(cleanFormData.questions, null, 2));
      console.log("Questions length:", cleanFormData.questions?.length);
      
      // Check if this is a subcategory creation/update
      const isSubcategory = cleanFormData.subcategory && cleanFormData.subcategory.trim() !== "";
      const categorySlug = cleanFormData.slug && cleanFormData.slug.includes('/') 
        ? cleanFormData.slug.split('/')[0] 
        : generateSlug(cleanFormData.name);
      
      // Get authentication token
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: "error", text: "Authentication required. Please login again." });
        setLoading(false);
        return;
      }
      
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };
      
      let response;
      let apiEndpoint;
      let entityType;
      
      if (isSubcategory) {
        // This is a subcategory - use tasksubcategories API
        apiEndpoint = `${API_BASE_URL}/api/task-subcategories`;
        entityType = "Subcategory";
        
        // Prepare subcategory data
        const subcategoryData = {
          ...cleanFormData,
          name: cleanFormData.subcategory, // Use subcategory name as the main name
          slug: cleanFormData.slug, // Full slug format: "category-slug/subcategory-slug"
          categorySlug: categorySlug, // Parent category slug
        };
        
        // Remove subcategory and subcategorySlug fields as they're not needed in subcategory document
        delete subcategoryData.subcategory;
        delete subcategoryData.subcategorySlug;
        
        if (editingCategory && editingCategory.slug && editingCategory.slug.includes('/')) {
          // Editing existing subcategory
          response = await fetch(`${apiEndpoint}/${editingCategory._id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(subcategoryData),
          });
        } else {
          // Creating new subcategory
          response = await fetch(apiEndpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(subcategoryData),
          });
        }
      } else {
        // This is a regular category - use task-categories API
        apiEndpoint = `${API_BASE_URL}/api/task-categories`;
        entityType = "Category";
        
        // Remove subcategory fields for regular categories
        const categoryData = { ...cleanFormData };
        delete categoryData.subcategory;
        delete categoryData.subcategorySlug;
        
        if (editingCategory) {
          response = await fetch(`${apiEndpoint}/${editingCategory._id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(categoryData),
          });
        } else {
          response = await fetch(apiEndpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(categoryData),
          });
        }
      }

      const data = await response.json();

      if (response.ok) {
        // Check if a draft version was created (when editing published category)
        if (data.isNewVersion || data.isExistingDraft) {
          const draftMessage = data.isNewVersion 
            ? `Draft version created. Original ${entityType.toLowerCase()} remains published.`
            : `Draft version updated. Original ${entityType.toLowerCase()} remains published.`;
          
          toast.info(draftMessage);
          setMessage({
            type: "success",
            text: draftMessage,
          });
          
          // Ask if user wants to submit for approval now
          if (confirm(`${draftMessage}\n\nWould you like to submit this draft for manager approval now?`)) {
            await handleSubmitForApproval(data.category._id);
          }
        } else if (editingCategory) {
          toast.success(`${entityType} updated successfully!`);
          setMessage({
            type: "success",
            text: `${entityType} updated successfully!`,
          });
        } else {
          toast.success(`${entityType} created successfully!`);
          setMessage({
            type: "success",
            text: `${entityType} created successfully!`,
          });
        }
        resetForm();
        fetchCategories();
        setViewMode("list");
      } else {
        toast.error(data.error || `Failed to save ${entityType.toLowerCase()}`);
        setMessage({ type: "error", text: data.error || `Failed to save ${entityType.toLowerCase()}` });
      }
    } catch (error) {
      toast.error("Error saving category: " + error.message);
      setMessage({ type: "error", text: "Error saving category: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      categoryType: "",
      name: "",
      subcategory: "",
      subcategorySlug: "",
      slug: "",
      heroTitle: "",
      heroDescription: "",
      heroImage: "",
      imageFile: null,
      defaultEarnings: "₹1,039",
      earningsPeriod: "per month",
      earnings1to2: "₹1,039",
      earnings3to5: "₹2,598",
      earnings5plus: "₹3,637",
      location: "India",
      disclaimer: "Based on average accounting task prices. Actual marketplace earnings may vary",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
      earningsCard: {
        weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
        monthly: { "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637+" },
        yearly: { "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680+" },
      },
      earningsByJobTypes: {},
      // Why Join Extrahand Section
      whyJoinTitle: "Why join Extrahand",
      whyJoinFeatures: [
        {
          title: "All on your terms",
          description: "See a job that fits your skills and timeframe? Go for it. Extrahand's flexible to your schedule."
        },
        {
          title: "Get going for free",
          description: "Check tasks and get going straight away. Services fees occur when you've completed the task."
        },
        {
          title: "Secure payments",
          description: "Nobody likes chasing money, so we secure customer payments upfront. When a task is marked complete, your bank account will know about it."
        },
        {
          title: "Skills can thrill",
          description: "Never thought your knack for crocheting would be useful? Think again. We're all about earning from unexpected skills at Extrahand."
        }
      ],
      whyJoinButtonText: "Join Extrahand",
      staticTasksSectionTitle: "",
      staticTasksSectionDescription: "Check out what tasks people want done near you right now...",
      staticTasks: [],
      browseAllTasksButtonText: "Browse all tasks",
      lastUpdatedText: "Last updated on 4th Dec 2025",
      earningPotentialTitle: "Discover your earning potential in India",
      earningPotentialDescription: "Earn money with every accounting task",
      earningPotentialButtonText: "Join Extrahand",
      earningPotentialData: {
        weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
        monthly: { "1-2": "₹1039", "3-5": "₹2598", "5+": "₹3637+" },
        yearly: { "1-2": "₹12480", "3-5": "₹31200", "5+": "₹43680+" },
      },
      earningPotentialDisclaimer: "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
      incomeOpportunitiesTitle: "Unlock new income opportunities in India",
      incomeOpportunitiesDescription: "Explore accounting related tasks and discover your financial opportunities",
      incomeOpportunitiesData: {
        weekly: [
          { jobType: "Accounting", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
          { jobType: "Tax Accountants", "1-2": "₹220", "3-5": "₹550", "5+": "₹770" },
          { jobType: "XERO Accounting", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
          { jobType: "Bookkeeping", "1-2": "₹200", "3-5": "₹500", "5+": "₹700" },
          { jobType: "MYOB Accountant", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
          { jobType: "XERO Training", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
          { jobType: "Payroll Accountant", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
          { jobType: "BAS Accounting", "1-2": "₹154", "3-5": "₹385", "5+": "₹539" },
          { jobType: "Tax Advisor", "1-2": "₹178", "3-5": "₹445", "5+": "₹623" },
          { jobType: "MYOB Training", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
        ],
        monthly: [
          { jobType: "Accounting", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
          { jobType: "Tax Accountants", "1-2": "₹953", "3-5": "₹2,382", "5+": "₹3,334" },
          { jobType: "XERO Accounting", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
          { jobType: "Bookkeeping", "1-2": "₹866", "3-5": "₹2,165", "5+": "₹3,031" },
          { jobType: "MYOB Accountant", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
          { jobType: "XERO Training", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
          { jobType: "Payroll Accountant", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
          { jobType: "BAS Accounting", "1-2": "₹667", "3-5": "₹1,667", "5+": "₹2,334" },
          { jobType: "Tax Advisor", "1-2": "₹771", "3-5": "₹1,927", "5+": "₹2,698" },
          { jobType: "MYOB Training", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
        ],
        yearly: [
          { jobType: "Accounting", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
          { jobType: "Tax Accountants", "1-2": "₹11,440", "3-5": "₹28,600", "5+": "₹40,040" },
          { jobType: "XERO Accounting", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
          { jobType: "Bookkeeping", "1-2": "₹10,400", "3-5": "₹26,000", "5+": "₹36,400" },
          { jobType: "MYOB Accountant", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
          { jobType: "XERO Training", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
          { jobType: "Payroll Accountant", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
          { jobType: "BAS Accounting", "1-2": "₹8,008", "3-5": "₹20,020", "5+": "₹28,028" },
          { jobType: "Tax Advisor", "1-2": "₹9,256", "3-5": "₹23,140", "5+": "₹32,396" },
          { jobType: "MYOB Training", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
        ],
      },
      incomeOpportunitiesDisclaimer: "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
      // How to Earn Money Section
      howToEarnTitle: "How to earn money on Extrahand",
      howToEarnSteps: [
        {
          image: "",
          subtitle: "Job opportunities that find you",
          description: "Set up notifications and be alerted when a nearby, well-matched job is posted. Let customers book you directly by setting up a listing. Provide a great service and work with them again with Contacts.",
        },
        {
          image: "",
          subtitle: "Set your price",
          description: "Found a job you're up for? Set your price and make an offer. You can adjust and discuss it later if you need to.",
        },
        {
          image: "",
          subtitle: "Work. Get paid. Quickly.",
          description: "When tasks are complete, request for payment to be released and money will appear in your account instantly.",
        },
      ],
      howToEarnButtonText: "Post a task",
      howToEarnImageFiles: [null, null, null],
      tasks: [],
      getInspiredTitle: "Get Inspired: Top Accounting Taskers in India",
      getInspiredButtonText: "Join Extrahand",
      topTaskers: [
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Nathalia MID",
          yearsOnExtrahand: "3 years on Extrahand",
          location: "Ultimo NSW",
          rating: "5",
          overallRatingText: "Overall rating",
          reviewsCount: "46 reviews",
          completionRate: "98.11%",
          completionRateText: "Completion rate",
          tasksCount: "53 tasks",
        },
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Muhammad omar MID",
          yearsOnExtrahand: "8 years on Extrahand",
          location: "Clayton VIC",
          rating: "4.9",
          overallRatingText: "Overall rating",
          reviewsCount: "1140 reviews",
          completionRate: "99.93%",
          completionRateText: "Completion rate",
          tasksCount: "1382 tasks",
        },
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Emma-lee SID",
          yearsOnExtrahand: "8 years on Extrahand",
          location: "Springfield Lakes QLD",
          rating: "4.9",
          overallRatingText: "Overall rating",
          reviewsCount: "118 reviews",
          completionRate: "95.68%",
          completionRateText: "Completion rate",
          tasksCount: "162 tasks",
        },
      ],
      insuranceCoverTitle: "We've got you covered",
      insuranceCoverDescription: "Whether you're a posting a task or completing a task, you can do both with the peace of mind that Extrahand is there to support.",
      insuranceCoverButtonText: "Extrahand's insurance cover",
      insuranceCoverFeatures: [
        {
          icon: "human",
          subtitle: "Public liability insurance",
          subdescription: "Extrahand Insurance covers you for any accidental injury to the customer or property damage whilst performing certain task activities",
        },
        {
          icon: "star",
          subtitle: "Top rated insurance",
          subdescription: "Extrahand Insurance is provided by Chubb Insurance India Limited, one of the world's most reputable, stable and innovative",
        },
      ],
      // Top Accounting related questions Section
      questionsTitle: "",
      questions: [
        {
          subtitle: "How much can I earn as a freelance bookkeeper or accountant on Airtasker?",
          description: "Most bookkeepers on Extrahand earn between ₹100 and ₹250 per task, depending on the scope. Quick tasks like reconciling Xero accounts or helping with BAS can sit around ₹100–₹150, while more involved tasks like setting up business accounts or doing a full tax return often land in the ₹200–₹600+ range. Offering a clear quote and explaining what's included can help win more tasks.",
        },
        {
          subtitle: "What types of bookkeeping and accounting tasks are most in demand?",
          description: "There's strong demand for help with Xero setup, reconciling accounts, preparing BAS, and completing tax returns—especially for small business owners and sole traders. You'll also see tasks like \"check my expenses in a spreadsheet,\" \"fix overdue taxes,\" or \"help me get my ABN sorted.\" Clients often need a mix of compliance and catch-up help, and they value clear, no-fuss communication.",
        },
        {
          subtitle: "Is there more demand for bookkeeping services at tax time?",
          description: "Absolutely! Around EOFY (June–August) and again during BAS quarters, task volume tends to spike. Many customers will post last-minute jobs like \"Need tax agent this weekend\" or \"Help me lodge 3 years of returns.\" It's a great time to update your availability and reply quickly to listings.",
        },
        {
          subtitle: "What do customers usually look for when hiring a bookkeeper or tax agent?",
          description: "They're often after someone who can \"explain things clearly,\" \"sort it fast,\" or \"clean up my books.\" Credentials like being a registered BAS or tax agent help, but so does being responsive and approachable. Clients love when you make things feel easy, especially if they're stressed or behind on their taxes.",
        },
        {
          subtitle: "How should I price services like tax returns, Xero setup, or business advice?",
          description: "For solo returns or one-off reconciliations, Taskers typically charge ₹100–₹200. Full company tax returns or multi-year catch-ups can go up to ₹600 or more, depending on the complexity. For advisory or setup tasks (like \"set up invoicing in Xero\" or \"build me a cash flow report\"), pricing by the hour (₹50–₹100/hr) or offering package rates often works well.",
        },
        {
          subtitle: "What tools or software should I be familiar with to get more jobs?",
          description: "Xero is by far the most requested, but MYOB, QuickBooks, and basic Excel come up regularly too. Knowing how to reconcile transactions, run reports, and manage payroll inside these platforms is a big plus. Customers often say things like \"need someone good with Xero\" or \"help me automate reports\"—so mentioning these tools in your profile helps you show up in searches.",
        },
        {
          subtitle: "How can I increase my earnings by offering bundled services or ongoing support?",
          description: "One-off jobs are great, but many clients need ongoing support. You could offer monthly packages for \"bookkeeping plus BAS,\" or bundle services like \"Xero setup + one hour of training.\" Regular gigs often come from jobs where the customer says things like \"need someone reliable long-term\" or \"might need this every quarter.\" After completing a job, don't be afraid to offer follow-up support—they'll appreciate it.",
        },
        {
          subtitle: "Do customers prefer in-person or remote bookkeeping and tax help?",
          description: "Most jobs can be done remotely, especially things like spreadsheets, tax returns, and software setup. But some clients still ask for \"in-person\" help, especially if they have paper receipts or need someone to \"come to the office for a few hours.\" Make it clear in your profile if you're available for remote, in-person, or hybrid—being flexible opens up more opportunities.",
        },
      ],
      // Ways to earn money with accounting tasks section
      waysToEarnTitle: "Ways to earn money with accounting tasks on Extrahand",
      waysToEarnContent: [
        {
          heading: "",
          text: "Accounting isn't just about crunching numbers — it's about helping individuals and businesses stay financially healthy, organised, and compliant. On Extrahand, there's steady demand for accountants and bookkeepers who can provide support on everything from day-to-day record-keeping to complex tax returns.\n\nMany of these tasks can be done remotely, giving you the flexibility to build a client base from home while working around your own schedule. Others may require on-site visits, particularly when a client needs help setting up systems or organising paperwork.",
        },
        {
          heading: "Bookkeeping and day-to-day finance management",
          text: "Bookkeeping is one of the most common requests on Extrahand, and it forms the foundation of financial management for many clients. Small businesses, sole traders, and even busy households often need someone to keep track of expenses, reconcile bank accounts, and maintain accurate financial records.\n\nThese tasks might involve entering receipts into accounting software, matching transactions, or setting up systems that make it easier for the client to stay on top of things in the future. Having experience with popular platforms like Xero, MYOB, or QuickBooks is a major advantage, as many clients are already using these tools.",
        },
        {
          heading: "Tax preparation and BAS services",
          text: "Tax season is one of the busiest times for accounting tasks on Extrahand. Individuals often look for help lodging their tax returns, while businesses may need support with BAS statements, GST reporting, or end-of-year financial statements. For registered tax agents and BAS agents, this is an excellent way to connect with clients who may later come back for broader financial services. The ability to explain tax obligations in simple, jargon-free language is a valuable skill, as many people find the process overwhelming.",
        },
        {
          heading: "Payroll and employee management",
          text: "Payroll is another area where businesses often turn to Extrahand for help. Even a small team requires accurate wage calculations, superannuation contributions, leave tracking, and compliance with Fair Work and ATO rules. Mistakes in payroll can have serious legal and financial consequences, so clients are eager to hire accountants who are thorough and experienced. Additionally, managing PAYG withholding, preparing BAS or IAS lodgements, reconciling payroll tax obligations, and ensuring proper reporting to the ATO all demand strong tax knowledge to keep businesses compliant.",
        },
        {
          heading: "System setup and advisory work",
          text: "Some clients aren't just looking for help with ongoing tasks but need assistance setting up their systems correctly from the start. This could mean moving from manual spreadsheets to a cloud-based platform, integrating point-of-sale systems with accounting software, or setting up invoicing and payment processes. Advisory tasks like these are highly valued because they save clients time and headaches in the long run.",
        },
        {
          heading: "Tips to increase your accounting income",
          text: "To maximise your opportunities on Extrahand, keep your profile detailed and professional. Highlight your qualifications, registrations, and areas of expertise so potential clients can see your credibility at a glance. Sharing testimonials, case studies, or examples of the types of businesses you've helped can also make a strong impression.\n\nSince accounting often involves handling sensitive information, trustworthiness is just as important as skill, so be clear about your professional standards. You might also outline your security practices, communication style, turnaround times, and commitment to accuracy to reassure clients that their finances are in reliable hands.",
        },
      ],
      // Explore other ways to earn money section
      exploreOtherWaysTitle: "Explore other ways to earn money in India",
      exploreOtherWaysImage: "",
      exploreOtherWaysImageFile: null,
      exploreOtherWaysTasks: [
        {
          subtitle: "Admin tasks",
          subheading: "Earn ₹240/week*",
          image: "",
          imageFile: null,
        },
        {
          subtitle: "Accounting Tutor tasks",
          subheading: "Earn ₹126/week*",
          image: "",
          imageFile: null,
        },
      ],
      exploreOtherWaysButtonText: "Explore more tasks",
      exploreOtherWaysDisclaimer: "*Based on average prices from 1-2 completed tasks in India. Actual marketplace earnings may vary.",
      // Top Locations Section
      topLocationsIcon: "location",
      topLocationsTitle: "Browse our top locations",
      topLocationsHeadings: [
        "Delhi",
        "Mumbai",
        "Kolkata",
        "Chennai",
        "Pune",
        "Surat",
        "Jaipur",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad",
        "Noida",
        "Gurugram",
      ],
      // Browse Similar Tasks Section
      browseSimilarTasksIcons: [],
      browseSimilarTasksTitle: "Browse similar tasks near me",
      browseSimilarTasksHeadings: [],
      // Footer Section
      footer: {
        discoverHeading: "Discover",
        discoverLinks: [
          "How it works",
          "Extrahand for business",
          "Earn money",
          "Side Hustle Calculator",
          "Search tasks",
          "Cost Guides",
          "Service Guides",
          "Comparison Guides",
          "Gift Cards",
          "Student Discount",
          "Partners",
          "New users FAQ"
        ],
        companyHeading: "Company",
        companyLinks: [
          "About us",
          "Careers",
          "Media enquiries",
          "Community Guidelines",
          "Tasker Principles",
          "Terms and Conditions",
          "Blog",
          "Contact us",
          "Privacy policy",
          "Investors"
        ],
        existingMembersHeading: "Existing Members",
        existingMembersLinks: [
          "Post a task",
          "Browse tasks",
          "Login",
          "Support centre"
        ],
        popularCategoriesHeading: "Popular Categories",
        popularCategoriesLinks: [
          "Handyman Services",
          "Cleaning Services",
          "Delivery Services",
          "Removalists",
          "Gardening Services",
          "Auto Electricians",
          "Assembly Services",
          "All Services"
        ],
        popularLocationsHeading: "Popular Locations",
        popularLocations: [
          "Chennai",
          "Pune",
          "Surat",
          "Jaipur",
          "Bangalore",
          "Hyderabad",
          "Ahmedabad"
        ],
        copyrightText: "Extrahand Limited 2011-2025 ©, All rights reserved",
        appleStoreImage: "",
        appleStoreImageFile: null,
        googlePlayImage: "",
        googlePlayImageFile: null
      },
    });
    setImagePreview(null);
    setHowToEarnImagePreviews([null, null, null]);
    setTaskerImagePreviews([null, null, null]);
    setExploreOtherWaysImagePreview(null);
    setExploreOtherWaysTaskImagePreviews([null, null]);
    setAppleStoreImagePreview(null);
    setGooglePlayImagePreview(null);
    setEditingCategory(null);
    setIsCustomSubcategory(false);
  };

  // Handle edit
  const handleEdit = async (category) => {
    // Check if this is a subcategory (slug contains '/')
    const isSubcategory = category.slug && category.slug.includes('/');
    
    let categoryData = category;
    let customSubcategory = false;
    
    // If it's a subcategory, we need to extract the parent category name
    if (isSubcategory && category.categorySlug) {
      // Fetch parent category to get its name
      try {
        const parentResponse = await fetch(`${API_BASE_URL}/api/task-categories?slug=${category.categorySlug}`);
        if (parentResponse.ok) {
          const parentCategory = await parentResponse.json();
          const subcategoryName = category.name;
          
          // Check if this subcategory is in the predefined list
          const predefinedSubcategories = subcategoriesMap[parentCategory.name] || [];
          customSubcategory = !predefinedSubcategories.includes(subcategoryName);
          
          // Set the parent category name and subcategory name
          categoryData = {
            ...category,
            name: parentCategory.name || category.categorySlug,
            subcategory: subcategoryName, // Subcategory name becomes the subcategory field
            subcategorySlug: category.slug.split('/')[1] || '',
          };
        }
      } catch (error) {
        console.error('Error fetching parent category:', error);
      }
    }
    
    setIsCustomSubcategory(customSubcategory);
    
    // Determine category type based on name
    const categoryName = isSubcategory ? categoryData.name : categoryData.name;
    const isTasker = taskerCategories.includes(categoryName);
    const isPoster = posterCategories.includes(categoryName);
    
    setFormData({
      categoryType: isTasker ? "As A Tasker" : isPoster ? "As A Poster" : "",
      name: categoryName || "",
      subcategory: categoryData.subcategory || categoryData.name || "",
      subcategorySlug: categoryData.subcategorySlug || "",
      slug: categoryData.slug || "",
      heroTitle: category.heroTitle || "",
      heroDescription: category.heroDescription || "",
      heroImage: category.heroImage || "",
      imageFile: null,
      defaultEarnings: category.defaultEarnings || "₹1,039",
      earningsPeriod: category.earningsPeriod || "per month",
      earnings1to2: category.earnings1to2 || "₹1,039",
      earnings3to5: category.earnings3to5 || "₹2,598",
      earnings5plus: category.earnings5plus || "₹3,637",
      location: category.location || "India",
      disclaimer: category.disclaimer || "Based on average accounting task prices. Actual marketplace earnings may vary",
      metaTitle: category.metaTitle || "",
      metaDescription: category.metaDescription || "",
      isPublished: category.isPublished || false,
      earningsCard: category.earningsCard || {
        weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
        monthly: { "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637+" },
        yearly: { "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680+" },
      },
      earningsByJobTypes: category.earningsByJobTypes || {},
      // Why Join Extrahand Section
      whyJoinTitle: category.whyJoinTitle || "Why join Extrahand",
      whyJoinFeatures: category.whyJoinFeatures || [
        {
          title: "All on your terms",
          description: "See a job that fits your skills and timeframe? Go for it. Extrahand's flexible to your schedule."
        },
        {
          title: "Get going for free",
          description: "Check tasks and get going straight away. Services fees occur when you've completed the task."
        },
        {
          title: "Secure payments",
          description: "Nobody likes chasing money, so we secure customer payments upfront. When a task is marked complete, your bank account will know about it."
        },
        {
          title: "Skills can thrill",
          description: "Never thought your knack for crocheting would be useful? Think again. We're all about earning from unexpected skills at Extrahand."
        }
      ],
      whyJoinButtonText: category.whyJoinButtonText || "Join Extrahand",
      staticTasksSectionTitle: category.staticTasksSectionTitle || "",
      staticTasksSectionDescription: category.staticTasksSectionDescription || "Check out what tasks people want done near you right now...",
      staticTasks: category.staticTasks || [],
      browseAllTasksButtonText: category.browseAllTasksButtonText || "Browse all tasks",
      lastUpdatedText: category.lastUpdatedText || "Last updated on 4th Dec 2025",
      earningPotentialTitle: category.earningPotentialTitle || "Discover your earning potential in India",
      earningPotentialDescription: category.earningPotentialDescription || "Earn money with every accounting task",
      earningPotentialButtonText: category.earningPotentialButtonText || "Join Extrahand",
      earningPotentialData: category.earningPotentialData || {
        weekly: { "1-2": "₹240", "3-5": "₹600", "5+": "₹840+" },
        monthly: { "1-2": "₹1039", "3-5": "₹2598", "5+": "₹3637+" },
        yearly: { "1-2": "₹12480", "3-5": "₹31200", "5+": "₹43680+" },
      },
      earningPotentialDisclaimer: category.earningPotentialDisclaimer || "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
      incomeOpportunitiesTitle: category.incomeOpportunitiesTitle || "Unlock new income opportunities in India",
      incomeOpportunitiesDescription: category.incomeOpportunitiesDescription || "Explore accounting related tasks and discover your financial opportunities",
      incomeOpportunitiesData: (() => {
        // Default data
        const defaultData = {
          weekly: [
            { jobType: "Accounting", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
            { jobType: "Tax Accountants", "1-2": "₹220", "3-5": "₹550", "5+": "₹770" },
            { jobType: "XERO Accounting", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
            { jobType: "Bookkeeping", "1-2": "₹200", "3-5": "₹500", "5+": "₹700" },
            { jobType: "MYOB Accountant", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
            { jobType: "XERO Training", "1-2": "₹300", "3-5": "₹750", "5+": "₹1,050" },
            { jobType: "Payroll Accountant", "1-2": "₹240", "3-5": "₹600", "5+": "₹840" },
            { jobType: "BAS Accounting", "1-2": "₹154", "3-5": "₹385", "5+": "₹539" },
            { jobType: "Tax Advisor", "1-2": "₹178", "3-5": "₹445", "5+": "₹623" },
            { jobType: "MYOB Training", "1-2": "₹400", "3-5": "₹1,000", "5+": "₹1,400" },
          ],
          monthly: [
            { jobType: "Accounting", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
            { jobType: "Tax Accountants", "1-2": "₹953", "3-5": "₹2,382", "5+": "₹3,334" },
            { jobType: "XERO Accounting", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
            { jobType: "Bookkeeping", "1-2": "₹866", "3-5": "₹2,165", "5+": "₹3,031" },
            { jobType: "MYOB Accountant", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
            { jobType: "XERO Training", "1-2": "₹1,299", "3-5": "₹3,248", "5+": "₹4,547" },
            { jobType: "Payroll Accountant", "1-2": "₹1,039", "3-5": "₹2,598", "5+": "₹3,637" },
            { jobType: "BAS Accounting", "1-2": "₹667", "3-5": "₹1,667", "5+": "₹2,334" },
            { jobType: "Tax Advisor", "1-2": "₹771", "3-5": "₹1,927", "5+": "₹2,698" },
            { jobType: "MYOB Training", "1-2": "₹1,732", "3-5": "₹4,330", "5+": "₹6,062" },
          ],
          yearly: [
            { jobType: "Accounting", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
            { jobType: "Tax Accountants", "1-2": "₹11,440", "3-5": "₹28,600", "5+": "₹40,040" },
            { jobType: "XERO Accounting", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
            { jobType: "Bookkeeping", "1-2": "₹10,400", "3-5": "₹26,000", "5+": "₹36,400" },
            { jobType: "MYOB Accountant", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
            { jobType: "XERO Training", "1-2": "₹15,600", "3-5": "₹39,000", "5+": "₹54,600" },
            { jobType: "Payroll Accountant", "1-2": "₹12,480", "3-5": "₹31,200", "5+": "₹43,680" },
            { jobType: "BAS Accounting", "1-2": "₹8,008", "3-5": "₹20,020", "5+": "₹28,028" },
            { jobType: "Tax Advisor", "1-2": "₹9,256", "3-5": "₹23,140", "5+": "₹32,396" },
            { jobType: "MYOB Training", "1-2": "₹20,800", "3-5": "₹52,000", "5+": "₹72,800" },
          ],
        };
        
        // Check if category has incomeOpportunitiesData and if arrays are not empty
        if (category.incomeOpportunitiesData && 
            category.incomeOpportunitiesData.weekly && 
            category.incomeOpportunitiesData.weekly.length > 0 &&
            category.incomeOpportunitiesData.monthly && 
            category.incomeOpportunitiesData.monthly.length > 0 &&
            category.incomeOpportunitiesData.yearly && 
            category.incomeOpportunitiesData.yearly.length > 0) {
          return category.incomeOpportunitiesData;
        }
        
        // Return default data if missing or empty
        return defaultData;
      })(),
      incomeOpportunitiesDisclaimer: category.incomeOpportunitiesDisclaimer || "*Based on average accounting task prices in India. Actual marketplace earnings may vary",
      // How to Earn Money Section
      howToEarnTitle: category.howToEarnTitle || "How to earn money on Extrahand",
      howToEarnSteps: category.howToEarnSteps || [
        {
          image: "",
          subtitle: "Job opportunities that find you",
          description: "Set up notifications and be alerted when a nearby, well-matched job is posted. Let customers book you directly by setting up a listing. Provide a great service and work with them again with Contacts.",
        },
        {
          image: "",
          subtitle: "Set your price",
          description: "Found a job you're up for? Set your price and make an offer. You can adjust and discuss it later if you need to.",
        },
        {
          image: "",
          subtitle: "Work. Get paid. Quickly.",
          description: "When tasks are complete, request for payment to be released and money will appear in your account instantly.",
        },
      ],
      howToEarnButtonText: category.howToEarnButtonText || "Post a task",
      howToEarnImageFiles: [null, null, null],
      tasks: category.tasks || [],
      getInspiredTitle: category.getInspiredTitle || "Get Inspired: Top Accounting Taskers in India",
      getInspiredButtonText: category.getInspiredButtonText || "Join Extrahand",
      topTaskers: category.topTaskers || [
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Nathalia MID",
          yearsOnExtrahand: "3 years on Extrahand",
          location: "Ultimo NSW",
          rating: "5",
          overallRatingText: "Overall rating",
          reviewsCount: "46 reviews",
          completionRate: "98.11%",
          completionRateText: "Completion rate",
          tasksCount: "53 tasks",
        },
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Muhammad omar MID",
          yearsOnExtrahand: "8 years on Extrahand",
          location: "Clayton VIC",
          rating: "4.9",
          overallRatingText: "Overall rating",
          reviewsCount: "1140 reviews",
          completionRate: "99.93%",
          completionRateText: "Completion rate",
          tasksCount: "1382 tasks",
        },
        {
          meetText: "meet",
          profileImage: "",
          profileImageFile: null,
          name: "Emma-lee SID",
          yearsOnExtrahand: "8 years on Extrahand",
          location: "Springfield Lakes QLD",
          rating: "4.9",
          overallRatingText: "Overall rating",
          reviewsCount: "118 reviews",
          completionRate: "95.68%",
          completionRateText: "Completion rate",
        tasksCount: "162 tasks",
      },
    ],
    insuranceCoverTitle: category.insuranceCoverTitle || "We've got you covered",
    insuranceCoverDescription: category.insuranceCoverDescription || "Whether you're a posting a task or completing a task, you can do both with the peace of mind that Extrahand is there to support.",
    insuranceCoverButtonText: category.insuranceCoverButtonText || "Extrahand's insurance cover",
    insuranceCoverFeatures: category.insuranceCoverFeatures || [
      {
        icon: "human",
        subtitle: "Public liability insurance",
        subdescription: "Extrahand Insurance covers you for any accidental injury to the customer or property damage whilst performing certain task activities",
      },
      {
        icon: "star",
        subtitle: "Top rated insurance",
        subdescription: "Extrahand Insurance is provided by Chubb Insurance India Limited, one of the world's most reputable, stable and innovative",
      },
    ],
    // Top Accounting related questions Section
    questionsTitle: category.questionsTitle || (category.name ? `Top ${category.name} related questions` : ""),
    questions: category.questions || [
      {
        subtitle: "How much can I earn as a freelance bookkeeper or accountant on Airtasker?",
        description: "Most bookkeepers on Extrahand earn between ₹100 and ₹250 per task, depending on the scope. Quick tasks like reconciling Xero accounts or helping with BAS can sit around ₹100–₹150, while more involved tasks like setting up business accounts or doing a full tax return often land in the ₹200–₹600+ range. Offering a clear quote and explaining what's included can help win more tasks.",
      },
      {
        subtitle: "What types of bookkeeping and accounting tasks are most in demand?",
        description: "There's strong demand for help with Xero setup, reconciling accounts, preparing BAS, and completing tax returns—especially for small business owners and sole traders. You'll also see tasks like \"check my expenses in a spreadsheet,\" \"fix overdue taxes,\" or \"help me get my ABN sorted.\" Clients often need a mix of compliance and catch-up help, and they value clear, no-fuss communication.",
      },
      {
        subtitle: "Is there more demand for bookkeeping services at tax time?",
        description: "Absolutely! Around EOFY (June–August) and again during BAS quarters, task volume tends to spike. Many customers will post last-minute jobs like \"Need tax agent this weekend\" or \"Help me lodge 3 years of returns.\" It's a great time to update your availability and reply quickly to listings.",
      },
      {
        subtitle: "What do customers usually look for when hiring a bookkeeper or tax agent?",
        description: "They're often after someone who can \"explain things clearly,\" \"sort it fast,\" or \"clean up my books.\" Credentials like being a registered BAS or tax agent help, but so does being responsive and approachable. Clients love when you make things feel easy, especially if they're stressed or behind on their taxes.",
      },
      {
        subtitle: "How should I price services like tax returns, Xero setup, or business advice?",
        description: "For solo returns or one-off reconciliations, Taskers typically charge ₹100–₹200. Full company tax returns or multi-year catch-ups can go up to ₹600 or more, depending on the complexity. For advisory or setup tasks (like \"set up invoicing in Xero\" or \"build me a cash flow report\"), pricing by the hour (₹50–₹100/hr) or offering package rates often works well.",
      },
      {
        subtitle: "What tools or software should I be familiar with to get more jobs?",
        description: "Xero is by far the most requested, but MYOB, QuickBooks, and basic Excel come up regularly too. Knowing how to reconcile transactions, run reports, and manage payroll inside these platforms is a big plus. Customers often say things like \"need someone good with Xero\" or \"help me automate reports\"—so mentioning these tools in your profile helps you show up in searches.",
      },
      {
        subtitle: "How can I increase my earnings by offering bundled services or ongoing support?",
        description: "One-off jobs are great, but many clients need ongoing support. You could offer monthly packages for \"bookkeeping plus BAS,\" or bundle services like \"Xero setup + one hour of training.\" Regular gigs often come from jobs where the customer says things like \"need someone reliable long-term\" or \"might need this every quarter.\" After completing a job, don't be afraid to offer follow-up support—they'll appreciate it.",
      },
      {
        subtitle: "Do customers prefer in-person or remote bookkeeping and tax help?",
        description: "Most jobs can be done remotely, especially things like spreadsheets, tax returns, and software setup. But some clients still ask for \"in-person\" help, especially if they have paper receipts or need someone to \"come to the office for a few hours.\" Make it clear in your profile if you're available for remote, in-person, or hybrid—being flexible opens up more opportunities.",
      },
    ],
    // Ways to earn money with accounting tasks section
    waysToEarnTitle: category.waysToEarnTitle || "Ways to earn money with accounting tasks on Extrahand",
    waysToEarnContent: (() => {
      // If category has waysToEarnContent, check if it's old format (type/content) or new format (heading/text)
      if (category.waysToEarnContent && Array.isArray(category.waysToEarnContent) && category.waysToEarnContent.length > 0) {
        // Check if it's old format (has type and content)
        if (category.waysToEarnContent[0].type !== undefined) {
          // Convert old format to new format
          const converted = [];
          let currentItem = { heading: "", text: "" };
          
          category.waysToEarnContent.forEach((item) => {
            if (item.type === "heading") {
              // If we have accumulated text, save the previous item
              if (currentItem.text || currentItem.heading) {
                converted.push(currentItem);
              }
              // Start new item with heading
              currentItem = { heading: item.content || "", text: "" };
            } else {
              // Add text to current item
              if (currentItem.text) {
                currentItem.text += "\n\n" + (item.content || "");
              } else {
                currentItem.text = item.content || "";
              }
            }
          });
          
          // Add the last item
          if (currentItem.text || currentItem.heading) {
            converted.push(currentItem);
          }
          
          return converted.length > 0 ? converted : [
            {
              heading: "",
              text: "Accounting isn't just about crunching numbers — it's about helping individuals and businesses stay financially healthy, organised, and compliant. On Extrahand, there's steady demand for accountants and bookkeepers who can provide support on everything from day-to-day record-keeping to complex tax returns.\n\nMany of these tasks can be done remotely, giving you the flexibility to build a client base from home while working around your own schedule. Others may require on-site visits, particularly when a client needs help setting up systems or organising paperwork.",
            },
            {
              heading: "Bookkeeping and day-to-day finance management",
              text: "Bookkeeping is one of the most common requests on Extrahand, and it forms the foundation of financial management for many clients. Small businesses, sole traders, and even busy households often need someone to keep track of expenses, reconcile bank accounts, and maintain accurate financial records.\n\nThese tasks might involve entering receipts into accounting software, matching transactions, or setting up systems that make it easier for the client to stay on top of things in the future. Having experience with popular platforms like Xero, MYOB, or QuickBooks is a major advantage, as many clients are already using these tools.",
            },
            {
              heading: "Tax preparation and BAS services",
              text: "Tax season is one of the busiest times for accounting tasks on Extrahand. Individuals often look for help lodging their tax returns, while businesses may need support with BAS statements, GST reporting, or end-of-year financial statements. For registered tax agents and BAS agents, this is an excellent way to connect with clients who may later come back for broader financial services. The ability to explain tax obligations in simple, jargon-free language is a valuable skill, as many people find the process overwhelming.",
            },
            {
              heading: "Payroll and employee management",
              text: "Payroll is another area where businesses often turn to Extrahand for help. Even a small team requires accurate wage calculations, superannuation contributions, leave tracking, and compliance with Fair Work and ATO rules. Mistakes in payroll can have serious legal and financial consequences, so clients are eager to hire accountants who are thorough and experienced. Additionally, managing PAYG withholding, preparing BAS or IAS lodgements, reconciling payroll tax obligations, and ensuring proper reporting to the ATO all demand strong tax knowledge to keep businesses compliant.",
            },
            {
              heading: "System setup and advisory work",
              text: "Some clients aren't just looking for help with ongoing tasks but need assistance setting up their systems correctly from the start. This could mean moving from manual spreadsheets to a cloud-based platform, integrating point-of-sale systems with accounting software, or setting up invoicing and payment processes. Advisory tasks like these are highly valued because they save clients time and headaches in the long run.",
            },
            {
              heading: "Tips to increase your accounting income",
              text: "To maximise your opportunities on Extrahand, keep your profile detailed and professional. Highlight your qualifications, registrations, and areas of expertise so potential clients can see your credibility at a glance. Sharing testimonials, case studies, or examples of the types of businesses you've helped can also make a strong impression.\n\nSince accounting often involves handling sensitive information, trustworthiness is just as important as skill, so be clear about your professional standards. You might also outline your security practices, communication style, turnaround times, and commitment to accuracy to reassure clients that their finances are in reliable hands.",
            },
          ];
        } else {
          // Already in new format (has heading and text)
          return category.waysToEarnContent;
        }
      }
      // Default structure
      return [
        {
          heading: "",
          text: "Accounting isn't just about crunching numbers — it's about helping individuals and businesses stay financially healthy, organised, and compliant. On Extrahand, there's steady demand for accountants and bookkeepers who can provide support on everything from day-to-day record-keeping to complex tax returns.\n\nMany of these tasks can be done remotely, giving you the flexibility to build a client base from home while working around your own schedule. Others may require on-site visits, particularly when a client needs help setting up systems or organising paperwork.",
        },
        {
          heading: "Bookkeeping and day-to-day finance management",
          text: "Bookkeeping is one of the most common requests on Extrahand, and it forms the foundation of financial management for many clients. Small businesses, sole traders, and even busy households often need someone to keep track of expenses, reconcile bank accounts, and maintain accurate financial records.\n\nThese tasks might involve entering receipts into accounting software, matching transactions, or setting up systems that make it easier for the client to stay on top of things in the future. Having experience with popular platforms like Xero, MYOB, or QuickBooks is a major advantage, as many clients are already using these tools.",
        },
        {
          heading: "Tax preparation and BAS services",
          text: "Tax season is one of the busiest times for accounting tasks on Extrahand. Individuals often look for help lodging their tax returns, while businesses may need support with BAS statements, GST reporting, or end-of-year financial statements. For registered tax agents and BAS agents, this is an excellent way to connect with clients who may later come back for broader financial services. The ability to explain tax obligations in simple, jargon-free language is a valuable skill, as many people find the process overwhelming.",
        },
        {
          heading: "Payroll and employee management",
          text: "Payroll is another area where businesses often turn to Extrahand for help. Even a small team requires accurate wage calculations, superannuation contributions, leave tracking, and compliance with Fair Work and ATO rules. Mistakes in payroll can have serious legal and financial consequences, so clients are eager to hire accountants who are thorough and experienced. Additionally, managing PAYG withholding, preparing BAS or IAS lodgements, reconciling payroll tax obligations, and ensuring proper reporting to the ATO all demand strong tax knowledge to keep businesses compliant.",
        },
        {
          heading: "System setup and advisory work",
          text: "Some clients aren't just looking for help with ongoing tasks but need assistance setting up their systems correctly from the start. This could mean moving from manual spreadsheets to a cloud-based platform, integrating point-of-sale systems with accounting software, or setting up invoicing and payment processes. Advisory tasks like these are highly valued because they save clients time and headaches in the long run.",
        },
        {
          heading: "Tips to increase your accounting income",
          text: "To maximise your opportunities on Extrahand, keep your profile detailed and professional. Highlight your qualifications, registrations, and areas of expertise so potential clients can see your credibility at a glance. Sharing testimonials, case studies, or examples of the types of businesses you've helped can also make a strong impression.\n\nSince accounting often involves handling sensitive information, trustworthiness is just as important as skill, so be clear about your professional standards. You might also outline your security practices, communication style, turnaround times, and commitment to accuracy to reassure clients that their finances are in reliable hands.",
        },
      ];
    })(),
    // Explore other ways to earn money section
    exploreOtherWaysTitle: category.exploreOtherWaysTitle || "Explore other ways to earn money in India",
    exploreOtherWaysImage: category.exploreOtherWaysImage || "",
    exploreOtherWaysImageFile: null,
    exploreOtherWaysTasks: category.exploreOtherWaysTasks || [
      {
        subtitle: "Admin tasks",
        subheading: "Earn ₹240/week*",
        image: "",
        imageFile: null,
      },
      {
        subtitle: "Accounting Tutor tasks",
        subheading: "Earn ₹126/week*",
        image: "",
        imageFile: null,
      },
    ],
      exploreOtherWaysButtonText: category.exploreOtherWaysButtonText || "Explore more tasks",
      exploreOtherWaysDisclaimer: category.exploreOtherWaysDisclaimer || "*Based on average prices from 1-2 completed tasks in India. Actual marketplace earnings may vary.",
      // Top Locations Section
      topLocationsIcon: category.topLocationsIcon || "location",
      topLocationsTitle: category.topLocationsTitle || "Browse our top locations",
      topLocationsHeadings: category.topLocationsHeadings || [
        "Delhi",
        "Mumbai",
        "Kolkata",
        "Chennai",
        "Pune",
        "Surat",
        "Jaipur",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad",
        "Noida",
        "Gurugram",
      ],
      // Browse Similar Tasks Section
      browseSimilarTasksIcons: category.browseSimilarTasksIcons || [],
      browseSimilarTasksTitle: category.browseSimilarTasksTitle || "Browse similar tasks near me",
      browseSimilarTasksHeadings: category.browseSimilarTasksHeadings || [],
      // Footer Section
      footer: category.footer || {
        discoverHeading: "Discover",
        discoverLinks: [
          "How it works",
          "Extrahand for business",
          "Earn money",
          "Side Hustle Calculator",
          "Search tasks",
          "Cost Guides",
          "Service Guides",
          "Comparison Guides",
          "Gift Cards",
          "Student Discount",
          "Partners",
          "New users FAQ"
        ],
        companyHeading: "Company",
        companyLinks: [
          "About us",
          "Careers",
          "Media enquiries",
          "Community Guidelines",
          "Tasker Principles",
          "Terms and Conditions",
          "Blog",
          "Contact us",
          "Privacy policy",
          "Investors"
        ],
        existingMembersHeading: "Existing Members",
        existingMembersLinks: [
          "Post a task",
          "Browse tasks",
          "Login",
          "Support centre"
        ],
        popularCategoriesHeading: "Popular Categories",
        popularCategoriesLinks: [
          "Handyman Services",
          "Cleaning Services",
          "Delivery Services",
          "Removalists",
          "Gardening Services",
          "Auto Electricians",
          "Assembly Services",
          "All Services"
        ],
        popularLocationsHeading: "Popular Locations",
        popularLocations: [
          "Chennai",
          "Pune",
          "Surat",
          "Jaipur",
          "Bangalore",
          "Hyderabad",
          "Ahmedabad"
        ],
        copyrightText: "Extrahand Limited 2011-2025 ©, All rights reserved",
        appleStoreImage: "",
        appleStoreImageFile: null,
        googlePlayImage: "",
        googlePlayImageFile: null
      },
    });
    
    // Set tasker image previews if they exist
    if (category.topTaskers && Array.isArray(category.topTaskers)) {
      const previews = category.topTaskers.map(tasker => tasker.profileImage || null);
      setTaskerImagePreviews(previews);
    } else {
      setTaskerImagePreviews([null, null, null]);
    }
    setImagePreview(category.heroImage || null);
    // Set image previews for how to earn section
    const previews = (category.howToEarnSteps || []).map(step => step.image || null);
    setHowToEarnImagePreviews(previews.length === 3 ? previews : [null, null, null]);
    // Set image previews for explore other ways section
    setExploreOtherWaysImagePreview(category.exploreOtherWaysImage || null);
    if (category.exploreOtherWaysTasks && Array.isArray(category.exploreOtherWaysTasks)) {
      const taskPreviews = category.exploreOtherWaysTasks.map(task => task.image || null);
      setExploreOtherWaysTaskImagePreviews(taskPreviews.length === 2 ? taskPreviews : [null, null]);
    } else {
      setExploreOtherWaysTaskImagePreviews([null, null]);
    }
    // Set footer image previews
    if (category.footer) {
      setAppleStoreImagePreview(category.footer.appleStoreImage || null);
      setGooglePlayImagePreview(category.footer.googlePlayImage || null);
    } else {
      setAppleStoreImagePreview(null);
      setGooglePlayImagePreview(null);
    }
    setEditingCategory(category);
    setViewMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (category) => {
    // Determine if subcategory based on property existence OR fallback to slug check
    const isSubcategory = category.categorySlug || (category.slug && category.slug.includes('/'));
    const entityType = isSubcategory ? "subcategory" : "category";
    
    if (!confirm(`Are you sure you want to delete this ${entityType}?`)) {
      return;
    }

    try {
      setLoading(true);
      const apiEndpoint = isSubcategory ? `${API_BASE_URL}/api/task-subcategories` : `${API_BASE_URL}/api/task-categories`;
      
      const token = localStorage.getItem('token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`
      } : {};
      
      const response = await fetch(`${apiEndpoint}/${category._id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully!`);
        setMessage({ type: "success", text: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully!` });
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to delete ${entityType}`);
        setMessage({ type: "error", text: data.error || `Failed to delete ${entityType}` });
      }
    } catch (error) {
      toast.error(`Error deleting ${entityType}: ` + error.message);
      setMessage({ type: "error", text: `Error deleting ${entityType}: ` + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle submit for approval
  const handleSubmitForApproval = async (categoryId) => {
    if (!confirm('Submit this category for manager approval?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Find the category to determine if it's a subcategory
      const category = categories.find(c => c._id === categoryId);
      // Robust check for subcategory
      const isSubcategory = category && (category.categorySlug || (category.slug && category.slug.includes('/')));
      const apiEndpoint = isSubcategory 
        ? `${API_BASE_URL}/api/task-subcategories/submit/${categoryId}`
        : `${API_BASE_URL}/api/task-categories/submit/${categoryId}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const entityType = isSubcategory ? 'Subcategory' : 'Category';
        toast.success(`${entityType} submitted for approval!`);
        setMessage({ type: 'success', text: `${entityType} submitted for approval!` });
        fetchCategories();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit category');
        setMessage({ type: 'error', text: data.error || 'Failed to submit category' });
      }
    } catch (error) {
      toast.error('Error submitting category: ' + error.message);
      setMessage({ type: 'error', text: 'Error submitting category: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Task Categories Admin
          </h1>
          <p className="text-gray-600">
            Create and manage dynamic task category pages
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setViewMode("list");
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "list"
                ? "bg-[var(--color-amber-500)] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            View All Categories
          </button>
          <button
            onClick={() => {
              setViewMode("create");
              resetForm();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "create"
                ? "bg-[var(--color-amber-500)] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Create New Category
          </button>
        </div>

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                All Categories <span className="text-gray-400 font-normal text-base ml-2">({categories.length})</span>
              </h2>
            </div>
            {loading && categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500 animate-pulse">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                 <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 <p className="text-lg font-medium text-gray-600">No categories found</p>
                 <p className="text-sm text-gray-400 mt-1">Get started by creating your first category</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {categories.map((category) => (
                      <tr 
                        key={category._id} 
                        className="hover:bg-blue-50/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                              {category.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                              {category.reviewNotes && (
                                <div className="text-xs text-red-500 max-w-xs truncate" title={category.reviewNotes}>
                                   Note: {category.reviewNotes}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">{category.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm border ${
                              category.status === 'DRAFT' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                              category.status === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                              category.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              category.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                              category.status === 'PUBLISHED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {category.status === 'PENDING_APPROVAL' ? 'PENDING' : category.status || 'DRAFT'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(category);
                              }}
                              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            {(category.status === 'DRAFT' || category.status === 'REJECTED') && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubmitForApproval(category._id);
                                }}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="Submit for Approval"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(category);
                              }}
                              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`/tasks/${category.slug}`, '_blank');
                              }}
                              className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                              title="View Page"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* Create/Edit Form */}
        {(viewMode === "create" || viewMode === "edit") && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryType"
                    value={formData.categoryType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                  >
                    <option value="">Select Category Type</option>
                    <option value="As A Tasker">As A Tasker</option>
                    <option value="As A Poster">As A Poster</option>
                  </select>
                </div>

                {formData.categoryType && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      >
                        <option value="">Select Category</option>
                        {(formData.categoryType === "As A Tasker" ? taskerCategories : posterCategories).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory dropdown - always visible when category is selected */}
                    {formData.name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        {!isCustomSubcategory ? (
                          <select
                            name="subcategory"
                            value={formData.subcategory || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          >
                            <option value="">Select Subcategory (Optional)</option>
                            {subcategoriesMap[formData.name] && Array.isArray(subcategoriesMap[formData.name]) && subcategoriesMap[formData.name].length > 0 ? (
                              subcategoriesMap[formData.name].map((subcat) => (
                                <option key={subcat} value={subcat}>
                                  {subcat}
                                </option>
                              ))
                            ) : null}
                            <option value="__CUSTOM__">+ Add Custom Subcategory</option>
                          </select>
                        ) : (
                          <div className="space-y-2">
                            <input
                              type="text"
                              name="customSubcategory"
                              value={formData.subcategory || ""}
                              onChange={handleChange}
                              placeholder="Enter custom subcategory name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomSubcategory(false);
                                setFormData(prev => ({
                                  ...prev,
                                  subcategory: "",
                                  subcategorySlug: "",
                                  slug: prev.name ? generateSlug(prev.name) : prev.slug
                                }));
                              }}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              ← Back to list
                            </button>
                          </div>
                        )}
                        {formData.subcategory && (
                          <p className="text-xs text-gray-500 mt-1">
                            Subcategory slug will be auto-generated: {generateSlug(formData.subcategory)}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        placeholder="Auto-generated from category name"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.subcategory 
                          ? `Slug: ${generateSlug(formData.name)}/${generateSlug(formData.subcategory)}`
                          : formData.name 
                            ? `Auto-generated from ${formData.name}`
                            : "Will be auto-generated from category name"}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Hero Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="heroTitle"
                      value={formData.heroTitle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Accounting tasks near you"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="heroDescription"
                      value={formData.heroDescription}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Browse through over 500 Accounting tasks."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hero Image
                    </label>
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                          onChange={handleImageChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-200 file:text-amber-800 hover:file:bg-[var(--color-amber-500)]"
                        />
                        <p className="text-xs text-gray-500">
                          Only image files allowed (JPG, PNG, GIF, WEBP, SVG). Max size: 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Earnings Card */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Card</h3>
                
                {/* Earnings by Task Range */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 mb-3">Earnings by Task Range (per month)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-4 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1-2 tasks per week
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="earnings1to2"
                          value={formData.earnings1to2}
                          onChange={handleChange}
                          placeholder="₹1,039"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3-5 tasks per week
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="earnings3to5"
                          value={formData.earnings3to5}
                          onChange={handleChange}
                          placeholder="₹2,598"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>

                    <div className="border p-4 rounded-lg bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        5+ tasks per week
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="earnings5plus"
                          value={formData.earnings5plus}
                          onChange={handleChange}
                          placeholder="₹3,637"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disclaimer
                    </label>
                    <textarea
                      name="disclaimer"
                      value={formData.disclaimer}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>
                </div>
              </div>

              {/* Why Join Extrahand Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Join Extrahand Section</h3>
                
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="whyJoinTitle"
                      value={formData.whyJoinTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Why join Extrahand"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700 mb-3">Features (4 Features)</h4>
                  {formData.whyJoinFeatures.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feature {index + 1} Title
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...formData.whyJoinFeatures];
                            newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                            setFormData({ ...formData, whyJoinFeatures: newFeatures });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Feature {index + 1} Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...formData.whyJoinFeatures];
                            newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                            setFormData({ ...formData, whyJoinFeatures: newFeatures });
                          }}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="whyJoinButtonText"
                    value={formData.whyJoinButtonText}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    placeholder="Join Extrahand"
                  />
                </div>
              </div>

              {/* Task Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="staticTasksSectionTitle"
                      value={formData.staticTasksSectionTitle || (formData.name ? `${addTasksSuffix(formData.name)} in India` : "")}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder={formData.name ? `${addTasksSuffix(formData.name)} in India` : "Section Title"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically filled from category name. You can edit if needed.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Description
                    </label>
                    <input
                      type="text"
                      name="staticTasksSectionDescription"
                      value={formData.staticTasksSectionDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Check out what tasks people want done near you right now..."
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700 mb-3">Features ({formData.staticTasks.length} Features)</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newTask = {
                          title: "I need an CPA accountant to complete 2 tax returns.",
                          price: "₹160",
                          description: "I need a CPA accountant to complete 2 tax returns. small sole trader business & 1 non worker. ...Read more",
                          date: "Thu Dec 4 2025",
                          timeAgo: "about 3 hours ago",
                          status: "Open",
                          profileImage: "",
                          profileImageFile: null,
                        };
                        setFormData({
                          ...formData,
                          staticTasks: [...formData.staticTasks, newTask],
                        });
                      }}
                      className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {formData.staticTasks.map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">✅ Feature {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newTasks = formData.staticTasks.filter((_, i) => i !== index);
                            setFormData({ ...formData, staticTasks: newTasks });
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={task.title || "I need an CPA accountant to complete 2 tax returns."}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], title: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                          </label>
                          <input
                            type="text"
                            value={task.price || "₹160"}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], price: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description *
                          </label>
                          <textarea
                            value={task.description || "I need a CPA accountant to complete 2 tax returns. small sole trader business & 1 non worker. ...Read more"}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], description: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="text"
                            value={task.date || "Thu Dec 4 2025"}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], date: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            placeholder="Thu Dec 4 2025"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Ago
                          </label>
                          <input
                            type="text"
                            value={task.timeAgo || "about 3 hours ago"}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], timeAgo: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            placeholder="about 3 hours ago"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <input
                            type="text"
                            value={task.status || "Open"}
                            onChange={(e) => {
                              const newTasks = [...formData.staticTasks];
                              newTasks[index] = { ...newTasks[index], status: e.target.value };
                              setFormData({ ...formData, staticTasks: newTasks });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            placeholder="Open"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image (optional)
                          </label>
                          {task.profileImage && (
                            <div className="mb-2">
                              <img
                                src={task.profileImage}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newTasks = [...formData.staticTasks];
                                  newTasks[index] = { ...newTasks[index], profileImage: "", profileImageFile: null };
                                  setFormData({ ...formData, staticTasks: newTasks });
                                }}
                                className="ml-2 text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;

                              const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                              if (!validImageTypes.includes(file.type)) {
                                setMessage({ type: "error", text: "Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)" });
                                return;
                              }

                              if (file.size > 5 * 1024 * 1024) {
                                setMessage({ type: "error", text: "Image size must be less than 5MB" });
                                return;
                              }

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const newTasks = [...formData.staticTasks];
                                newTasks[index] = {
                                  ...newTasks[index],
                                  profileImage: reader.result,
                                  profileImageFile: file,
                                };
                                setFormData({ ...formData, staticTasks: newTasks });
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-200 file:text-amber-800 hover:file:bg-[var(--color-amber-500)]"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Profile Image Logic: User uploaded image or No image (default human icon). Only image files allowed (JPG, PNG, GIF, WEBP, SVG). Max size: 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Section */}
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-medium text-gray-700 mb-4">Footer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Browse All Tasks Button Text
                      </label>
                      <input
                        type="text"
                        name="browseAllTasksButtonText"
                        value={formData.browseAllTasksButtonText}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        placeholder="Browse all tasks"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Updated Text
                      </label>
                      <input
                        type="text"
                        name="lastUpdatedText"
                        value={formData.lastUpdatedText}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        placeholder="Last updated on 4th Dec 2025"
                      />
                    </div>
                  </div>
                </div>
              </div>

             

              {/* Earning Potential Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earning Potential Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="earningPotentialTitle"
                      value={formData.earningPotentialTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Discover your earning potential in India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Description
                    </label>
                    <input
                      type="text"
                      name="earningPotentialDescription"
                      value={formData.earningPotentialDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder={formData.name ? `Earn money with every ${formData.name} task` : "Earn money with every [category name] task"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="earningPotentialButtonText"
                      value={formData.earningPotentialButtonText}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Join Extrahand"
                    />
                  </div>
                </div>

                {/* Earning Potential Data by Period */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700 mb-3">Earning Potential Data</h4>
                  
                  {/* Weekly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-3">Weekly</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          1-2 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.weekly?.["1-2"] || "₹240"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                weekly: {
                                  ...formData.earningPotentialData?.weekly,
                                  "1-2": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          3-5 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.weekly?.["3-5"] || "₹600"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                weekly: {
                                  ...formData.earningPotentialData?.weekly,
                                  "3-5": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          5+ tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.weekly?.["5+"] || "₹840+"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                weekly: {
                                  ...formData.earningPotentialData?.weekly,
                                  "5+": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-3">Monthly</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          1-2 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.monthly?.["1-2"] || "₹1039"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                monthly: {
                                  ...formData.earningPotentialData?.monthly,
                                  "1-2": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          3-5 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.monthly?.["3-5"] || "₹2598"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                monthly: {
                                  ...formData.earningPotentialData?.monthly,
                                  "3-5": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          5+ tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.monthly?.["5+"] || "₹3637+"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                monthly: {
                                  ...formData.earningPotentialData?.monthly,
                                  "5+": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-700 mb-3">Yearly</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          1-2 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.yearly?.["1-2"] || "₹12480"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                yearly: {
                                  ...formData.earningPotentialData?.yearly,
                                  "1-2": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          3-5 tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.yearly?.["3-5"] || "₹31200"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                yearly: {
                                  ...formData.earningPotentialData?.yearly,
                                  "3-5": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          5+ tasks per week
                        </label>
                        <input
                          type="text"
                          value={formData.earningPotentialData?.yearly?.["5+"] || "₹43680+"}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              earningPotentialData: {
                                ...formData.earningPotentialData,
                                yearly: {
                                  ...formData.earningPotentialData?.yearly,
                                  "5+": e.target.value,
                                },
                              },
                            });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disclaimer
                  </label>
                  <input
                    type="text"
                    name="earningPotentialDisclaimer"
                    value={formData.earningPotentialDisclaimer || "*Based on average accounting task prices in India. Actual marketplace earnings may vary"}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        earningPotentialDisclaimer: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    placeholder="*Based on average accounting task prices in India. Actual marketplace earnings may vary"
                  />
                </div>

                {/* Button Text */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    name="earningPotentialButtonText"
                    value={formData.earningPotentialButtonText}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    placeholder="Join Extrahand"
                  />
                </div>
              </div>


               {/* Income Opportunities Section */}
               <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Opportunities Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="incomeOpportunitiesTitle"
                      value={formData.incomeOpportunitiesTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Unlock new income opportunities in India"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Description
                    </label>
                    <input
                      type="text"
                      name="incomeOpportunitiesDescription"
                      value={formData.incomeOpportunitiesDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder={formData.name ? `Explore ${formData.name} related tasks and discover your financial opportunities` : "Explore [category] related tasks and discover your financial opportunities"}
                    />
                  </div>
                </div>

                {/* Income Opportunities Data by Period */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700 mb-3">Income Opportunities Data</h4>
                  
                  {/* Weekly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-700">Weekly</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const newData = { ...formData.incomeOpportunitiesData };
                          newData.weekly = [...(newData.weekly || []), { jobType: "", "1-2": "", "3-5": "", "5+": "" }];
                          setFormData({ ...formData, incomeOpportunitiesData: newData });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Row
                      </button>
                    </div>
                    {/* Header Row */}
                    <div className="grid grid-cols-5 gap-2 items-center mb-2 pb-2 border-b border-gray-300">
                      <div className="text-sm font-semibold text-gray-700">Type of {formData.name || "accounting"} job</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">1-2 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">3-5 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">5+ tasks/week</div>
                      <div></div>
                    </div>
                    <div className="space-y-3">
                      {(formData.incomeOpportunitiesData?.weekly || []).map((row, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 items-center">
                          <input
                            type="text"
                            value={row.jobType || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.weekly[index].jobType = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="Job Type"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["1-2"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.weekly[index]["1-2"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="1-2 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["3-5"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.weekly[index]["3-5"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="3-5 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["5+"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.weekly[index]["5+"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="5+ tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.weekly = newData.weekly.filter((_, i) => i !== index);
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-700">Monthly</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const newData = { ...formData.incomeOpportunitiesData };
                          newData.monthly = [...(newData.monthly || []), { jobType: "", "1-2": "", "3-5": "", "5+": "" }];
                          setFormData({ ...formData, incomeOpportunitiesData: newData });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Row
                      </button>
                    </div>
                    {/* Header Row */}
                    <div className="grid grid-cols-5 gap-2 items-center mb-2 pb-2 border-b border-gray-300">
                      <div className="text-sm font-semibold text-gray-700">Type of {formData.name || "accounting"} job</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">1-2 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">3-5 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">5+ tasks/week</div>
                      <div></div>
                    </div>
                    <div className="space-y-3">
                      {(formData.incomeOpportunitiesData?.monthly || []).map((row, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 items-center">
                          <input
                            type="text"
                            value={row.jobType || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.monthly[index].jobType = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="Job Type"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["1-2"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.monthly[index]["1-2"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="1-2 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["3-5"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.monthly[index]["3-5"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="3-5 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["5+"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.monthly[index]["5+"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="5+ tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.monthly = newData.monthly.filter((_, i) => i !== index);
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yearly */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-700">Yearly</h5>
                      <button
                        type="button"
                        onClick={() => {
                          const newData = { ...formData.incomeOpportunitiesData };
                          newData.yearly = [...(newData.yearly || []), { jobType: "", "1-2": "", "3-5": "", "5+": "" }];
                          setFormData({ ...formData, incomeOpportunitiesData: newData });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-1 px-3 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Row
                      </button>
                    </div>
                    {/* Header Row */}
                    <div className="grid grid-cols-5 gap-2 items-center mb-2 pb-2 border-b border-gray-300">
                      <div className="text-sm font-semibold text-gray-700">Type of {formData.name || "accounting"} job</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">1-2 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">3-5 tasks/week</div>
                      <div className="text-sm font-semibold text-gray-700 text-center">5+ tasks/week</div>
                      <div></div>
                    </div>
                    <div className="space-y-3">
                      {(formData.incomeOpportunitiesData?.yearly || []).map((row, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 items-center">
                          <input
                            type="text"
                            value={row.jobType || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.yearly[index].jobType = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="Job Type"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["1-2"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.yearly[index]["1-2"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="1-2 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["3-5"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.yearly[index]["3-5"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="3-5 tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <input
                            type="text"
                            value={row["5+"] || ""}
                            onChange={(e) => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.yearly[index]["5+"] = e.target.value;
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            placeholder="5+ tasks/week"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newData = { ...formData.incomeOpportunitiesData };
                              newData.yearly = newData.yearly.filter((_, i) => i !== index);
                              setFormData({ ...formData, incomeOpportunitiesData: newData });
                            }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disclaimer
                  </label>
                  <input
                    type="text"
                    name="incomeOpportunitiesDisclaimer"
                    value={formData.incomeOpportunitiesDisclaimer || "*Based on average accounting task prices in India. Actual marketplace earnings may vary"}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        incomeOpportunitiesDisclaimer: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    placeholder="*Based on average [category] task prices in India. Actual marketplace earnings may vary"
                  />
                </div>
              </div>

              {/* How to Earn Money Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Earn Money Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="howToEarnTitle"
                      value={formData.howToEarnTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="How to earn money on Extrahand"
                    />
                  </div>

                  {/* Steps */}
                  {formData.howToEarnSteps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <h4 className="text-md font-semibold text-gray-800">Step {index + 1}</h4>
                      
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image {index + 1}
                        </label>
                        {howToEarnImagePreviews[index] ? (
                          <div className="relative inline-block">
                            <img
                              src={howToEarnImagePreviews[index]}
                              alt={`Step ${index + 1} preview`}
                              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHowToEarnImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleHowToEarnImageUpload(index, e)}
                              className="hidden"
                              id={`howToEarnImage-${index}`}
                            />
                            <label
                              htmlFor={`howToEarnImage-${index}`}
                              className="cursor-pointer flex flex-col items-center justify-center"
                            >
                              <span className="text-sm text-gray-600">Choose Image</span>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={step.subtitle || ""}
                          onChange={(e) => {
                            const newSteps = [...formData.howToEarnSteps];
                            newSteps[index].subtitle = e.target.value;
                            setFormData({ ...formData, howToEarnSteps: newSteps });
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          placeholder={`Step ${index + 1} subtitle`}
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={step.description || ""}
                          onChange={(e) => {
                            const newSteps = [...formData.howToEarnSteps];
                            newSteps[index].description = e.target.value;
                            setFormData({ ...formData, howToEarnSteps: newSteps });
                          }}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          placeholder={`Step ${index + 1} description`}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Button Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="howToEarnButtonText"
                      value={formData.howToEarnButtonText}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Post a task"
                    />
                  </div>
                </div>
              </div>

              {/* Get Inspired: Top Accounting Taskers Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Inspired: Top  Taskers Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="getInspiredTitle"
                      value={formData.getInspiredTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>

                 
                </div>

                {/* Tasker Cards */}
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700 mb-3">Top Taskers (3 Taskers)</h4>
                  {formData.topTaskers.map((tasker, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">Tasker {index + 1}</h4>
                      </div>

                      <div className="space-y-4">
                        {/* Meet Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meet Text
                          </label>
                          <input
                            type="text"
                            value={tasker.meetText || "meet"}
                            onChange={(e) => {
                              const newTaskers = [...formData.topTaskers];
                              newTaskers[index] = { ...newTaskers[index], meetText: e.target.value };
                              setFormData({ ...formData, topTaskers: newTaskers });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        {/* Profile Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image (Circular)
                          </label>
                          {taskerImagePreviews[index] ? (
                            <div className="space-y-2">
                              <div className="relative w-24 h-24">
                                <img
                                  src={taskerImagePreviews[index]}
                                  alt={`Tasker ${index + 1} preview`}
                                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveTaskerImage(index)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                Remove Image
                              </button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                                onChange={(e) => handleTaskerImageUpload(index, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-200 file:text-amber-800 hover:file:bg-[var(--color-amber-500)]"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Only image files allowed (JPG, PNG, GIF, WEBP, SVG). Max size: 5MB
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name (Subtitle)
                          </label>
                          <input
                            type="text"
                            value={tasker.name || ""}
                            onChange={(e) => {
                              const newTaskers = [...formData.topTaskers];
                              newTaskers[index] = { ...newTaskers[index], name: e.target.value };
                              setFormData({ ...formData, topTaskers: newTaskers });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        {/* Years on Extrahand */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Years on Extrahand
                          </label>
                          <input
                            type="text"
                            value={tasker.yearsOnExtrahand || ""}
                            onChange={(e) => {
                              const newTaskers = [...formData.topTaskers];
                              newTaskers[index] = { ...newTaskers[index], yearsOnExtrahand: e.target.value };
                              setFormData({ ...formData, topTaskers: newTaskers });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location (with location icon)
                          </label>
                          <input
                            type="text"
                            value={tasker.location || ""}
                            onChange={(e) => {
                              const newTaskers = [...formData.topTaskers];
                              newTaskers[index] = { ...newTaskers[index], location: e.target.value };
                              setFormData({ ...formData, topTaskers: newTaskers });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        {/* Rating Section */}
                        <div className="border border-gray-300 rounded-lg p-4 bg-white">
                          <h5 className="font-medium text-gray-700 mb-3">Rating & Stats</h5>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left side: Rating */}
                            <div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Rating (with star icon)
                                </label>
                                <input
                                  type="text"
                                  value={tasker.rating || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], rating: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Overall Rating Text
                                </label>
                                <input
                                  type="text"
                                  value={tasker.overallRatingText || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], overallRatingText: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reviews Count
                                </label>
                                <input
                                  type="text"
                                  value={tasker.reviewsCount || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], reviewsCount: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                            </div>

                            {/* Right side: Completion Rate */}
                            <div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Completion Rate (%)
                                </label>
                                <input
                                  type="text"
                                  value={tasker.completionRate || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], completionRate: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                              <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Completion Rate Text
                                </label>
                                <input
                                  type="text"
                                  value={tasker.completionRateText || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], completionRateText: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tasks Count
                                </label>
                                <input
                                  type="text"
                                  value={tasker.tasksCount || ""}
                                  onChange={(e) => {
                                    const newTaskers = [...formData.topTaskers];
                                    newTaskers[index] = { ...newTaskers[index], tasksCount: e.target.value };
                                    setFormData({ ...formData, topTaskers: newTaskers });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-6">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="getInspiredButtonText"
                      value={formData.getInspiredButtonText}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>
              </div>

              {/* We've Got You Covered Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">We&apos;ve Got You Covered Section</h3>
                
                <div className="space-y-4 mb-6">
                  {/* First Column - Title, Description, Button */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">First Column</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          name="insuranceCoverTitle"
                          value={formData.insuranceCoverTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="insuranceCoverDescription"
                          value={formData.insuranceCoverDescription}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          name="insuranceCoverButtonText"
                          value={formData.insuranceCoverButtonText}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Second and Third Columns - Features */}
                  <div className="space-y-4">
                    {/* <h4 className="font-medium text-gray-700 mb-3">Second & Third Columns (2 Features)</h4> */}
                    {formData.insuranceCoverFeatures.map((feature, index) => {
                      // Set icon automatically: index 0 = human, index 1 = star
                      const iconType = index === 0 ? "human" : "star";
                      const iconLabel = index === 0 ? "Human icon" : "Star icon";
                      
                      return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700">Column {index + 2}</h4>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle (with {iconLabel})
                            </label>
                            <input
                              type="text"
                              value={feature.subtitle || ""}
                              onChange={(e) => {
                                const newFeatures = [...formData.insuranceCoverFeatures];
                                newFeatures[index] = { ...newFeatures[index], subtitle: e.target.value, icon: iconType };
                                setFormData({ ...formData, insuranceCoverFeatures: newFeatures });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subdescription
                            </label>
                            <textarea
                              value={feature.subdescription || ""}
                              onChange={(e) => {
                                const newFeatures = [...formData.insuranceCoverFeatures];
                                newFeatures[index] = { ...newFeatures[index], subdescription: e.target.value, icon: iconType };
                                setFormData({ ...formData, insuranceCoverFeatures: newFeatures });
                              }}
                              rows="3"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                            />
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Accounting related questions Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {formData.name ? `Top ${formData.name} related questions Section` : "Top Accounting related questions Section"}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="questionsTitle"
                      value={formData.questionsTitle || (formData.name ? `Top ${formData.name} related questions` : "")}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder={formData.name ? `Top ${formData.name} related questions` : "Section Title"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically filled from category name. You can edit if needed.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-700 mb-3">Questions ({formData.questions.length} Questions)</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newQuestion = {
                          subtitle: "",
                          description: "",
                        };
                        setFormData({
                          ...formData,
                          questions: [...formData.questions, newQuestion],
                        });
                      }}
                      className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    >
                      Add Question
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">Question {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newQuestions = formData.questions.filter((_, i) => i !== index);
                            setFormData({ ...formData, questions: newQuestions });
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subtitle (Question) *
                          </label>
                          <input
                            type="text"
                            value={question.subtitle || ""}
                            onChange={(e) => {
                              const newQuestions = [...formData.questions];
                              newQuestions[index] = { ...newQuestions[index], subtitle: e.target.value };
                              setFormData({ ...formData, questions: newQuestions });
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Answer) *
                          </label>
                          <textarea
                            value={question.description || ""}
                            onChange={(e) => {
                              const newQuestions = [...formData.questions];
                              newQuestions[index] = { ...newQuestions[index], description: e.target.value };
                              setFormData({ ...formData, questions: newQuestions });
                            }}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ways to earn money with accounting tasks Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ways to earn money with accounting tasks Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="waysToEarnTitle"
                      value={formData.waysToEarnTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Ways to earn money with accounting tasks on Extrahand"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Content Items ({formData.waysToEarnContent.length} items)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newContent = [...formData.waysToEarnContent, { heading: "", text: "" }];
                          setFormData({ ...formData, waysToEarnContent: newContent });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Content Item
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.waysToEarnContent.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-700">Item {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newContent = formData.waysToEarnContent.filter((_, i) => i !== index);
                                setFormData({ ...formData, waysToEarnContent: newContent });
                              }}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heading
                              </label>
                              <input
                                type="text"
                                value={item.heading || ""}
                                onChange={(e) => {
                                  const newContent = [...formData.waysToEarnContent];
                                  newContent[index] = { ...newContent[index], heading: e.target.value };
                                  setFormData({ ...formData, waysToEarnContent: newContent });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Enter heading (optional)"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Text Content
                              </label>
                              <textarea
                                value={item.text || ""}
                                onChange={(e) => {
                                  const newContent = [...formData.waysToEarnContent];
                                  newContent[index] = { ...newContent[index], text: e.target.value };
                                  setFormData({ ...formData, waysToEarnContent: newContent });
                                }}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Enter text content"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Explore other ways to earn money Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore other ways to earn money Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="exploreOtherWaysTitle"
                      value={formData.exploreOtherWaysTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Explore other ways to earn money in India"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Task Cards ({formData.exploreOtherWaysTasks.length} tasks)
                      </label>
                    </div>

                    <div className="space-y-4">
                      {formData.exploreOtherWaysTasks.map((task, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-700">Task {index + 1}</h4>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image
                              </label>
                              {exploreOtherWaysTaskImagePreviews[index] || task.image ? (
                                <div className="relative inline-block">
                                  <img
                                    src={exploreOtherWaysTaskImagePreviews[index] || task.image}
                                    alt={`Task ${index + 1} preview`}
                                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExploreOtherWaysTaskImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleExploreOtherWaysTaskImageUpload(index, e)}
                                    className="hidden"
                                    id={`exploreOtherWaysTaskImage-${index}`}
                                  />
                                  <label
                                    htmlFor={`exploreOtherWaysTaskImage-${index}`}
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                  >
                                    <span className="text-sm text-gray-600">Choose Image</span>
                                  </label>
                                </div>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtitle
                              </label>
                              <input
                                type="text"
                                value={task.subtitle || ""}
                                onChange={(e) => {
                                  const newTasks = [...formData.exploreOtherWaysTasks];
                                  newTasks[index] = { ...newTasks[index], subtitle: e.target.value };
                                  setFormData({ ...formData, exploreOtherWaysTasks: newTasks });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="e.g., Admin tasks"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subheading (Earnings)
                              </label>
                              <input
                                type="text"
                                value={task.subheading || ""}
                                onChange={(e) => {
                                  const newTasks = [...formData.exploreOtherWaysTasks];
                                  newTasks[index] = { ...newTasks[index], subheading: e.target.value };
                                  setFormData({ ...formData, exploreOtherWaysTasks: newTasks });
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="e.g., Earn ₹240/week*"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      name="exploreOtherWaysButtonText"
                      value={formData.exploreOtherWaysButtonText}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Explore more tasks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disclaimer
                    </label>
                    <textarea
                      name="exploreOtherWaysDisclaimer"
                      value={formData.exploreOtherWaysDisclaimer}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="*Based on average prices from 1-2 completed tasks in India. Actual marketplace earnings may vary."
                    />
                  </div>
                </div>
              </div>

              {/* Top Locations Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="topLocationsTitle"
                      value={formData.topLocationsTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Browse our top locations"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Location Headings ({formData.topLocationsHeadings.length} locations)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newHeadings = [...formData.topLocationsHeadings, ""];
                          setFormData({ ...formData, topLocationsHeadings: newHeadings });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Location
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.topLocationsHeadings.map((heading, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-700">Location {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                const newHeadings = formData.topLocationsHeadings.filter((_, i) => i !== index);
                                setFormData({ ...formData, topLocationsHeadings: newHeadings });
                              }}
                              className="text-red-600 hover:text-red-800 font-semibold text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Heading
                            </label>
                            <input
                              type="text"
                              value={heading || ""}
                              onChange={(e) => {
                                const newHeadings = [...formData.topLocationsHeadings];
                                newHeadings[index] = e.target.value;
                                setFormData({ ...formData, topLocationsHeadings: newHeadings });
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                              placeholder="e.g., Delhi"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Browse Similar Tasks Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Similar Tasks Section</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      name="browseSimilarTasksTitle"
                      value={formData.browseSimilarTasksTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                      placeholder="Browse similar tasks near me"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Task Headings ({formData.browseSimilarTasksHeadings.length} tasks)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newHeadings = [...formData.browseSimilarTasksHeadings, ""];
                          const newIcons = [...formData.browseSimilarTasksIcons, "wrench"];
                          setFormData({ 
                            ...formData, 
                            browseSimilarTasksHeadings: newHeadings,
                            browseSimilarTasksIcons: newIcons
                          });
                        }}
                        className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                      >
                        Add Task
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.browseSimilarTasksHeadings.map((heading, index) => {
                        return (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium text-gray-700">Task {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  const newHeadings = formData.browseSimilarTasksHeadings.filter((_, i) => i !== index);
                                  const newIcons = formData.browseSimilarTasksIcons.filter((_, i) => i !== index);
                                  setFormData({ 
                                    ...formData, 
                                    browseSimilarTasksHeadings: newHeadings,
                                    browseSimilarTasksIcons: newIcons
                                  });
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold text-sm"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Heading
                                </label>
                                <input
                                  type="text"
                                  value={heading || ""}
                                  onChange={(e) => {
                                    const newHeadings = [...formData.browseSimilarTasksHeadings];
                                    newHeadings[index] = e.target.value;
                                    setFormData({ ...formData, browseSimilarTasksHeadings: newHeadings });
                                  }}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                  placeholder="e.g., Financial Modelling"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Section</h3>
                
                {formData.footer && (
                <div className="space-y-6">
                  {/* First Column - Discover */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">First Column - Discover</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={formData.footer?.discoverHeading || ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                discoverHeading: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Links ({formData.footer?.discoverLinks?.length || 0} links)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  discoverLinks: [...(prev.footer?.discoverLinks || []), ""],
                                },
                              }));
                            }}
                            className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                          >
                            Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(formData.footer?.discoverLinks || []).map((link, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...(formData.footer?.discoverLinks || [])];
                                  newLinks[index] = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      discoverLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Link text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = (formData.footer?.discoverLinks || []).filter((_, i) => i !== index);
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      discoverLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold px-3"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second Column - Company */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">Second Column - Company</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={formData.footer.companyHeading}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                companyHeading: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Links ({formData.footer.companyLinks.length} links)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  companyLinks: [...prev.footer.companyLinks, ""],
                                },
                              }));
                            }}
                            className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                          >
                            Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formData.footer.companyLinks.map((link, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...formData.footer.companyLinks];
                                  newLinks[index] = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      companyLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Link text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = formData.footer.companyLinks.filter((_, i) => i !== index);
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      companyLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold px-3"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Column - Existing Members */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">Third Column - Existing Members</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={formData.footer.existingMembersHeading}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                existingMembersHeading: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Links ({formData.footer.existingMembersLinks.length} links)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  existingMembersLinks: [...prev.footer.existingMembersLinks, ""],
                                },
                              }));
                            }}
                            className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                          >
                            Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formData.footer.existingMembersLinks.map((link, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...formData.footer.existingMembersLinks];
                                  newLinks[index] = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      existingMembersLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Link text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = formData.footer.existingMembersLinks.filter((_, i) => i !== index);
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      existingMembersLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold px-3"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fourth Column - Popular Categories */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">Fourth Column - Popular Categories</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={formData.footer.popularCategoriesHeading}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                popularCategoriesHeading: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Links ({formData.footer.popularCategoriesLinks.length} links)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  popularCategoriesLinks: [...prev.footer.popularCategoriesLinks, ""],
                                },
                              }));
                            }}
                            className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                          >
                            Add Link
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formData.footer.popularCategoriesLinks.map((link, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={link}
                                onChange={(e) => {
                                  const newLinks = [...formData.footer.popularCategoriesLinks];
                                  newLinks[index] = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      popularCategoriesLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Link text"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = formData.footer.popularCategoriesLinks.filter((_, i) => i !== index);
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      popularCategoriesLinks: newLinks,
                                    },
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold px-3"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fifth Column - Popular Locations */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">Fifth Column - Popular Locations</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={formData.footer.popularLocationsHeading}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                popularLocationsHeading: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Locations ({formData.footer.popularLocations.length} locations)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                footer: {
                                  ...prev.footer,
                                  popularLocations: [...prev.footer.popularLocations, ""],
                                },
                              }));
                            }}
                            className="bg-[var(--color-amber-500)] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
                          >
                            Add Location
                          </button>
                        </div>

                        <div className="space-y-2">
                          {formData.footer.popularLocations.map((location, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => {
                                  const newLocations = [...formData.footer.popularLocations];
                                  newLocations[index] = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      popularLocations: newLocations,
                                    },
                                  }));
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                                placeholder="Location name"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newLocations = formData.footer.popularLocations.filter((_, i) => i !== index);
                                  setFormData((prev) => ({
                                    ...prev,
                                    footer: {
                                      ...prev.footer,
                                      popularLocations: newLocations,
                                    },
                                  }));
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold px-3"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section - Copyright and App Store Images */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">Bottom Section</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Copyright Text
                        </label>
                        <input
                          type="text"
                          value={formData.footer.copyrightText}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                copyrightText: e.target.value,
                              },
                            }));
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Apple Store Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apple Store Image
                          </label>
                          {appleStoreImagePreview || formData.footer.appleStoreImage ? (
                            <div className="relative inline-block">
                              <img
                                src={appleStoreImagePreview || formData.footer.appleStoreImage}
                                alt="Apple Store preview"
                                className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveAppleStoreImage}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAppleStoreImageUpload}
                                className="hidden"
                                id="appleStoreImage"
                              />
                              <label
                                htmlFor="appleStoreImage"
                                className="cursor-pointer flex flex-col items-center justify-center"
                              >
                                <span className="text-sm text-gray-600">Choose Apple Store Image</span>
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Google Play Image */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Google Play Image
                          </label>
                          {googlePlayImagePreview || formData.footer.googlePlayImage ? (
                            <div className="relative inline-block">
                              <img
                                src={googlePlayImagePreview || formData.footer.googlePlayImage}
                                alt="Google Play preview"
                                className="w-32 h-32 object-contain rounded-lg border border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveGooglePlayImage}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleGooglePlayImageUpload}
                                className="hidden"
                                id="googlePlayImage"
                              />
                              <label
                                htmlFor="googlePlayImage"
                                className="cursor-pointer flex flex-col items-center justify-center"
                              >
                                <span className="text-sm text-gray-600">Choose Google Play Image</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* SEO */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-amber-500)] focus:border-[var(--color-amber-500)]"
                    />
                  </div>
                </div>
              </div>

              {/* Published Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-[var(--color-amber-500)] focus:ring-[var(--color-amber-500)] border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Publish this category
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[var(--color-amber-500)] text-white rounded-lg font-medium hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-[var(--color-amber-500)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setViewMode("list");
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCategoriesAdmin;

