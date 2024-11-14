import mongoose from 'mongoose';

// Connect to a test database before running tests
beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test_database`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect from the test database after running tests
afterAll(async () => {
    await mongoose.connection.close();
});