/**
 * For normalizing "High", "High School", and "HS" to the same format
 */
export const HIGH_SCHOOL = /([\w\s-]+)\s+(?:high(?:\s+school)?|hs)\b/i

/**
 * Redundant "team":
 * | Sport: Tennis - Team
 * | Level: Girls Varsity
 *
 * Redunant "boys":
 * | Sport: Lacrosse - Boys
 * | Level: Boys Varsity
 */
export const REDUNDANT_SPECIFIER = /\s+-\s+(?:team|boys|girls|indoor|outdoor)/gi

/**
 * X vs Y (home) or X at Y (away)
 */
export const HOME_AWAY = /^(.*)\s+(vs|@|at)\s+(.*)$/i

/**
 * YAML-like structure for the event description:
 * | Sport: Track & Field - Outdoor
 * | Level: Coed 6/7/8th
 * | Team: Holliston High School
 * | Site: Medfield HS
 * | Subsite: MHS Track
 */
export const DESCRIPTION = /^\s*(\w+):\s*(.*)\s*$/gm
