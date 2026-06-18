export interface UserProfile {
  id: string
  name: string
  trade: string
  state: string
  district: string
  language: string
  qualification: string
  experience_years: number
  consent_given: boolean
  created_at: string
}

export interface Job {
  id: string
  title: string
  employer: string
  district: string
  state: string
  trade: string
  salary_min: number
  salary_max: number
  required_skills: string[]
  description: string
  source: string
  posted_at: string
}

export interface JobMatch {
  job: Job
  match_percent: number
  matched_skills: string[]
  gap_skills: string[]
  readiness_percent: number
}

export interface Question {
  id: string
  trade: string
  skill: string
  language: string
  difficulty: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: string
  correct_answer_text: string
  explanation: string
}

export interface AssessmentResult {
  id: string
  user_id: string
  skill: string
  trade: string
  score_percent: number
  passed: boolean
  questions_attempted: number
  questions_correct: number
  created_at: string
}

export interface Credential {
  id: string
  user_id: string
  user_name: string
  skill: string
  trade: string
  score_percent: number
  proficiency_level: string
  issued_at: string
  verification_url: string
}

export interface GapAnalysis {
  readiness_percent: number
  gap_percent: number
  matched_skills: string[]
  gap_skills: GapSkill[]
}

export interface GapSkill {
  skill: string
  severity: number
  has_assessment: boolean
}
