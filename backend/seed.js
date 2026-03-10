const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('./models/User');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sidd160306_db_user:Operamini985@cluster0.priryns.mongodb.net/?appName=Cluster0";

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Check if Admin exists
        let admin = await User.findOne({ email: 'admin@demo.com' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            admin = await User.create({
                name: 'Demo Admin',
                email: 'admin@demo.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Demo Admin created!');
        } else {
            console.log('Demo Admin already exists.');
        }

        // Check if Normal User exists
        let user = await User.findOne({ email: 'user@demo.com' });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('user123', salt);
            
            user = await User.create({
                name: 'Demo User',
                email: 'user@demo.com',
                password: hashedPassword,
                role: 'user'
            });
            console.log('Demo Normal User created!');
        } else {
            console.log('Demo Normal User already exists.');
        }

        // Add some demo jobs
        await Job.deleteMany({}); // Optional: clear existing jobs first to start fresh
        
        const demoJobs = [
            {
                title: 'Remote Account Coordinator',
                department: 'Software Development',
                location: 'United States • remote',
                type: 'Full Time',
                description: 'Join a dynamic company that values innovation and excellence. Whether you are an experienced sales professional or a newcomer, this remote role offers flexibility and the opportunity to ignite your career. Maximize your earning potential with our support and embark on a fulfilling career path.\n\nKey Responsibilities:\n- Collaborate with seasoned mentors and excel in a supportive team setting.\n- Initiate client interactions via phone to understand their needs.\n- Schedule and lead virtual consultations (via Zoom or phone) for comprehensive reviews.\n- Design personalized insurance quotes to meet each client\'s needs.',
                salary: '$ 100k - 1,100k',
                createdBy: admin._id,
            },
            {
                title: 'Fully Remote Agent',
                department: 'Sales',
                location: 'United States • remote',
                type: 'Full Time',
                description: 'We are looking for self-motivated individuals to join our fully remote customer service team. This position provides extensive training to help you succeed. You will be dealing with direct inbound calls regarding our services and maintaining a very high standard of customer satisfaction.\n\nWhat We Offer:\n- Uncapped earning potential\n- Flexible working hours\n- Performance-based bonuses\n\nMust be legally allowed to work remote globally.',
                salary: '$ 1,000k - 11,000k',
                createdBy: admin._id,
            },
            {
                title: 'Frontend Developer',
                department: 'Engineering',
                location: 'REMOTE • remote',
                type: 'Part Time',
                description: 'We need an experienced Frontend Developer specialized in React, Vite, and Tailwind CSS. You will be building responsive components following modern web design practices. The ideal candidate will be extremely detail-oriented, ensuring pixel-perfect replication of provided designs. This is a part-time contract role. Familiarity with Node.js backend is a plus but not strictly required.',
                salary: '₹ 2k - 3k',
                createdBy: admin._id,
            }
        ];

        await Job.insertMany(demoJobs);
        console.log('Demo Jobs created!');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
