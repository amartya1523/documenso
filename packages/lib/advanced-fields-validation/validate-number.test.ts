import { describe, expect, it } from 'vitest';

import { validateNumberField } from './validate-number';

describe('validateNumberField', () => {
  describe('with the "123,456,789.00" number format', () => {
    const numberFormat = '123,456,789.00';

    it('rejects a value with thousands separators above the maximum', () => {
      expect(validateNumberField('5,000', { type: 'number', numberFormat, maxValue: 1000 })).toEqual([
        'Value 5,000 is greater than the maximum value of 1000',
      ]);
    });

    it('accepts a value with thousands separators above the minimum', () => {
      expect(validateNumberField('1,500.25', { type: 'number', numberFormat, minValue: 10 })).toEqual([]);
    });

    it('accepts a value with thousands separators within the range', () => {
      expect(validateNumberField('2,500', { type: 'number', numberFormat, minValue: 1000, maxValue: 5000 })).toEqual(
        [],
      );
    });
  });

  describe('with the "123.456.789,00" number format', () => {
    const numberFormat = '123.456.789,00';

    it('reads "." as the thousands separator and "," as the decimal separator', () => {
      expect(validateNumberField('1.234,56', { type: 'number', numberFormat, minValue: 1000 })).toEqual([]);
    });

    it('rejects a value above the maximum', () => {
      expect(validateNumberField('1.234,56', { type: 'number', numberFormat, maxValue: 1234 })).toEqual([
        'Value 1.234,56 is greater than the maximum value of 1234',
      ]);
    });
  });

  describe('with the "123456,789.00" number format', () => {
    it('strips the thousands separator before comparing', () => {
      expect(
        validateNumberField('123456,789.00', { type: 'number', numberFormat: '123456,789.00', maxValue: 1000 }),
      ).toEqual(['Value 123456,789.00 is greater than the maximum value of 1000']);
    });
  });

  describe('without a number format', () => {
    it('compares plain numbers against the minimum and maximum', () => {
      expect(validateNumberField('42', { type: 'number', minValue: 10, maxValue: 100 })).toEqual([]);
      expect(validateNumberField('3.5', { type: 'number', minValue: 10 })).toEqual([
        'Value 3.5 is less than the minimum value of 10',
      ]);
    });
  });

  it('does not report a range error for an empty optional value', () => {
    expect(validateNumberField('', { type: 'number', numberFormat: '123,456,789.00', minValue: 10 })).toEqual([]);
  });
});
