import { getTech } from './subscriber';
import { dataFetch } from './api/dataFetch';

describe('subscriber', () => {
    let techs = [];

    beforeAll(async () => {
        techs = await dataFetch(process.env.URL_GET_TECH_CODE);
        // Do whatever you need to do
    });
    
    test('should be ABCD', () => {
        const bar = {
            vsa: 0,
            cs: 4
        };
        const result = getTech(techs, bar);
        expect(result).toEqual('ABC-001');
    });

});
