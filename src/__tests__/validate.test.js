/* eslint-disable no-new */
// Tests player class
import { isObject, validateObject } from '../domain/validate';

test('validateObject throws when not an object', () => {
  // expect errors when trying to import with bad data
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateObject()}).toThrowError(new Error('Input must be an object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateObject('f')}).toThrowError(new Error('Input must be an object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateObject(1)}).toThrowError(new Error('Input must be an object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateObject([])}).toThrowError(new Error('Input must be an object'));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateObject(null)}).toThrowError(new Error('Input must be an object'));
});

test('isObject returns correct state', () => {
  // expect errors when trying to import with bad data
  // eslint-disable-next-line prettier/prettier
  expect(isObject()).toBeFalsy();
  // eslint-disable-next-line prettier/prettier
  expect(isObject('f')).toBeFalsy();
  // eslint-disable-next-line prettier/prettier
  expect(isObject(1)).toBeFalsy();
  // eslint-disable-next-line prettier/prettier
  expect(isObject([])).toBeFalsy();
  // eslint-disable-next-line prettier/prettier
  expect(isObject(null)).toBeFalsy();
  // eslint-disable-next-line prettier/prettier
  expect(isObject({})).toBeTruthy();
});
