export type Member = { id: string; name: string; email: string; phone: string; verified: boolean; joined: string; avatar: string; country: string };

const m = (name: string, email: string, phone: string, verified: boolean, joined: string, avatar: string, country: string): Member => ({
  id: email,
  name,
  email,
  phone,
  verified,
  joined,
  avatar,
  country,
});

export const MEMBERS: Member[] = [
  m("Demo Member", "demo-member+b4puomf2@example.com", "", true, "11/7/2026", "", "United States"),
  m("Tomas Herrera", "tomas.herrera@example.com", "+34611223344", true, "11/7/2026", "65fc9", "Spain"),
  m("Mike Johnson", "mike.johnson@example.com", "+1555123456", true, "11/6/2026", "65fc9", "United States"),
  m("William Rodriguez", "william.rodriguez@example.com", "+1555357159", true, "11/4/2026", "d50bb", "United States"),
  m("Yara Kassem", "yara.kassem@example.com", "+971502223344", true, "10/31/2026", "d50bb", "United Arab Emirates"),
  m("Jane Smith", "jane.smith@example.com", "+1987654321", true, "10/31/2026", "d50bb", "Canada"),
  m("Demo Member", "member@example.com", "+1555000111", true, "10/31/2026", "624cb", "United States"),
  m("Maria Martinez", "maria.martinez@example.com", "+1555159357", false, "10/30/2026", "65fc9", "Mexico"),
  m("Rashid Al Amin", "rashid.alamin@example.com", "+97455667788", true, "10/28/2026", "624cb", "Qatar"),
  m("John Doe", "john.doe@example.com", "+1234567890", true, "10/28/2026", "624cb", "United States"),
  // Pages 2 and 3: the design only draws page 1, these fill the "of 25".
  m("Sarah Williams", "sarah.williams@example.com", "+1555246810", true, "10/26/2026", "624cb", "United Kingdom"),
  m("David Brown", "david.brown@example.com", "+1555369121", true, "10/25/2026", "d50bb", "United States"),
  m("Lina Haddad", "lina.haddad@example.com", "+962790112233", true, "10/22/2026", "d50bb", "Jordan"),
  m("Omar Farouk", "omar.farouk@example.com", "+201001234567", false, "10/20/2026", "65fc9", "Egypt"),
  m("Noura Saleh", "noura.saleh@example.com", "+966501234567", true, "10/18/2026", "624cb", "Saudi Arabia"),
  m("Lucas Moreau", "lucas.moreau@example.com", "+33612345678", true, "10/15/2026", "65fc9", "France"),
  m("Hana Kim", "hana.kim@example.com", "+821012345678", true, "10/12/2026", "d50bb", "South Korea"),
  m("Ethan Clark", "ethan.clark@example.com", "+1555778899", false, "10/9/2026", "624cb", "Canada"),
  m("Sofia Rossi", "sofia.rossi@example.com", "+393331234567", true, "10/6/2026", "d50bb", "Italy"),
  m("Khaled Mansour", "khaled.mansour@example.com", "+971551234567", true, "10/3/2026", "65fc9", "United Arab Emirates"),
  m("Emily Davis", "emily.davis@example.com", "+1555443322", false, "9/29/2026", "624cb", "United States"),
  m("Ahmed Nasser", "ahmed.nasser@example.com", "+966551112233", true, "9/25/2026", "d50bb", "Saudi Arabia"),
  m("Nina Petrova", "nina.petrova@example.com", "+359881234567", true, "9/20/2026", "65fc9", "Bulgaria"),
  m("Jack Wilson", "jack.wilson@example.com", "+447700900123", false, "9/14/2026", "624cb", "United Kingdom"),
  m("Layla Hassan", "layla.hassan@example.com", "+97433445566", true, "9/9/2026", "d50bb", "Qatar"),
];

export const DELETED_MEMBERS: Member[] = [
  m("Alex Turner", "alex.turner@example.com", "+1555111222", true, "10/29/2026", "624cb", "United States"),
  m("Sophia White", "sophia.white@example.com", "+1555333444", true, "10/15/2026", "624cb", "Canada"),
  m("Daniel Harris", "daniel.harris@example.com", "+1555555666", false, "10/13/2026", "65fc9", "United States"),
  m("Olivia Martin", "olivia.martin@example.com", "+1555777888", true, "10/31/2026", "624cb", "United Kingdom"),
  m("Matthew Thompson", "matthew.thompson@example.com", "+1555999000", true, "10/27/2026", "d50bb", "United States"),
  m("Emma Jackson", "emma.jackson@example.com", "+1555222333", false, "11/2/2026", "65fc9", "Canada"),
  m("Andrew Clark", "andrew.clark@example.com", "+1555444555", true, "10/19/2026", "d50bb", "United States"),
  m("Ava Robinson", "ava.robinson@example.com", "+1555666777", true, "10/31/2026", "624cb", "United Kingdom"),
  m("Joshua Walker", "joshua.walker@example.com", "+1555888999", false, "11/6/2026", "65fc9", "United States"),
  m("Isabella Allen", "isabella.allen@example.com", "+1555000111", true, "10/9/2026", "624cb", "Canada"),
  // Page 2: the design only draws page 1.
  m("Ryan Scott", "ryan.scott@example.com", "+1555121314", true, "9/30/2026", "d50bb", "United States"),
  m("Mia Lewis", "mia.lewis@example.com", "+1555151617", true, "9/22/2026", "624cb", "United Kingdom"),
];

export const COUNTRIES = [...new Set([...MEMBERS, ...DELETED_MEMBERS].map((x) => x.country))].sort();
