document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);

        const payload = {
            nome: formData.get('nome'),
            tipo_bike: formData.get('tipo_bike'),
            pedais_participa: formData.get('pedais_participa'),
            participa_trilha: formData.get('participa_trilha') === 'true',
            problema_saude: formData.get('problema_saude') || null,
            contatos_emergencia: [
                {
                    nome: formData.get('contato_nome'),
                    grau_parentesco: formData.get('contato_parentesco'),
                    telefone: formData.get('contato_telefone'),
                },
            ],
        };

        try {
            await api.createBiker(payload);
            
            statusMessage.textContent = 'Biker cadastrado com sucesso! Redirecionando...';
            statusMessage.className = 'status-message status-success';
            statusMessage.style.display = 'block';
            
            form.reset();
            
            setTimeout(() => {
                window.location.href = '/listagem';
            }, 2000);

        } catch (error) {
            statusMessage.textContent = `Erro: ${error.message}`;
            statusMessage.className = 'status-message status-error';
            statusMessage.style.display = 'block';
        }
    });
});