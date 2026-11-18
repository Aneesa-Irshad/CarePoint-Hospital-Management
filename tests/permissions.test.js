import { describe, expect, it } from 'vitest';
import { canAccess, paginate, toCSV } from '../src/lib/permissions.js';

describe('role permissions', () => {
  it('allows admin to open settings and ward tracker', () => {
    expect(canAccess('Admin','Settings')).toBe(true);
    expect(canAccess('Admin','Ward & Beds')).toBe(true);
  });
  it('limits doctor and receptionist demo pages', () => {
    expect(canAccess('Doctor','Billing')).toBe(false);
    expect(canAccess('Receptionist','Doctors')).toBe(false);
  });
});

describe('table helpers', () => {
  it('paginates records safely', () => {
    expect(paginate([1,2,3,4,5,6],2,5).items).toEqual([6]);
  });
  it('escapes quotes in CSV cells', () => {
    expect(toCSV([{name:'A "Test"'}])).toBe('name\n"A ""Test"""');
  });
});
