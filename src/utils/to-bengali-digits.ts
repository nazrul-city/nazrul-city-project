const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

/** Converts Western digits in a number or string to Bengali digits. */
export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => {
    const bengaliDigit = BENGALI_DIGITS[Number(digit)];
    return bengaliDigit ?? digit;
  });
}
