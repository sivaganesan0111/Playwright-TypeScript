export const organizationData = {
  'Organization Name': 'Shiva',
  'Registration Number': '1111',
  'Tax ID': '222',
  Phone: '737338383',
  Fax: '9101',
  Email: 'info@orangehrm.com',
  'Address Street 1': '1234 Baker Street',
  'Address Street 2': 'Suite 999',
  City: 'San Mateo',
  'State/Province': 'CA',
  'Zip/Postal Code': '94401',
  Country: 'United States',
  Notes: 'Successfully changed'
} as const;

export type OrganizationGeneralInformationData = {
  -readonly [Field in keyof typeof organizationData]: string;
};
