const API_BASE_URL = '/api';

const api = {
    getBikers: async () => {
        const response = await fetch(`${API_BASE_URL}/bikers`);
        if (!response.ok) throw new Error('Falha ao buscar bikers');
        return response.json();
    },

    getBikerById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bikers/${id}`);
        if (!response.ok) throw new Error('Falha ao buscar detalhes do biker');
        return response.json();
    },

    createBiker: async (bikerData) => {
        const response = await fetch(`${API_BASE_URL}/bikers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bikerData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Falha ao cadastrar biker');
        }
        return response.json();
    },

    updateBiker: async (id, bikerData) => {
        const response = await fetch(`${API_BASE_URL}/bikers/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bikerData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Falha ao atualizar biker');
        }
        return response.json();
    },

    deleteBiker: async (id) => {
        const response = await fetch(`${API_BASE_URL}/bikers/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Falha ao deletar biker');
        }
        return response.json();
    },
};