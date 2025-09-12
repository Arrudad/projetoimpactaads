document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('editar-form');
    const formTitle = document.getElementById('form-title');
    const statusMessage = document.getElementById('status-message');

    const params = new URLSearchParams(window.location.search);
    const bikerId = params.get('id');

    if (!bikerId) {
        window.location.href = '/listagem';
        return;
    }

    try {
        const biker = await api.getBikerById(bikerId);
        
        formTitle.textContent = `Editando: ${biker.nome}`;
        document.getElementById('biker_id').value = biker.id;
        document.getElementById('nome').value = biker.nome;
        document.getElementById('tipo_bike').value = biker.tipo_bike;
        document.getElementById('pedais_participa').value = biker.pedais_participa;
        document.getElementById('problema_saude').value = biker.problema_saude || '';
        
        if (biker.participa_trilha) {
            document.getElementById('trilha_sim').checked = true;
        } else {
            document.getElementById('trilha_nao').checked = true;
        }

    } catch (error) {
        formTitle.textContent = 'Erro ao carregar biker';
        statusMessage.textContent = error.message;
        statusMessage.className = 'status-message status-error';
        statusMessage.style.display = 'block';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const payload = {
            nome: formData.get('nome'),
            tipo_bike: formData.get('tipo_bike'),
            pedais_participa: formData.get('pedais_participa'),
            participa_trilha: formData.get('participa_trilha') === 'true',
            problema_saude: formData.get('problema_saude') || null,
        };

        try {
            await api.updateBiker(bikerId, payload);
            
            statusMessage.textContent = 'Dados atualizados com sucesso! Redirecionando...';
            statusMessage.className = 'status-message status-success';
            statusMessage.style.display = 'block';

            setTimeout(() => {
                window.location.href = '/listagem';
            }, 2000);

        } catch (error) {
            statusMessage.textContent = `Erro ao atualizar: ${error.message}`;
            statusMessage.className = 'status-message status-error';
            statusMessage.style.display = 'block';
        }
    });
});
