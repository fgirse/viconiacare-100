// ═══════════════════════════════════════════════════════
// PFLEGE PLUS – Domain Types
// ═══════════════════════════════════════════════════════

// ── User & Auth ───────────────────────────────────────────────────────────────
export type UserRole = 'superadmin' | 'admin' | 'editor' | 'user'

export interface User {
  id:                string
  email:             string
  firstName:         string
  lastName:          string
  phone?:            string
  role:              UserRole
  isActive:          boolean
  preferredLanguage: string
  avatar?:           Media
  lastLoginAt?:      string
  createdAt:         string
  updatedAt:         string
}

// ── Patient ───────────────────────────────────────────────────────────────────
export type PatientStatus = 'inquiry' | 'evaluation' | 'active' | 'paused' | 'inactive'
export type CareLevel = '1' | '2' | '3' | '4' | '5' | 'none'
export type Gender = 'male' | 'female' | 'diverse'

export interface PatientContact {
  phone?:      string
  mobile?:     string
  email?:      string
  street?:     string
  postalCode?: string
  city?:       string
}

export interface EmergencyContact {
  name?:         string
  relationship?: string
  phone?:        string
}

export interface InsuranceInfo {
  provider?:  string
  memberNr?:  string
  isPrivate:  boolean
}

export interface Patient {
  id:               string
  firstName:        string
  lastName:         string
  dateOfBirth:      string
  gender?:          Gender
  careLevel?:       CareLevel
  contact:          PatientContact
  emergencyContact: EmergencyContact
  insuranceInfo:    InsuranceInfo
  userAccount?:     string | User
  assignedStaff?:   StaffMember[]
  status:           PatientStatus
  notes?:           string
  createdAt:        string
  updatedAt:        string
}

// ── Staff ─────────────────────────────────────────────────────────────────────
export type StaffRole = 'nurse' | 'caregiver' | 'helper' | 'manager' | 'admin'
export type EmploymentType = 'fulltime' | 'parttime' | 'minijob' | 'freelance'

export interface StaffMember {
  id:              string
  firstName:       string
  lastName:        string
  staffRole:       StaffRole
  qualification?:  string
  contact: {
    phone?:  string
    mobile?: string
    email?:  string
  }
  employmentDetails: {
    type:          EmploymentType
    startDate?:    string
    hoursPerWeek?: number
  }
  photo?:       Media
  userAccount?: string | User
  isActive:     boolean
  createdAt:    string
  updatedAt:    string
}

// ── Document ──────────────────────────────────────────────────────────────────
export type DocumentCategory =
  | 'contract' | 'medical' | 'medication'
  | 'care-report' | 'invoice' | 'other'

export interface Document {
  id:              string
  title:           string
  category:        DocumentCategory
  filename:        string
  mimeType:        string
  filesize:        number
  url:             string
  patient:         string | Patient
  uploadedBy?:     string | User
  isConfidential:  boolean
  expiresAt?:      string
  notes?:          string
  createdAt:       string
  updatedAt:       string
}

// ── Care Plan ─────────────────────────────────────────────────────────────────
export type CarePlanStatus = 'active' | 'paused' | 'completed'

export interface CarePlanGoal {
  id:        string
  goal:      string
  measure?:  string
  interval?: 'daily' | 'multiple-daily' | 'weekly' | 'as-needed'
  completed: boolean
}

export interface Medication {
  id:     string
  name:   string
  dosage?: string
  time?:  string
  notes?: string
}

export interface ProgressNote {
  id:        string
  date:      string
  note?:     unknown   // Slate rich text
  writtenBy?: string | User
}

export interface CarePlan {
  id:            string
  title:         string
  patient:       string | Patient
  assignedStaff: Array<string | StaffMember>
  goals:         CarePlanGoal[]
  medications:   Medication[]
  progressNotes: ProgressNote[]
  status:        CarePlanStatus
  validFrom:     string
  validUntil?:   string
  createdAt:     string
  updatedAt:     string
}

// ── Media ─────────────────────────────────────────────────────────────────────
export interface MediaSize {
  url:    string
  width:  number
  height: number
}

export interface Media {
  id:       string
  filename: string
  mimeType: string
  filesize: number
  alt:      string
  caption?: string
  url:      string
  sizes?: {
    thumbnail?: MediaSize
    card?:      MediaSize
    hero?:      MediaSize
  }
}

// ── Booking (Cal.com) ─────────────────────────────────────────────────────────
export type BookingEventType = 'info' | 'eval' | 'visit'

export interface BookingEvent {
  id:          string
  calUid:      string
  eventType:   BookingEventType
  patientName: string
  patientEmail: string
  startTime:   string
  endTime:     string
  status:      'accepted' | 'pending' | 'cancelled'
  notes?:      string
}

// ── API Response Helpers ──────────────────────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true
  data:    T
}

export interface ApiError {
  success: false
  error:   string
  details?: unknown
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export interface PaginatedResponse<T> {
  docs:       T[]
  totalDocs:  number
  limit:      number
  page:       number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
