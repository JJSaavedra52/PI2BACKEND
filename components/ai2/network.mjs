import {Router} from 'express';
import {success, error} from '../../network/response.mjs';
import {queryAIModel} from './controller.mjs';

const controller = {queryAIModel};

const router = Router();

router.post('/input/:idComplex', (req, res) => {
    controller.queryAIModel(req, res)
        .then(({ status, message }) => {
            success(res, message, status);
        })
        .catch(({ status, message }) => {
            error(res, 'Internal error', status || 500, message);
        });
});

export { router };