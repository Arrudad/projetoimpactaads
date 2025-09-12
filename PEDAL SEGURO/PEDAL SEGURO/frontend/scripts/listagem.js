document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#bikers-table tbody');
    const loadingMessage = document.getElementById('loading-message');
    const statusMessage = document.getElementById('status-message');
    const filterInput = document.getElementById('filter-input'); // Pega o novo campo de filtro

    const loadBikers = async () => {
        try {
            const bikers = await api.getBikers();
            loadingMessage.style.display = 'none';
            tableBody.innerHTML = ''; // Limpa a tabela antes de preencher

            if (bikers.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">Nenhum biker cadastrado.</td></tr>';
                return;
            }

            bikers.forEach(biker => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${biker.nome}</td>
                    <td>${biker.tipo_bike}</td>
                    <td>${biker.problema_saude || 'Nenhum'}</td>
                    <td class="action-buttons">
                        <a href="/editar?id=${biker.id}" class="edit-btn">Editar</a>
                        <button class="delete-btn" data-id="${biker.id}">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            loadingMessage.textContent = 'Erro ao carregar os bikers.';
            console.error(error);
        }
    };
    
    // LÓGICA DO FILTRO EM TEMPO REAL
    filterInput.addEventListener('input', () => {
        const filterText = filterInput.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const nameCell = row.querySelector('td:first-child');
            if (nameCell) {
                const nameText = nameCell.textContent.toLowerCase();
                if (nameText.includes(filterText)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
    
    tableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const bikerId = e.target.dataset.id;
            
            if (confirm('Tem certeza que deseja excluir este biker? Esta ação não pode ser desfeita.')) {
                try {
                    await api.deleteBiker(bikerId);
                    statusMessage.textContent = 'Biker excluído com sucesso!';
                    statusMessage.className = 'status-message status-success';
                    statusMessage.style.display = 'block';
                    loadBikers(); // Recarrega a lista
                } catch (error) {
                    statusMessage.textContent = `Erro ao excluir: ${error.message}`;
                    statusMessage.className = 'status-message status-error';
                    statusMessage.style.display = 'block';
                }
            }
        }
    });

    loadBikers();
});