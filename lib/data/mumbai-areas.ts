export interface MumbaiArea {
  name: string;
  pincode: string[];
  zone: 'South' | 'Central' | 'Western' | 'Eastern' | 'Navi Mumbai' | 'Thane';
}

export const mumbaiAreas: MumbaiArea[] = [
  // South Mumbai
  { name: 'Colaba', pincode: ['400001', '400005'], zone: 'South' },
  { name: 'Churchgate', pincode: ['400020'], zone: 'South' },
  { name: 'Marine Lines', pincode: ['400002'], zone: 'South' },
  { name: 'Nariman Point', pincode: ['400021'], zone: 'South' },
  { name: 'Fort', pincode: ['400001'], zone: 'South' },
  { name: 'Malabar Hill', pincode: ['400006'], zone: 'South' },
  { name: 'Worli', pincode: ['400018', '400025', '400030'], zone: 'South' },
  { name: 'Prabhadevi', pincode: ['400025', '400028'], zone: 'South' },
  { name: 'Dadar', pincode: ['400014', '400028'], zone: 'South' },
  
  // Western Suburbs
  { name: 'Bandra West', pincode: ['400050'], zone: 'Western' },
  { name: 'Bandra East', pincode: ['400051'], zone: 'Western' },
  { name: 'Khar', pincode: ['400052'], zone: 'Western' },
  { name: 'Santacruz West', pincode: ['400054'], zone: 'Western' },
  { name: 'Santacruz East', pincode: ['400055'], zone: 'Western' },
  { name: 'Vile Parle West', pincode: ['400056'], zone: 'Western' },
  { name: 'Vile Parle East', pincode: ['400057'], zone: 'Western' },
  { name: 'Andheri West', pincode: ['400053', '400058'], zone: 'Western' },
  { name: 'Andheri East', pincode: ['400059', '400069', '400093'], zone: 'Western' },
  { name: 'Juhu', pincode: ['400049'], zone: 'Western' },
  { name: 'Versova', pincode: ['400061'], zone: 'Western' },
  { name: 'Goregaon West', pincode: ['400062'], zone: 'Western' },
  { name: 'Goregaon East', pincode: ['400063'], zone: 'Western' },
  { name: 'Malad West', pincode: ['400064'], zone: 'Western' },
  { name: 'Malad East', pincode: ['400097'], zone: 'Western' },
  { name: 'Kandivali West', pincode: ['400067'], zone: 'Western' },
  { name: 'Kandivali East', pincode: ['400101'], zone: 'Western' },
  { name: 'Borivali West', pincode: ['400092'], zone: 'Western' },
  { name: 'Borivali East', pincode: ['400066'], zone: 'Western' },
  
  // Central Mumbai
  { name: 'Kurla West', pincode: ['400070'], zone: 'Central' },
  { name: 'Kurla East', pincode: ['400024'], zone: 'Central' },
  { name: 'Chembur', pincode: ['400071', '400074', '400089'], zone: 'Central' },
  { name: 'Ghatkopar West', pincode: ['400086'], zone: 'Central' },
  { name: 'Ghatkopar East', pincode: ['400075', '400077'], zone: 'Central' },
  { name: 'Vikhroli West', pincode: ['400079'], zone: 'Central' },
  { name: 'Vikhroli East', pincode: ['400083'], zone: 'Central' },
  { name: 'Bhandup West', pincode: ['400078'], zone: 'Central' },
  { name: 'Bhandup East', pincode: ['400042'], zone: 'Central' },
  { name: 'Mulund West', pincode: ['400080'], zone: 'Central' },
  { name: 'Mulund East', pincode: ['400081'], zone: 'Central' },
  { name: 'Powai', pincode: ['400076'], zone: 'Central' },
  
  // Navi Mumbai
  { name: 'Vashi', pincode: ['400703', '400705'], zone: 'Navi Mumbai' },
  { name: 'Nerul', pincode: ['400706'], zone: 'Navi Mumbai' },
  { name: 'Belapur', pincode: ['400614'], zone: 'Navi Mumbai' },
  { name: 'Kharghar', pincode: ['410210'], zone: 'Navi Mumbai' },
  { name: 'Panvel', pincode: ['410206'], zone: 'Navi Mumbai' },
  { name: 'Airoli', pincode: ['400708'], zone: 'Navi Mumbai' },
  { name: 'Ghansoli', pincode: ['400701'], zone: 'Navi Mumbai' },
  { name: 'Kopar Khairane', pincode: ['400709'], zone: 'Navi Mumbai' },
  
  // Thane
  { name: 'Thane West', pincode: ['400601', '400602', '400604'], zone: 'Thane' },
  { name: 'Thane East', pincode: ['400603', '400606'], zone: 'Thane' },
  { name: 'Ghodbunder Road', pincode: ['400607'], zone: 'Thane' },
  { name: 'Dombivli', pincode: ['421201', '421202'], zone: 'Thane' },
  { name: 'Kalyan', pincode: ['421301', '421306'], zone: 'Thane' },
];

export const getMumbaiZones = (): string[] => {
  return Array.from(new Set(mumbaiAreas.map(area => area.zone)));
};

export const getAreasByZone = (zone: string): MumbaiArea[] => {
  return mumbaiAreas.filter(area => area.zone === zone);
};

export const validatePincode = (pincode: string): MumbaiArea | null => {
  return mumbaiAreas.find(area => area.pincode.includes(pincode)) || null;
};

export const getAreaByName = (name: string): MumbaiArea | null => {
  return mumbaiAreas.find(area => area.name.toLowerCase() === name.toLowerCase()) || null;
};
