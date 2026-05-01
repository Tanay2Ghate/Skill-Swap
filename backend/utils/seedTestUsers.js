const { User, UserSkill, Skill } = require('../models');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

async function seedTestUsers() {
  try {
    console.log('Seeding test users...');
    const allSkills = await Skill.findAll();
    if (allSkills.length === 0) return console.log('Run seedSkills.js first');

    const testUsers = [
      { name: 'Sarah Connor', email: 'sarah@test.com', bio: 'I need to learn DevOps to stop skynet.' },
      { name: 'John Wick', email: 'john@test.com', bio: 'I am a retired hitman, currently trying to learn Yoga to calm down.' },
      { name: 'Tony Stark', email: 'tony@test.com', bio: 'Genius, billionaire, playboy, philanthropist. Need someone to teach me cooking.' },
      { name: 'Bruce Wayne', email: 'bruce@test.com', bio: 'Looking for French lessons. Can teach martial arts and stock market.' },
      { name: 'Clark Kent', email: 'clark@test.com', bio: 'Journalist looking to learn SEO.' }
    ];

    const passwordHash = await bcrypt.hash('password123', 10);
    
    for (const u of testUsers) {
      const existing = await User.findOne({ where: { email: u.email } });
      if (!existing) {
        const createdUser = await User.create({
          name: u.name,
          email: u.email,
          password_hash: passwordHash,
          bio: u.bio,
          avg_rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          swap_count: Math.floor(Math.random() * 20),
          is_verified: true
        });

        // Add 2 random HAVE skills and 2 random WANT skills
        const shuffled = allSkills.sort(() => 0.5 - Math.random());
        await UserSkill.bulkCreate([
          { user_id: createdUser.id, skill_id: shuffled[0].id, type: 'have', proficiency: 'expert' },
          { user_id: createdUser.id, skill_id: shuffled[1].id, type: 'have', proficiency: 'intermediate' },
          { user_id: createdUser.id, skill_id: shuffled[2].id, type: 'want', proficiency: 'beginner' },
          { user_id: createdUser.id, skill_id: shuffled[3].id, type: 'want', proficiency: 'beginner' }
        ]);
        console.log(`Created user ${u.name} with skills.`);
      }
    }
    console.log('Test users seeded successfully!');
  } catch (error) {
    console.error('Error seeding test users:', error);
  } finally {
    process.exit(0);
  }
}

seedTestUsers();
