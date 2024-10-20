import axios from 'axios';

const API_KEY = '09459085-5327-4ae9-85a8-214b7755fc2a';
const BASE_URL = 'https://api.kod.mobi/api/v1/message';

const apiInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    },
});

// Метод для создания сессии
export const createSession = async (phone: string) => {
    try {
        const response = await apiInstance.get(`/create?phone=${phone}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при создании сессии:', error);
        throw error;
    }
};

// Метод для повторной отправки кода через определенный канал
export const sendCode = async (sessionId: string, type: string) => {
    try {
        const response = await apiInstance.get(`/send?session_id=${sessionId}&type=${type}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при повторной отправке кода:', error);
        throw error;
    }
};

// Метод для проверки кода
export const checkCode = async (sessionId: string, code: string) => {
    try {
        const response = await apiInstance.get(`/check?session_id=${sessionId}&code=${code}`);
        return response.data.data;
    } catch (error) {
        console.error('Ошибка при проверке кода:', error);
        throw error;
    }
};
