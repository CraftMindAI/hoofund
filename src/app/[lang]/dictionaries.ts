import { notFound } from "next/navigation";

export const locales = ["ta", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ta";

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const contact = {
  whatsapp: "+91 81110 34557",
  whatsappUrl: "https://wa.me/918111034557",
  email: "thirumoorthim2200@gmail.com",
};

export const plans = [
  { id: 1, cows: 1, investment: "₹85,000", monthly: "₹9,000", total: "₹5,82,400" },
  { id: 2, cows: 2, investment: "₹1,70,000", monthly: "₹18,000", total: "₹11,64,800" },
  { id: 3, cows: 3, investment: "₹2,50,000", monthly: "₹25,000", total: "₹16,57,200" },
  { id: 4, cows: 4, investment: "₹3,50,000", monthly: "₹33,000", total: "₹20,94,600" },
  { id: 5, cows: 6, investment: "₹5,00,000", monthly: "₹42,000", total: "₹28,04,400" },
];

// Text wrapped in **double asterisks** is rendered bold.
const en = {
  meta: {
    title: "Hoofund — Grow your dairy with investment from the city",
    description:
      "Hoofund connects village dairy farmers with city investors. Get a new cow or cash, a fixed monthly payment and full support for 5 years.",
  },
  nav: {
    about: "About",
    benefits: "Benefits",
    plans: "Plans",
    how: "How it works",
    terms: "Terms",
    join: "Join now",
    language: "Language",
  },
  hero: {
    eyebrow: "For dairy farmers & agriculture partners",
    title: "Grow your dairy with investment from the city",
    subtitle:
      "You care for the cows. We bring the investment, a steady monthly income and full support for 5 years.",
    primary: "Chat on WhatsApp",
    secondary: "See the plans",
    highlights: ["5 years of full support", "Fixed pay 9 months a year", "The cow is yours"],
    tagline: "Invest in a healthy tomorrow",
    marquee: [
      "New cow or cash",
      "Fixed monthly payment",
      "The cow is yours after 5 years",
      "Biogas income",
      "Health & insurance support",
      "Extra earnings in the dry months",
      "Weekly monitoring & visits",
    ],
  },
  who: {
    title: "Who we are",
    body: "Hoofund is a digital dairy platform. We connect village dairy farmers with working professionals in the cities who want to take part in agriculture.",
  },
  what: {
    title: "What we do",
    body: "We bring city investment to you for cows, pay you every month to feed and care for them, arrange milk sales, and track every cow with weekly monitoring and regular visits.",
  },
  photos: {
    hero: "A mother cow nursing her calf in a village in Andhra Pradesh",
    badgeTitle: "5 years",
    badgeBody: "full support",
    calfBadge: "Every calf is yours",
    gallery: [
      { src: "cow-grazing", alt: "A brown cow grazing in a green meadow", caption: "The cow is yours after 5 years" },
      { src: "calf-portrait", alt: "Close-up of a young calf", caption: "Every calf born also belongs to you" },
      { src: "calf-walking", alt: "A young calf walking through a field", caption: "Weekly monitoring and regular visits" },
    ],
    credit: "Photos: Pexels",
    banner: {
      title: "Invest in a healthy tomorrow",
      alt: "A farmer ploughing a field with oxen near Chennai",
      video: "Life on a village dairy farm: cows grazing, hand milking, children playing",
    },
    earnings: [
      { src: "milk", alt: "Fresh milk being poured into a metal can", title: "Milk", body: "Milk sold, everyone earns. Plus ₹5 for every litre supplied in the dry months." },
      { src: "cow-fodder", alt: "A cow eating fresh green fodder", title: "Feed & care", body: "Fixed monthly payment for feed and care, 9 months every year." },
      { src: "biogas", alt: "A farmer feeding calves beside a village biogas plant", title: "Biogas", body: "₹10,000–12,000 per cow per year from cow waste." },
    ],
  },
  benefits: {
    title: "Your benefits",
    items: [
      "**A new cow, or cash** for the cow you already have",
      "**Fixed monthly payment** for feed and care",
      "**The cow is yours** after 5 years, and so are its calves",
      "**Yearly support** for cow health and insurance",
      "**Biogas income** from cow waste (100% in Plans 1–3, 50% in Plans 4–5)",
      "**Extra earnings** in the dry months",
    ],
  },
  plans: {
    title: "Partner plans",
    plan: "Plan",
    cows: "Cows",
    cow: "cow",
    cowsUnit: "cows",
    investment: "Investment",
    monthly: "Monthly payment",
    monthlyNote: "9 months",
    total: "You receive in 5 years",
    note: "Total you receive in 5 years: monthly feed and care payments, dry-month payments, cow health support and your biogas share. Feed is paid by you from the monthly payment. After 5 years the cows are yours.",
  },
  how: {
    title: "How we connect city people to you",
    steps: [
      { title: "City investors", body: "IT and office workers invest in cows" },
      { title: "Hoofund", body: "Agreements, payments and tracking" },
      { title: "You, the farmer", body: "Care for the cow, get paid monthly" },
      { title: "Milk & growth", body: "Milk sold, everyone earns" },
    ],
  },
  advantages: {
    title: "Advantages",
    items: [
      "**Fixed monthly payment** for 9 months each year, for feed and care: ₹9,000 for 1 cow up to ₹42,000 for 6 cows (see plan table)",
      "**₹5,000 per cow, per month** in the 3 dry months, plus ₹5 for every litre supplied",
      "**New cow or cash:** use the investment to buy a new cow, or take cash for your existing cow (bonded for 5 years)",
      "**The cow is yours** after 5 years, and every calf born also belongs to you",
      "**₹5,000 per cow, per year** from Year 2 to Year 5 for medical expenses or cow insurance",
      "**Biogas: ₹10,000–12,000** per cow per year from cow waste. Plans 1–3: 100% yours · Plans 4–5: 50% yours",
    ],
    tax: "**No income tax to pay for most partners:** these earnings are below the income-tax limit. Any TDS deducted can be claimed back when you file your return.",
  },
  terms: {
    title: "Terms & conditions",
    items: [
      "Each cow is bonded to Hoofund for 5 years.",
      "The bonded cow cannot be sold, swapped, pledged for a loan or moved without our written permission.",
      "For an existing cow, share the last 1 month's milk bill from your milk society or association, showing the litres supplied.",
      "New cow: minimum 12 litres per day. Milk price: minimum ₹35 per litre for 9 months and ₹30 per litre for the other 3 months.",
      "Existing cow: minimum 15 litres per day. Milk price: minimum ₹35 per litre for 9 months and ₹30 per litre for the other 3 months. Supplying this minimum milk is mandatory.",
      "The replacement cow used in the dry months must also give the minimum litres.",
      "Every cow gets an ear tag and photos. Our team can visit and inspect the cow at any time.",
      "Provide good feed, water, shelter, vaccinations and vet treatment, and keep the vet records.",
      "If a cow dies within the first 6 months, pay back the full amount or replace it with another cow you own. Between 6 and 12 months, pay back half or replace it.",
      "If a cow dies after 12 months, report it within 24 hours with photos and a vet certificate so the insurance claim can be made.",
      "Every week, share your milk bill on our WhatsApp number, +91 81110 34557.",
      "If milk falls below 12 litres a day for 3 weeks in a row, Hoofund will take the cow back.",
      "If you leave before 5 years, you return the amount for the remaining period.",
      "Payments are made only by bank or UPI. A bank account, Aadhaar and PAN are required.",
    ],
  },
  contact: {
    eyebrow: "Join as a partner",
    title: "Ready to grow your dairy?",
    whatsapp: "WhatsApp",
    email: "Email",
    disclaimer:
      "Amounts are estimates based on the minimum milk above. Full terms are in the Partner Agreement.",
  },
  footer: {
    rights: "All rights reserved.",
    tagline: "A digital dairy platform connecting village dairy farmers with city investors.",
    links: "Quick links",
    contact: "Contact us",
  },
  sections: {
    about: "About Hoofund",
    benefits: "Why partner with us",
    benefitsLead: "Everything you need to grow your dairy, with steady income and full support.",
    plans: "Plans",
    plansLead: "Choose how many cows. Every plan includes 5 years of support, and the cows are yours at the end.",
    featured: "Largest plan",
    how: "How it works",
    advantages: "What you earn",
    terms: "Agreement",
    termsLead: "Simple, clear rules that protect you, the cow and the investor.",
    termsHelp: "Questions about the terms? Chat with us on WhatsApp.",
  },
  stats: [
    { value: "5", label: "years of full support" },
    { value: "9", label: "months of fixed pay every year" },
    { value: "₹5,000", label: "per cow, per year for health" },
    { value: "₹10–12k", label: "biogas income per cow, per year" },
  ],
};

export type Dictionary = typeof en;

const ta: Dictionary = {
  meta: {
    title: "Hoofund — நகர முதலீட்டுடன் உங்கள் பால் பண்ணையை வளர்த்திடுங்கள்",
    description:
      "Hoofund கிராமப்புற பால் பண்ணை விவசாயிகளையும் நகர முதலீட்டாளர்களையும் இணைக்கிறது. புதிய மாடு அல்லது ரொக்கம், நிலையான மாதத் தொகை மற்றும் 5 ஆண்டுகள் முழு ஆதரவு.",
  },
  nav: {
    about: "எங்களைப் பற்றி",
    benefits: "நன்மைகள்",
    plans: "திட்டங்கள்",
    how: "செயல்முறை",
    terms: "விதிமுறைகள்",
    join: "இணையுங்கள்",
    language: "மொழி",
  },
  hero: {
    eyebrow: "பால் பண்ணை விவசாயிகள் மற்றும் விவசாயக் கூட்டாளர்களுக்காக",
    title: "நகர முதலீட்டுடன் உங்கள் பால் பண்ணையை வளர்த்திடுங்கள்",
    subtitle:
      "நீங்கள் மாடுகளைப் பராமரியுங்கள். முதலீடு, நிலையான மாத வருமானம் மற்றும் 5 ஆண்டுகள் முழு ஆதரவையும் நாங்கள் வழங்குகிறோம்.",
    primary: "WhatsApp-இல் தொடர்பு கொள்ளுங்கள்",
    secondary: "திட்டங்களைப் பாருங்கள்",
    highlights: ["5 ஆண்டுகள் முழு ஆதரவு", "ஆண்டுக்கு 9 மாதம் நிலையான தொகை", "மாடு உங்களுக்கே சொந்தம்"],
    tagline: "Invest in a healthy tomorrow",
    marquee: [
      "புதிய மாடு அல்லது ரொக்கம்",
      "நிலையான மாதத் தொகை",
      "5 ஆண்டுகளுக்குப் பிறகு மாடு உங்களுக்கே",
      "பயோகேஸ் வருமானம்",
      "உடல்நலம் மற்றும் காப்பீட்டு உதவி",
      "பால் வற்றும் மாதங்களில் கூடுதல் வருமானம்",
      "வாராந்திரக் கண்காணிப்பு மற்றும் வருகைகள்",
    ],
  },
  who: {
    title: "நாங்கள் யார்",
    body: "Hoofund ஒரு டிஜிட்டல் பால் பண்ணைத் தளம். கிராமப்புற பால் பண்ணை விவசாயிகளையும், விவசாயத்தில் பங்கேற்க விரும்பும் நகரங்களில் பணிபுரிபவர்களையும் நாங்கள் இணைக்கிறோம்.",
  },
  what: {
    title: "நாங்கள் என்ன செய்கிறோம்",
    body: "மாடுகளுக்கான நகர முதலீட்டை உங்களிடம் கொண்டு வருகிறோம். மாடுகளைப் பராமரிக்க ஒவ்வொரு மாதமும் பணம் வழங்குகிறோம். பால் விற்பனைக்கு ஏற்பாடு செய்து, வாராந்திரக் கண்காணிப்பு மற்றும் நேரடி வருகைகள் மூலம் ஒவ்வொரு மாட்டையும் கவனிக்கிறோம்.",
  },
  photos: {
    hero: "ஆந்திரப் பிரதேச கிராமத்தில் கன்றுக்குப் பால் கொடுக்கும் தாய்ப் பசு",
    badgeTitle: "5 ஆண்டுகள்",
    badgeBody: "முழு ஆதரவு",
    calfBadge: "ஒவ்வொரு கன்றும் உங்களுக்கே",
    gallery: [
      { src: "cow-grazing", alt: "பசும்புல்வெளியில் மேயும் பழுப்பு நிறப் பசு", caption: "5 ஆண்டுகளுக்குப் பிறகு மாடு உங்களுக்கே" },
      { src: "calf-portrait", alt: "இளம் கன்றின் நெருக்கமான படம்", caption: "பிறக்கும் ஒவ்வொரு கன்றும் உங்களுக்கே" },
      { src: "calf-walking", alt: "வயல்வெளியில் நடக்கும் இளம் கன்று", caption: "வாராந்திரக் கண்காணிப்பு மற்றும் நேரடி வருகைகள்" },
    ],
    credit: "புகைப்படங்கள்: Pexels",
    banner: {
      title: "ஆரோக்கியமான நாளைக்காக முதலீடு செய்யுங்கள்",
      alt: "சென்னை அருகே எருதுகளுடன் வயலை உழும் விவசாயி",
      video: "கிராமப் பால் பண்ணை வாழ்க்கை: மேயும் மாடுகள், கையால் பால் கறத்தல், விளையாடும் குழந்தைகள்",
    },
    earnings: [
      { src: "milk", alt: "உலோகக் கேனில் ஊற்றப்படும் புதிய பால்", title: "பால்", body: "பால் விற்பனை, அனைவருக்கும் வருமானம். பால் வற்றும் மாதங்களில் நீங்கள் வழங்கும் ஒவ்வொரு லிட்டருக்கும் ₹5." },
      { src: "cow-fodder", alt: "பசுந்தீவனம் உண்ணும் மாடு", title: "தீவனம் மற்றும் பராமரிப்பு", body: "ஒவ்வொரு ஆண்டும் 9 மாதங்கள், தீவனம் மற்றும் பராமரிப்புக்கு நிலையான மாதத் தொகை." },
      { src: "biogas", alt: "கிராமப் பயோகேஸ் கலனின் அருகே கன்றுகளுக்குத் தீவனம் அளிக்கும் விவசாயி", title: "பயோகேஸ்", body: "மாட்டுச் சாணத்திலிருந்து ஒரு மாட்டிற்கு ஆண்டுக்கு ₹10,000–12,000." },
    ],
  },
  benefits: {
    title: "உங்களுக்கான நன்மைகள்",
    items: [
      "**புதிய மாடு**, அல்லது உங்களிடம் உள்ள மாட்டிற்கு **ரொக்கப் பணம்**",
      "தீவனம் மற்றும் பராமரிப்புக்கு **நிலையான மாதத் தொகை**",
      "5 ஆண்டுகளுக்குப் பிறகு **மாடு உங்களுக்கே சொந்தம்**, அதன் கன்றுகளும் உங்களுக்கே",
      "மாட்டின் உடல்நலம் மற்றும் காப்பீட்டுக்கு **ஆண்டுதோறும் உதவித்தொகை**",
      "மாட்டுச் சாணத்திலிருந்து **பயோகேஸ் வருமானம்** (திட்டம் 1–3: முழுவதும், திட்டம் 4–5: 50%)",
      "பால் வற்றும் மாதங்களில் **கூடுதல் வருமானம்**",
    ],
  },
  plans: {
    title: "கூட்டாளர் திட்டங்கள்",
    plan: "திட்டம்",
    cows: "மாடுகள்",
    cow: "மாடு",
    cowsUnit: "மாடுகள்",
    investment: "முதலீடு",
    monthly: "மாதத் தொகை",
    monthlyNote: "9 மாதங்கள்",
    total: "5 ஆண்டுகளில் நீங்கள் பெறுவது",
    note: "5 ஆண்டுகளில் நீங்கள் பெறும் மொத்தத் தொகையில் மாதாந்திரத் தீவனம் மற்றும் பராமரிப்புத் தொகை, பால் வற்றும் மாதங்களின் தொகை, மாட்டு உடல்நல உதவி மற்றும் உங்கள் பயோகேஸ் பங்கு அடங்கும். தீவனச் செலவை மாதத் தொகையிலிருந்து நீங்களே செய்ய வேண்டும். 5 ஆண்டுகளுக்குப் பிறகு மாடுகள் உங்களுக்கே சொந்தம்.",
  },
  how: {
    title: "நகர மக்களை உங்களுடன் எப்படி இணைக்கிறோம்",
    steps: [
      { title: "நகர முதலீட்டாளர்கள்", body: "ஐடி மற்றும் அலுவலகப் பணியாளர்கள் மாடுகளில் முதலீடு செய்கிறார்கள்" },
      { title: "Hoofund", body: "ஒப்பந்தம், பணப் பரிவர்த்தனை மற்றும் கண்காணிப்பு" },
      { title: "விவசாயியாகிய நீங்கள்", body: "மாட்டைப் பராமரித்து, மாதந்தோறும் பணம் பெறுங்கள்" },
      { title: "பால் மற்றும் வளர்ச்சி", body: "பால் விற்பனை, அனைவருக்கும் வருமானம்" },
    ],
  },
  advantages: {
    title: "சிறப்பம்சங்கள்",
    items: [
      "**நிலையான மாதத் தொகை:** ஒவ்வொரு ஆண்டும் 9 மாதங்கள், தீவனம் மற்றும் பராமரிப்புக்காக: 1 மாட்டிற்கு ₹9,000 முதல் 6 மாடுகளுக்கு ₹42,000 வரை (திட்ட அட்டவணையைப் பார்க்கவும்)",
      "**ஒரு மாட்டிற்கு மாதம் ₹5,000:** பால் வற்றும் 3 மாதங்களில், மேலும் நீங்கள் வழங்கும் ஒவ்வொரு லிட்டருக்கும் ₹5",
      "**புதிய மாடு அல்லது ரொக்கம்:** முதலீட்டுத் தொகையில் புதிய மாடு வாங்கலாம், அல்லது உங்களிடம் உள்ள மாட்டிற்கு ரொக்கம் பெறலாம் (5 ஆண்டு ஒப்பந்தம்)",
      "**மாடு உங்களுக்கே சொந்தம்:** 5 ஆண்டுகளுக்குப் பிறகு மாடும், பிறக்கும் ஒவ்வொரு கன்றும் உங்களுக்கே",
      "**ஒரு மாட்டிற்கு ஆண்டுக்கு ₹5,000:** 2ஆம் ஆண்டு முதல் 5ஆம் ஆண்டு வரை, மருத்துவச் செலவு அல்லது மாட்டுக் காப்பீட்டுக்காக",
      "**பயோகேஸ்: ₹10,000–12,000** மாட்டுச் சாணத்திலிருந்து ஒரு மாட்டிற்கு ஆண்டுதோறும். திட்டம் 1–3: முழுவதும் உங்களுக்கே · திட்டம் 4–5: 50% உங்களுக்கு",
    ],
    tax: "**பெரும்பாலான கூட்டாளர்களுக்கு வருமான வரி இல்லை:** இந்த வருமானம் வருமான வரி வரம்புக்குக் கீழே உள்ளது. பிடித்தம் செய்யப்படும் TDS-ஐ வருமான வரி தாக்கல் செய்யும்போது திரும்பப் பெறலாம்.",
  },
  terms: {
    title: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
    items: [
      "ஒவ்வொரு மாடும் Hoofund உடன் 5 ஆண்டுகள் ஒப்பந்தத்தில் இருக்கும்.",
      "ஒப்பந்த மாட்டை எங்கள் எழுத்துப்பூர்வ அனுமதி இல்லாமல் விற்கவோ, மாற்றவோ, கடனுக்கு அடகு வைக்கவோ, வேறு இடத்துக்குக் கொண்டு செல்லவோ கூடாது.",
      "ஏற்கனவே உள்ள மாட்டிற்கு, உங்கள் பால் சங்கத்திலிருந்து பெற்ற கடந்த 1 மாதப் பால் ரசீதை (வழங்கிய லிட்டர் அளவுடன்) சரிபார்ப்புக்காகப் பகிர வேண்டும்.",
      "புதிய மாடு: நாளொன்றுக்குக் குறைந்தபட்சம் 12 லிட்டர். பால் விலை: 9 மாதங்களுக்கு லிட்டருக்குக் குறைந்தபட்சம் ₹35, மற்ற 3 மாதங்களுக்கு லிட்டருக்கு ₹30.",
      "ஏற்கனவே உள்ள மாடு: நாளொன்றுக்குக் குறைந்தபட்சம் 15 லிட்டர். பால் விலை: 9 மாதங்களுக்கு லிட்டருக்குக் குறைந்தபட்சம் ₹35, மற்ற 3 மாதங்களுக்கு லிட்டருக்கு ₹30. இந்தக் குறைந்தபட்சப் பால் அளவை வழங்குவது கட்டாயம்.",
      "பால் வற்றும் மாதங்களில் பயன்படுத்தும் மாற்று மாடும் குறைந்தபட்ச லிட்டர் அளவைத் தர வேண்டும்.",
      "ஒவ்வொரு மாட்டிற்கும் காது அடையாளக் குறி பொருத்தப்பட்டு, புகைப்படங்கள் எடுக்கப்படும். எங்கள் குழு எந்த நேரத்திலும் வந்து மாட்டைப் பார்வையிடலாம்.",
      "நல்ல தீவனம், தண்ணீர், கொட்டகை, தடுப்பூசிகள் மற்றும் கால்நடை மருத்துவ சிகிச்சை வழங்கி, மருத்துவப் பதிவுகளைப் பராமரிக்க வேண்டும்.",
      "முதல் 6 மாதங்களுக்குள் மாடு இறந்தால், முழுத் தொகையைத் திருப்பிச் செலுத்த வேண்டும் அல்லது உங்களிடம் உள்ள வேறு மாட்டை மாற்றாகத் தர வேண்டும். 6 முதல் 12 மாதங்களுக்குள் இறந்தால், பாதித் தொகையைச் செலுத்த வேண்டும் அல்லது மாற்று மாடு தர வேண்டும்.",
      "12 மாதங்களுக்குப் பிறகு மாடு இறந்தால், காப்பீடு கோருவதற்காக 24 மணிநேரத்திற்குள் புகைப்படங்கள் மற்றும் கால்நடை மருத்துவர் சான்றிதழுடன் தெரிவிக்க வேண்டும்.",
      "ஒவ்வொரு வாரமும் உங்கள் பால் ரசீதை எங்கள் WhatsApp எண்ணில் (+91 81110 34557) பகிர வேண்டும்.",
      "தொடர்ந்து 3 வாரங்கள் பால் அளவு நாளொன்றுக்கு 12 லிட்டருக்குக் கீழ் இருந்தால், Hoofund மாட்டைத் திரும்பப் பெற்றுக்கொள்ளும்.",
      "5 ஆண்டுகளுக்கு முன் ஒப்பந்தத்திலிருந்து விலகினால், மீதமுள்ள காலத்திற்கான தொகையைத் திருப்பிச் செலுத்த வேண்டும்.",
      "பணப் பரிவர்த்தனைகள் வங்கி அல்லது UPI மூலம் மட்டுமே. வங்கிக் கணக்கு, ஆதார் மற்றும் பான் கார்டு அவசியம்.",
    ],
  },
  contact: {
    eyebrow: "கூட்டாளராக இணையுங்கள்",
    title: "உங்கள் பால் பண்ணையை வளர்க்கத் தயாரா?",
    whatsapp: "WhatsApp",
    email: "மின்னஞ்சல்",
    disclaimer:
      "இவை மேலே உள்ள குறைந்தபட்சப் பால் அளவின் அடிப்படையில் கணக்கிடப்பட்ட மதிப்பீட்டுத் தொகைகள். முழு விதிமுறைகள் கூட்டாளர் ஒப்பந்தத்தில் உள்ளன.",
  },
  footer: {
    rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    tagline: "கிராமப்புற பால் பண்ணை விவசாயிகளையும் நகர முதலீட்டாளர்களையும் இணைக்கும் டிஜிட்டல் பால் பண்ணைத் தளம்.",
    links: "விரைவு இணைப்புகள்",
    contact: "தொடர்புக்கு",
  },
  sections: {
    about: "Hoofund பற்றி",
    benefits: "ஏன் எங்களுடன் இணைய வேண்டும்",
    benefitsLead: "நிலையான வருமானமும் முழு ஆதரவும் — உங்கள் பால் பண்ணையை வளர்க்கத் தேவையான அனைத்தும்.",
    plans: "திட்டங்கள்",
    plansLead: "எத்தனை மாடுகள் என்பதைத் தேர்ந்தெடுங்கள். ஒவ்வொரு திட்டத்திலும் 5 ஆண்டுகள் ஆதரவு உண்டு; இறுதியில் மாடுகள் உங்களுக்கே சொந்தம்.",
    featured: "மிகப்பெரிய திட்டம்",
    how: "செயல்முறை",
    advantages: "நீங்கள் பெறுவது",
    terms: "ஒப்பந்தம்",
    termsLead: "உங்களையும், மாட்டையும், முதலீட்டாளரையும் பாதுகாக்கும் எளிய, தெளிவான விதிமுறைகள்.",
    termsHelp: "விதிமுறைகள் பற்றிக் கேள்விகளா? WhatsApp-இல் எங்களுடன் பேசுங்கள்.",
  },
  stats: [
    { value: "5", label: "ஆண்டுகள் முழு ஆதரவு" },
    { value: "9", label: "மாதங்கள் — ஒவ்வொரு ஆண்டும் நிலையான தொகை" },
    { value: "₹5,000", label: "ஒரு மாட்டிற்கு ஆண்டுதோறும் உடல்நல உதவி" },
    { value: "₹10–12k", label: "ஒரு மாட்டிற்கு ஆண்டுக்குப் பயோகேஸ் வருமானம்" },
  ],
};

const dictionaries: Record<Locale, Dictionary> = { ta, en };

export function getDictionary(locale: string): Dictionary {
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale];
}
