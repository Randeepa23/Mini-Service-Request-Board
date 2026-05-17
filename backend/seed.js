require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/JobRequest');

const jobs = [
  {
    title: 'Leaking kitchen tap',
    description: 'Constant drip from the kitchen mixer tap, needs urgent fix before it causes water damage to the cabinet below.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'John Smith',
    contactEmail: 'john@example.com'
  },
  {
    title: 'Broken circuit breaker',
    description: 'The main circuit breaker trips every hour, especially when the oven is running. Needs inspection and possible replacement.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'Sara Lee',
    contactEmail: 'sara@example.com'
  },
  {
    title: 'Living room repaint',
    description: 'Full living room repaint needed. Walls are currently beige, would like white. Room is approximately 5m x 4m with one feature wall.',
    category: 'Painting',
    location: 'Manchester',
    contactName: 'Tom Walker',
    contactEmail: 'tom@example.com'
  },
  {
    title: 'Kitchen cabinet installation',
    description: '5 wall-mounted kitchen units to fit. Units have been purchased already, just need professional installation.',
    category: 'Joinery',
    location: 'Leeds',
    contactName: 'Amy Roberts',
    contactEmail: 'amy@example.com'
  },
  {
    title: 'Bathroom pipe burst',
    description: 'Emergency! Pipe burst behind the bathroom wall. Water has been isolated but needs repair ASAP. Some water damage to the floor.',
    category: 'Plumbing',
    location: 'London',
    contactName: 'Mike Davidson',
    contactEmail: 'mike@example.com',
    status: 'In Progress'
  },
  {
    title: 'Outdoor lighting installation',
    description: 'Want to install 6 garden path LED lights and a motion sensor security light above the front door. Cabling needed from the consumer unit.',
    category: 'Electrical',
    location: 'Bristol',
    contactName: 'Claire Anderson',
    contactEmail: 'claire@example.com'
  },
  {
    title: 'Fence panel replacement',
    description: 'Storm damage destroyed 3 fence panels (6ft x 6ft). Need new treated panels supplied and fitted. Posts appear to be intact.',
    category: 'Joinery',
    location: 'Glasgow',
    contactName: 'David Murray',
    contactEmail: 'david@example.com'
  },
  {
    title: 'Exterior house painting',
    description: 'Front of a semi-detached house needs repainting. Some areas have peeling paint that needs scraping first. Two-storey, scaffolding may be needed.',
    category: 'Painting',
    location: 'Liverpool',
    contactName: 'Rachel Green',
    contactEmail: 'rachel@example.com'
  },
  {
    title: 'Radiator not heating up',
    description: 'One radiator in the upstairs bedroom has stopped working. It has been bled and the valve is open but still cold. Rest of the system is fine.',
    category: 'Plumbing',
    location: 'Edinburgh',
    contactName: 'James Wilson',
    contactEmail: 'james@example.com',
    status: 'Closed'
  },
  {
    title: 'New power sockets in garage',
    description: 'Need 3 double sockets installed in the garage for power tools. Currently no mains power in the garage at all. About 8m cable run from the house.',
    category: 'Electrical',
    location: 'Cardiff',
    contactName: 'Olivia Brown',
    contactEmail: 'olivia@example.com'
  }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Job.deleteMany();
  await Job.insertMany(jobs);
  console.log(`Seeded ${jobs.length} sample jobs successfully!`);
  process.exit();
}).catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});