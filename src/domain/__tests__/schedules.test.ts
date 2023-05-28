// Tests schedule functions
import { retrieveTemplate } from '../schedules';

// Invalid inputs
test('Bad inputs to retrieveTemplate throw', () => {
  // eslint-disable-next-line prettier/prettier
  expect(()=>{retrieveTemplate(1)}).toThrow(new Error("Schedule for 1 teams is unsupported"));
});

test('Correct template is retrieved', () => {
  // Check number of rounds
  expect(retrieveTemplate(4).length).toBe(6);
  expect(retrieveTemplate(5).length).toBe(10);
  expect(retrieveTemplate(6).length).toBe(15);
  expect(retrieveTemplate(7).length).toBe(21);
});
