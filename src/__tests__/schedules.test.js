/* eslint-disable no-new */
// Tests player class
import { retrieveTemplate, validateSchedule } from '../domain/schedules';

// Invalid inputs
test('Bad inputs to retrieveTemplate throw', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate(undefined)}).toThrow(new Error("Schedule for undefined teams is unsupported"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate('')}).toThrow(new Error("Schedule for  teams is unsupported"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate({})}).toThrow(new Error("Schedule for [object Object] teams is unsupported"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate(1)}).toThrow(new Error("Schedule for 1 teams is unsupported"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate([1, 2, 3])}).toThrow(new Error("Schedule for 1,2,3 teams is unsupported"));
});

test('Bad schedules throw', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateSchedule(undefined)}).toThrow(new Error("Schedule must be an array of matches"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateSchedule('t')}).toThrow(new Error("Schedule must be an array of matches"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateSchedule({})}).toThrow(new Error("Schedule must be an array of matches"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateSchedule(1)}).toThrow(new Error("Schedule must be an array of matches"));
  // eslint-disable-next-line prettier/prettier
  expect(()=>{validateSchedule([1, 2, 3])}).toThrow(new Error("Schedule must be an array of matches"));
});

test('Correct template is retrieved', () => {
  // Check number of rounds
  expect(retrieveTemplate(4).length).toBe(6);
  expect(retrieveTemplate(5).length).toBe(10);
  expect(retrieveTemplate(6).length).toBe(15);
  expect(retrieveTemplate(7).length).toBe(21);
});
