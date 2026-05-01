const { sequelize, Skill } = require('../models');

const skills = [
  // Programming
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'React.js', category: 'Programming' },
  { name: 'Node.js', category: 'Programming' },
  { name: 'SQL / MySQL', category: 'Programming' },
  { name: 'Machine Learning', category: 'Programming' },
  { name: 'Data Science', category: 'Programming' },
  { name: 'DevOps / Docker', category: 'Programming' },

  // Design
  { name: 'Graphic Design', category: 'Design' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
  { name: 'Adobe Photoshop', category: 'Design' },
  { name: 'Illustrator', category: 'Design' },
  { name: 'Motion Graphics', category: 'Design' },
  { name: 'Logo Design', category: 'Design' },

  // Language
  { name: 'English', category: 'Language' },
  { name: 'Hindi', category: 'Language' },
  { name: 'French', category: 'Language' },
  { name: 'Spanish', category: 'Language' },
  { name: 'German', category: 'Language' },
  { name: 'Japanese', category: 'Language' },
  { name: 'Tamil', category: 'Language' },

  // Music
  { name: 'Guitar', category: 'Music' },
  { name: 'Piano / Keyboard', category: 'Music' },
  { name: 'Drums', category: 'Music' },
  { name: 'Singing / Vocals', category: 'Music' },
  { name: 'Music Production', category: 'Music' },
  { name: 'Violin', category: 'Music' },

  // Finance
  { name: 'Stock Market', category: 'Finance' },
  { name: 'Personal Finance', category: 'Finance' },
  { name: 'Accounting', category: 'Finance' },
  { name: 'Excel / Spreadsheets', category: 'Finance' },
  { name: 'Crypto / Web3', category: 'Finance' },

  // Marketing
  { name: 'Social Media Marketing', category: 'Marketing' },
  { name: 'SEO', category: 'Marketing' },
  { name: 'Content Writing', category: 'Marketing' },
  { name: 'Video Editing', category: 'Marketing' },
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'Copywriting', category: 'Marketing' },

  // Photography
  { name: 'Photography', category: 'Photography' },
  { name: 'Photo Editing', category: 'Photography' },
  { name: 'Videography', category: 'Photography' },

  // Writing
  { name: 'Creative Writing', category: 'Writing' },
  { name: 'Blog Writing', category: 'Writing' },
  { name: 'Resume Writing', category: 'Writing' },

  // Math
  { name: 'Mathematics', category: 'Math' },
  { name: 'Statistics', category: 'Math' },
  { name: 'Physics', category: 'Math' },

  // Other
  { name: 'Public Speaking', category: 'Other' },
  { name: 'Cooking', category: 'Other' },
  { name: 'Yoga / Fitness', category: 'Other' },
  { name: 'Chess', category: 'Other' }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Check if skills already exist to avoid duplicates
    const count = await Skill.count();
    if (count === 0) {
      await Skill.bulkCreate(skills);
      console.log('Successfully seeded skills.');
    } else {
      console.log('Skills already seeded.');
    }
  } catch (error) {
    console.error('Failed to seed skills:', error);
  } finally {
    if (require.main === module) {
      process.exit(0);
    }
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
