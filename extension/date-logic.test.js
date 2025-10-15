const { convertToLocalTime } = require('./date-logic');

describe('convertToLocalTime', () => {

  test('should correctly convert a UTC ISO string to the local timezone (EDT)', () => {
    const input = '2025-10-15T04:40:00Z';
    const expected = 'October 15, 2025 at 12:40:00 AM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should correctly convert a US long date with time and zone', () => {
    const input = 'October 14, 2025 at 7:59 PM EDT';
    // This input is already in EDT, so output should match input (formatting may differ)
    // The function will parse and output in local time, so if local is EDT, output should be:
    const expected = 'October 14, 2025 at 7:59:00 PM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should correctly convert a European date format with slashes', () => {
    const input = '14/10/2025 19:59';
    // This will be parsed as local time, so output should match local time zone
    // For Columbus, Ohio (EDT):
    const expected = 'October 14, 2025 at 7:59:00 PM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should correctly convert a European date format with dashes', () => {
    const input = '14-10-2025 19:59';
    const expected = 'October 14, 2025 at 7:59:00 PM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should correctly convert a US long date without time', () => {
    const input = 'October 14, 2025';
    // Should default to midnight local time
    const expected = 'October 14, 2025 at 12:00:00 AM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should return "Unrecognized date" for invalid input', () => {
    const input = 'this is not a date';
    expect(convertToLocalTime(input)).toBe('Unrecognized date');
  });

  test('should correctly handle a PST timezone string', () => {
    // 9:15 PM on Oct 14 in PDT is 12:15 AM on Oct 15 in EDT
    const input = 'October 14, 2025 at 9:15 PM PDT';
    const expected = 'October 15, 2025 at 12:15:00 AM EDT';
    expect(convertToLocalTime(input)).toBe(expected);
  });

  test('should return "Unrecognized date" for an impossible date', () => {
    // February 30th is not a real date
    const input = 'February 30, 2025';
    expect(convertToLocalTime(input)).toBe('Unrecognized date');
  });

  test('should correctly handle the EST fallback after Daylight Saving Time ends', () => {
    // Nov 3rd is after the DST change, so the timezone should be EST
    const input = 'November 3, 2025 at 10:00 AM EST';
    const expected = 'November 3, 2025 at 10:00:00 AM EST';
    expect(convertToLocalTime(input)).toBe(expected);
  });
});
