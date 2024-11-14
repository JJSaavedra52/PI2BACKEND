import { add, answer, get, getByUser, close, pqrsAnswers, notify, reopen, notifyOne } from '../components/pqrs/controller.mjs';
import { createPqrs, addAnswer, getPqrsByUser, getPqrsByComplex, closePqrs, reopenPqrs, getPqrsAnswers, notifyPqrs, notifyOnePqrs } from '../components/pqrs/store.mjs';
import User from '../components/user/model.mjs';
import mongoose from 'mongoose';

jest.mock('../components/pqrs/store.mjs');
jest.mock('../components/user/model.mjs');

describe('PQRS Controller', () => {
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
        test('should add a new PQRS', async () => {
            req.body = {
                user: 'user1',
                case: 'case1',
                description: 'description1',
                category: 'category1',
            };

            const userData = { _id: 'user1', userName: 'John Doe', idComplex: 'complex1' };
            User.findById.mockResolvedValue(userData);
            createPqrs.mockResolvedValue(req.body);

            await add(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "PQRS created successfully", data: req.body });
        });
    });

    describe('get', () => {
        test('should return an error if complex ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';

            await get(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid complex ID' });
        });
    });

    describe('getByUser', () => {
        test('should return an error if user ID is invalid', async () => {
            req.params.idUser = 'invalid_id';

            await getByUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user ID' });
        });
    });

    describe('answer', () => {
        test('should return an error if PQRS ID is invalid', async () => {
            req.params.id = 'invalid_id';

            await answer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid PQRS ID" });
        });
    });

    describe('close', () => {
        test('should return an error if PQRS ID is invalid', async () => {
            req.params.id = 'invalid_id';

            await close(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid PQRS ID' });
        });
    });

    describe('reopen', () => {
        test('should return an error if PQRS ID is invalid', async () => {
            req.params.id = 'invalid_id';

            await reopen(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid PQRS ID' });
        });
    });

    describe('notify', () => {
        test('should return an error if user ID is invalid', async () => {
            req.params.idUser = 'invalid_id';

            await notify(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid User Id' });
        });
    });

    describe('notifyOne', () => {
        test('should return an error if user ID is invalid', async () => {
            req.params.idUser = 'invalid_id';
            req.params.idPqrs = 'pqrs1';

            await notifyOne(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid User Id' });
        });

        test('should return an error if PQRS ID is invalid', async () => {
            req.params.idUser = 'user1';
            req.params.idPqrs = 'invalid_id';

            await notifyOne(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid User Id' });
        });
    });
});