export const TRADES = [
  'Electrician',
  'Welder',
  'Plumber',
  'Fitter',
  'Carpenter',
  'Mechanic (Motor Vehicle)',
  'Electronic Mechanic',
  'Draughtsman (Civil)',
  'Stenographer',
  'Computer Operator'
] as const

export type Trade = typeof TRADES[number]

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
] as const

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Gorakhpur', 'Allahabad', 'Agra'],
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Udaipur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
}

export const HINDI_UI = {
  welcome: 'PathAI में आपका स्वागत है',
  tagline: 'आपका करियर, आपकी भाषा में',
  getStarted: 'शुरू करें',
  yourName: 'आपका नाम',
  yourTrade: 'आपका ट्रेड',
  yourDistrict: 'आपका जिला',
  yourState: 'आपका राज्य',
  findJobs: 'नौकरी खोजें',
  skillGap: 'स्किल गैप',
  startAssessment: 'टेस्ट शुरू करें',
  yourCertificate: 'आपका सर्टिफिकेट',
  nextQuestion: 'अगला सवाल',
  submitAnswer: 'जवाब दें',
  congratulations: 'बधाई हो!',
  consentText: 'मैं अपना डेटा PathAI को करियर मार्गदर्शन के लिए उपयोग करने की अनुमति देता/देती हूं।',
  consentRequired: 'आगे बढ़ने के लिए सहमति आवश्यक है।',
}
