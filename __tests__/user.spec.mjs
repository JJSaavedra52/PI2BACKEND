import { add, get, update, remove, getById, login } from '../components/user/controller.mjs';
import { addUser, updateUser } from '../components/user/store.mjs';

jest.mock('../components/user/store.mjs');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('add', () => {
        test('should add a new user', async () => {
            req.body = {
                idDocument: '123456',
                userName: 'John Doe',
                idComplex: 'complex1',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
                apartment: '101',
                role: 'RESIDENT',
            };

            addUser.mockResolvedValue(req.body);

            const result = await add(req, res);
            expect(result.status).toBe(201);
            expect(result.message).toEqual(req.body);
        });

        test('should return an error if required fields are missing', async () => {
            req.body = {
                userName: 'John Doe',
                email: 'john.doe@example.com',
            };

            const result = await add(req, res);
            expect(result.status).toBe(400);
            expect(result.message).toBe('Los espacios están vacios');
        });
    });

describe('get', () => {
    test('should return an error if complex ID is invalid', async () => {
        req.params.idComplex = 'invalid_id';

        await get(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
    });
});

    describe('update', () => {
        test('should update a user', async () => {
            req.body = {
                _id: 'user1',
                idDocument: '123456',
                userName: 'John Doe',
                idComplex: 'complex1',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
                apartment: '101',
                role: 'RESIDENT',
            };

            updateUser.mockResolvedValue('Usuario actualizado');

            const result = await update(req, res);
            return result;
        });
    });

    describe('remove', () => {
        test('should return an error if user ID is invalid', async () => {
            req.params.id = 'invalid_id';

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('getById', () => {
        test('should return an error if user ID is invalid', async () => {
            req.params.idUser = 'invalid_id';

            await getById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });
});