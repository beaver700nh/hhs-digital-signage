/**
 * Day containing a valid letter (A-D) by itself, maybe with a prefix, e.g.:
 * - A Day
 * - Exams A&B
 * - Exam C
 * - D Block Exams
 * - Transition Day - D Day
 */
export const VALID_DAYS = /^\s*(?:(?:[Ee]xams?|[Tt]ransition)?(?:\s*[Dd]ay)?)?\W*([ABCD])\W*/

/**
 * Just looking for certain trigger words.
 */
export const SPECIAL_DAYS = /(exam)|(mcas)|(transition)|(last)|(half|1\/2)/gi
export const SPECIAL_FALLBACK = /\*|special|schedule/gi
export const NO_SCHOOL = /(?:-\s*)?\s*no\s+school\s*(?:-\s*)?/gi
export const VACATION = /\b(\w+\s+(?:break|vacation))/gi
export const PD_DAY = /\b(?:pd|professional(?:\s+development)?)\s+(?:day)?\b/gi

/**
 * Rudimentary detector for HTML in calendar event description (e.g. if it was copy-pasted from somewhere).
 * See https://regex101.com/r/WUMMda/1
 */
export const SUSPECTED_HTML = /<([^>]+)>.*?<\/\1>|<([^>]+)\/>/g

/*
 * Regex to extract class times and names from calendar event description
 * /^\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*-\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)[\s:]*(.*?)\s*$|^\s*(.*?)[\s:]*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*-\s*(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)\s*$/gmi
 *
 * >> Regex analyzer: https://regex101.com/r/hd7rpO/1 <<
 *
 * Two different cases
 * ===================
 * ^\s*{Time matcher}[\s:]*(.*?)\s*$  -- Time: Class
 * |                                  -- ... or ...
 * ^\s*(.*?)[\s:]*{Time matcher}\s*$  -- Class: Time
 *
 * Time matcher
 * ============
 * {Clock time}\s*-\s*{Clock time}  -- XX:XX - XX:XX
 *                                  -- two clock times separated by a dash
 *                                  -- and maybe whitespace around the dash
 *
 * Clock time
 * ==========
 * (
 *   \d?\d      -- hour (can be single-digit)
 *   (?:
 *     :?       -- colon is optional
 *     \d{2}    -- minute (always two digits)
 *   )?         -- minute is optional
 *   (?:
 *     \s*      -- whitespace is optional
 *     [ap]m    -- AM or PM
 *   )?
 * )
 *
 * Flags
 * =====
 * g  -- global (find all matches)
 * m  -- handle multiline
 * i  -- case-insensitive
 */
export const BELL_SCHEDULE = (() => {
  const clockTime   = String.raw`(\d?\d(?::?\d{2})?(?:\s*[ap]m)?)`
  const timeMatcher = String.raw`${clockTime}\s*-\s*${clockTime}`
  const timeBefore  = String.raw`^\s*${timeMatcher}[\s:]*(.*?)\s*$`
  const timeAfter   = String.raw`^\s*(.*?)[\s:]*${timeMatcher}\s*$`
  const regex       = String.raw`${timeBefore}|${timeAfter}`

  return new RegExp(regex, "gmi")
})();

/**
 * If the class contains "Nth lunch" of some sort, it's probably a lunch block.
 */
export const LUNCH_BLOCK = /(?:\d\s*\w{0,2}|first|second|third|last)\W*lunch/i
