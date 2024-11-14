import { validateAnuncio, add, getByComplex, update, remove } from '../components/anouncements/controller.mjs';
import { addAnoun, getAnounsByComplex, updateAnoun, deleteAnoun } from '../components/anouncements/store.mjs';
import mongoose from 'mongoose';

jest.mock('../components/anouncements/store.mjs', () => ({
    addAnoun: jest.fn(),
    getAnounsByComplex: jest.fn(),
    updateAnoun: jest.fn(),
    deleteAnoun: jest.fn(),
}));

jest.mock('../components/anouncements/controller.mjs', () => ({
    validateAnuncio: jest.fn(),
    add: jest.requireActual('../components/anouncements/controller.mjs').add,
    getByComplex: jest.requireActual('../components/anouncements/controller.mjs').getByComplex,
    update: jest.requireActual('../components/anouncements/controller.mjs').update,
    remove: jest.requireActual('../components/anouncements/controller.mjs').remove,
}));

describe('Announcements Controller', () => {
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

        // Mock mongoose.Types.ObjectId.isValid to always return true
        jest.spyOn(mongoose.Types.ObjectId, 'isValid').mockReturnValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('add', () => {
        test('should add a new announcement', async () => {
            req.body = {
                title: 'Announcement 1',
                content: 'This is the content of announcement 1',
                date: '2023-10-01',
            };

            const announcement = { ...req.body };
            addAnoun.mockResolvedValue(announcement);

            const result = await add(req, res);
            expect(result.status).toBe(201);
            expect(result.message).toEqual(announcement);
        });
    });

    describe('getByComplex', () => {
        test('should get all announcements by complex ID', async () => {
            req.params.idComplex = 'complex1';
            const announcements = [
                { title: 'Announcement 1', content: 'Content 1', date: '2023-10-01' },
                { title: 'Announcement 2', content: 'Content 2', date: '2023-10-02' },
            ];

            getAnounsByComplex.mockResolvedValue(announcements);

            const result = await getByComplex(req, res);
            expect(result.status).toBe(200);
            expect(result.message).toEqual(announcements);
        });
    });
});