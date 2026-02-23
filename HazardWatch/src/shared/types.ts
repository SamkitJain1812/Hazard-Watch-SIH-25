import z from "zod";

export const HazardTypeSchema = z.enum([
  'flooding',
  'wildfire',
  'earthquake',
  'tsunami',
  'hurricane',
  'tornado',
  'landslide',
  'volcanic',
  'drought',
  'severe_weather',
  'other'
]);

export const SeveritySchema = z.number().int().min(1).max(5);

export const ReportStatusSchema = z.enum(['pending', 'verified', 'false_alarm', 'resolved']);

export const UserRoleSchema = z.enum(['reporter', 'coordinator', 'admin']);

export const UserCategorySchema = z.enum(['volunteer', 'tourist', 'government', 'local', 'ngo', 'researcher']);

export const CreateReportSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  hazard_type: HazardTypeSchema,
  severity: SeveritySchema,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  location_name: z.string().max(200).optional(),
  media_urls: z.string().optional(), // JSON string of URLs
});

export const ReportSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  hazard_type: HazardTypeSchema,
  severity: SeveritySchema,
  latitude: z.number(),
  longitude: z.number(),
  location_name: z.string().nullable(),
  media_urls: z.string().nullable(),
  status: ReportStatusSchema,
  is_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const UserRoleRecordSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  role: UserRoleSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type HazardType = z.infer<typeof HazardTypeSchema>;
export type Severity = z.infer<typeof SeveritySchema>;
export type ReportStatus = z.infer<typeof ReportStatusSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserCategory = z.infer<typeof UserCategorySchema>;
export type CreateReport = z.infer<typeof CreateReportSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type UserRoleRecord = z.infer<typeof UserRoleRecordSchema>;

export const HAZARD_TYPE_LABELS: Record<HazardType, string> = {
  flooding: 'Flooding',
  wildfire: 'Wildfire',
  earthquake: 'Earthquake',
  tsunami: 'Tsunami',
  hurricane: 'Hurricane',
  tornado: 'Tornado',
  landslide: 'Landslide',
  volcanic: 'Volcanic Activity',
  drought: 'Drought',
  severe_weather: 'Severe Weather',
  other: 'Other',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Moderate',
  4: 'High',
  5: 'Critical',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  reporter: 'Reporter',
  coordinator: 'Coordinator',
  admin: 'Administrator',
};

export const USER_CATEGORY_LABELS: Record<UserCategory, string> = {
  volunteer: 'Volunteer',
  tourist: 'Tourist',
  government: 'Government Body',
  local: 'Local Resident',
  ngo: 'NGO/Organization',
  researcher: 'Researcher',
};

// Emergency Management Color System - Black and Orange Theme
export const EMERGENCY_COLORS = {
  danger: '#EA580C',    // Orange for high severity/critical
  warning: '#F97316',   // Lighter orange for medium severity/caution
  safe: '#10B981',      // Green for low severity/safe
  info: '#FB923C',      // Orange for information/neutral
  primary: '#1A1A1A',   // Black primary
  secondary: '#2A2A2A', // Dark gray
  accent: '#EA580C',    // Orange accent
} as const;

export const SEVERITY_COLORS: Record<Severity, string> = {
  1: EMERGENCY_COLORS.safe,
  2: EMERGENCY_COLORS.safe,
  3: EMERGENCY_COLORS.info,
  4: EMERGENCY_COLORS.warning,
  5: EMERGENCY_COLORS.danger,
};

export const HAZARD_TYPE_COLORS: Record<HazardType, string> = {
  flooding: EMERGENCY_COLORS.info,
  wildfire: EMERGENCY_COLORS.danger,
  earthquake: '#8B5CF6',
  tsunami: '#06B6D4',
  hurricane: EMERGENCY_COLORS.warning,
  tornado: '#6B7280',
  landslide: '#84CC16',
  volcanic: EMERGENCY_COLORS.danger,
  drought: EMERGENCY_COLORS.warning,
  severe_weather: '#6366F1',
  other: '#64748B',
};
