import sendEpicAPIRequest from '../../utils/functions/request';

interface ExchangeCodeResponse {
    expiresInSeconds: number;
    code: string;
    creatingClientId: string;
}

const createExchangeCode = async (accessToken: string) => {
    const { data } = await sendEpicAPIRequest<ExchangeCodeResponse>({
        method: 'GET',
        url: 'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/exchange',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data?.code ?? null;
};

export default createExchangeCode;
