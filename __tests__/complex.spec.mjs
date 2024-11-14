import { add, get, getConfigColors, update, remove, updateColors, addZone, getZone, updateZone, deleteZone, getZones } from '../components/complex/controller.mjs';
import { addComplex, getComplex, updateComplex, deleteComplex, getComplexColors, updateComplexColors, addComplexZone, getComplexZone, updateComplexZone, deleteComplexZone } from '../components/complex/store.mjs';

jest.mock('../components/complex/store.mjs');

describe('Complex Controller', () => {
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

    describe('get', () => {
         test('should return an error if ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';

            await get(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('getConfigColors', () => {
        test('should return an error if ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';

            await getConfigColors(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('remove', () => {
        test('should return an error if ID is invalid', async () => {
            req.params.id = 'invalid_id';

            await remove(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });

    });

    describe('addZone', () => {
        test('should return an error if required fields are missing', async () => {
            req.params.idComplex = 'complex1';
            req.body = {
                name: 'Zone 1',
            };

            await addZone(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
        });

        test('should return an error if complex ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';
            req.body = {
                name: 'Zone 1',
                availableDays: ['Monday', 'Tuesday'],
                availableHours: {
                    start: '08:00',
                    end: '18:00',
                },
            };

            await addZone(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid complex ID format' });
        });
    });

    describe('getZone', () => {


        test('should return an error if ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';
            req.params.idZone = 'zone1';

            await getZone(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('updateZone', () => {
        test('should return an error if ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';
            req.params.idZone = 'zone1';
            req.body = {
                name: 'Zone 1',
                availableDays: ['Monday', 'Tuesday'],
                availableHours: {
                    start: '08:00',
                    end: '18:00',
                },
            };

            await updateZone(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('deleteZone', () => {
        test('should return an error if ID is invalid', async () => {
            req.params.idZone = 'invalid_id';

            await deleteZone(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });

    describe('getZones', () => {

        test('should return an error if ID is invalid', async () => {
            req.params.idComplex = 'invalid_id';

            await getZones(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID format' });
        });
    });
});