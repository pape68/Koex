import request from '../../utils/functions/request';

interface ExchangeCodeData {
    expiresInSeconds: number;
    code: string;
    creatingClientId: string;
}

const createExchangeCode = async (accessToken: string) => {
    const { data } = await request<ExchangeCodeData>({
        method: 'get',
        url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data?.code ?? null;
};

export default createExchangeCode;
