import { FOUNDING_YEAR } from '@/features/hero-stats/constants';
import { toBengaliDigits } from '@/utils/to-bengali-digits';

/** Years since founding, as a Bengali display string like `৬+ বছর`. */
export function readYearsSinceFounding(now = new Date()): string {
  const years = Math.max(0, now.getFullYear() - FOUNDING_YEAR);
  return `${toBengaliDigits(years)}+ বছর`;
}
