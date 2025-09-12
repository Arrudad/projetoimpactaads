from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import select, Session
from typing import List
import csv
from io import StringIO

from models import (
    Biker, BikerCreate, BikerRead, BikerReadWithContacts, BikerUpdate, EmergencyContact
)
from db import get_session

# Cria um "roteador" para organizar os endpoints relacionados a bikers
router = APIRouter(
    prefix="/bikers",
    tags=["Bikers"],
)

# ================================================================
# FUNÇÃO CREATE_BIKER CORRIGIDA
# ================================================================
@router.post("", response_model=BikerReadWithContacts)
def create_biker(payload: BikerCreate, session: Session = Depends(get_session)):
    """Cria um novo biker e seus contatos de emergência."""
    try:
        biker_data = payload.model_dump(exclude={'contatos_emergencia'})
        
        contacts_objects = [EmergencyContact.model_validate(c) for c in payload.contatos_emergencia]
        
        biker = Biker(**biker_data, contatos_emergencia=contacts_objects)
        
        session.add(biker)
        session.commit()
        session.refresh(biker)
        
        return biker
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")
        raise HTTPException(status_code=500, detail="Erro interno ao criar o biker.")

@router.get("", response_model=List[BikerRead])
def get_all_bikers(session: Session = Depends(get_session)):
    """Retorna uma lista de todos os bikers."""
    return session.exec(select(Biker)).all()

@router.get("/{biker_id}", response_model=BikerReadWithContacts)
def get_biker_details(biker_id: int, session: Session = Depends(get_session)):
    """Retorna os detalhes de um biker específico, incluindo contatos."""
    biker = session.get(Biker, biker_id)
    if not biker:
        raise HTTPException(status_code=404, detail="Biker não encontrado")
    return biker

@router.get("/search/", response_model=List[BikerReadWithContacts])
def search_bikers_by_name(nome: str, session: Session = Depends(get_session)):
    """Busca bikers por nome (case-insensitive) e retorna seus dados completos."""
    if not nome or not nome.strip():
        return []
        
    statement = select(Biker).where(Biker.nome.ilike(f"%{nome}%"))
    results = session.exec(statement).all()
    
    return results

@router.patch("/{biker_id}", response_model=BikerRead)
def update_biker(biker_id: int, payload: BikerUpdate, session: Session = Depends(get_session)):
    """Atualiza as informações de um biker."""
    biker = session.get(Biker, biker_id)
    if not biker:
        raise HTTPException(status_code=404, detail="Biker não encontrado")
    
    payload_data = payload.model_dump(exclude_unset=True)
    for key, value in payload_data.items():
        setattr(biker, key, value)
        
    session.add(biker)
    session.commit()
    session.refresh(biker)
    return biker

@router.delete("/{biker_id}")
def delete_biker(biker_id: int, session: Session = Depends(get_session)):
    """Deleta um biker do banco de dados."""
    biker = session.get(Biker, biker_id)
    if not biker:
        raise HTTPException(status_code=404, detail="Biker não encontrado")
    
    session.delete(biker)
    session.commit()
    return {"ok": True, "message": "Biker deletado com sucesso."}

@router.get("/export/csv", response_class=Response)
def export_csv(session: Session = Depends(get_session)):
    """Exporta todos os bikers para um arquivo CSV e inicia o download."""
    bikers = session.exec(select(Biker)).all()
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["ID", "Nome", "Tipo de Bike", "Pedais que Participa", "Participa de Trilha", "Problema de Saúde"])
    
    for biker in bikers:
        writer.writerow([
            biker.id,
            biker.nome,
            biker.tipo_bike,
            biker.pedais_participa,
            "Sim" if biker.participa_trilha else "Não",
            biker.problema_saude or "Nenhum"
        ])
    
    output.seek(0)
    
    return Response(
        content=output.read(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=export_bikers.csv"}
    )