import mongoose from 'mongoose';
import { MovieModel } from './movieModel.js'; // Adjust path to your model file

const MONGO_URI = "mongodb+srv://sanjaidevn:sanjaidevn.cloud@testing0.54uxbl9.mongodb.net/MovieManagement?appName=Testing0"; // Replace with your URI

const movies = [
    { Title: 'Inception', Language: 'ENGLISH', Genres: ['SCI-FI', 'ACTION'], 'Release-Year': 2010 },
    { Title: 'The Dark Knight', Language: 'ENGLISH', Genres: ['ACTION', 'CRIME'], 'Release-Year': 2008 },
    { Title: 'Interstellar', Language: 'ENGLISH', Genres: ['SCI-FI', 'DRAMA'], 'Release-Year': 2014 },
    { Title: 'Parasite', Language: 'KOREAN', Genres: ['THRILLER', 'DRAMA'], 'Release-Year': 2019 },
    { Title: 'Spirited Away', Language: 'JAPANESE', Genres: ['ANIMATION', 'FANTASY'], 'Release-Year': 2001 },
    { Title: 'The Godfather', Language: 'ENGLISH', Genres: ['CRIME', 'DRAMA'], 'Release-Year': 1972 },
    { Title: 'Pulp Fiction', Language: 'ENGLISH', Genres: ['CRIME', 'DRAMA'], 'Release-Year': 1994 },
    { Title: 'The Matrix', Language: 'ENGLISH', Genres: ['SCI-FI', 'ACTION'], 'Release-Year': 1999 },
    { Title: 'Seven Samurai', Language: 'JAPANESE', Genres: ['ACTION', 'DRAMA'], 'Release-Year': 1954 },
    { Title: 'Amelie', Language: 'KOREAN', Genres: ['ROMANCE', 'COMEDY'], 'Release-Year': 2001 },
    { Title: 'City of God', Language: 'KOREAN', Genres: ['CRIME', 'DRAMA'], 'Release-Year': 2002 },
    { Title: 'OldMan', Language: 'KOREAN', Genres: ['ACTION', 'THRILLER'], 'Release-Year': 2003 },
    { Title: 'Pan\'s Labyrinth', Language: 'SPANISH', Genres: ['FANTASY', 'WAR'], 'Release-Year': 2006 },
    { Title: 'Cinema Paradiso', Language: 'SPANISH', Genres: ['DRAMA', 'ROMANCE'], 'Release-Year': 1988 },
    { Title: 'Life Is Beautiful', Language: 'SPANISH', Genres: ['COMEDY', 'WAR'], 'Release-Year': 1997 },
    { Title: 'Crouching Tiger, Hidden Dragon', Language: 'SPANISH', Genres: ['ACTION', 'ADVENTURE'], 'Release-Year': 2000 },
    { Title: 'The Intouchables', Language: 'SPANISH', Genres: ['COMEDY', 'DRAMA'], 'Release-Year': 2011 },
    { Title: 'Léon: The Professional', Language: 'ENGLISH', Genres: ['ACTION', 'CRIME'], 'Release-Year': 1994 },
    { Title: 'A Separation', Language: 'SPANISH', Genres: ['DRAMA', 'MYSTERY'], 'Release-Year': 2011 },
    { Title: 'The Hunt', Language: 'SPANISH', Genres: ['DRAMA', 'THRILLER'], 'Release-Year': 2012 },
    { Title: 'The Shawshank Redemption', Language: 'ENGLISH', Genres: ['DRAMA'], 'Release-Year': 1994 },
    { Title: 'Oldboy', Language: 'KOREAN', Genres: ['ACTION', 'THRILLER'], 'Release-Year': 2003 },
    { Title: 'Amores Perros', Language: 'SPANISH', Genres: ['DRAMA', 'THRILLER'], 'Release-Year': 2000 },
    { Title: 'Memories of Murder', Language: 'KOREAN', Genres: ['CRIME', 'DRAMA'], 'Release-Year': 2003 },
    { Title: 'The Secret in Their Eyes', Language: 'SPANISH', Genres: ['DRAMA', 'MYSTERY'], 'Release-Year': 2009 },
    { Title: 'Fight Club', Language: 'ENGLISH', Genres: ['DRAMA'], 'Release-Year': 1999 },
    { Title: 'Train to Busan', Language: 'KOREAN', Genres: ['ACTION', 'HORROR'], 'Release-Year': 2016 },
    { Title: 'The Invisible Guest', Language: 'SPANISH', Genres: ['CRIME', 'THRILLER'], 'Release-Year': 2016 },
    { Title: 'Schindler\'s List', Language: 'ENGLISH', Genres: ['DRAMA', 'HISTORY'], 'Release-Year': 1993 },
    { Title: 'Roma', Language: 'SPANISH', Genres: ['DRAMA'], 'Release-Year': 2018 }
];


const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB...');

        // Optional: Clear existing data to avoid unique index conflicts
        // await MovieModel.deleteMany({});

        // Using insertMany for efficiency
        const docs = await MovieModel.insertMany(movies);
        console.log(`${docs.length} movies successfully injected!`);

    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedDatabase();
