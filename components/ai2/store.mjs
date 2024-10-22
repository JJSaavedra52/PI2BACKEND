import Complex from '../complex/model.js';

// Read (R) complex
export const getComplex = async (complex) => {
    try {
        const complex_res = await Complex.findById(complex);
        return complex_res;
    } catch (error) {
        throw new Error(error);
    }
};