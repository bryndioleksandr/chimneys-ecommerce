import axios from 'axios';

export const fetchCities = async () => {
    try {
        const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: '1e625696b7a9aba90adcff6761ac576a',
            modelName: 'Address',
            calledMethod: 'getCities',
            methodProperties: {}
        });

        console.log('Отримана cities data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Помилка при запиті:', error);
    }
};

export const fetchWarehouses = async (cityName) => {
    try {
        const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
            apiKey: '1e625696b7a9aba90adcff6761ac576a',
            modelName: 'AddressGeneral',
            calledMethod: 'getWarehouses',
            methodProperties: {
                CityName: cityName,
            }
        });

        console.log('Отримана warehouses data:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Помилка при запиті:', error);
    }
}
