from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class EmergencyContactBase(SQLModel):
    nome: str
    grau_parentesco: str
    telefone: str

class EmergencyContact(EmergencyContactBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    biker_id: Optional[int] = Field(default=None, foreign_key="biker.id")
    biker: "Biker" = Relationship(back_populates="contatos_emergencia")

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactRead(EmergencyContactBase):
    id: int

class BikerBase(SQLModel):
    nome: str
    tipo_bike: str
    pedais_participa: str
    participa_trilha: bool
    problema_saude: Optional[str] = Field(default=None, max_length=255)

class Biker(BikerBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    contatos_emergencia: List["EmergencyContact"] = Relationship(
        back_populates="biker",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class BikerRead(BikerBase):
    id: int

class BikerCreate(BikerBase):
    contatos_emergencia: List[EmergencyContactCreate] = []

class BikerReadWithContacts(BikerRead):
    contatos_emergencia: List[EmergencyContactRead] = []

class BikerUpdate(SQLModel):
    nome: Optional[str] = None
    tipo_bike: Optional[str] = None
    pedais_participa: Optional[str] = None
    participa_trilha: Optional[bool] = None
    problema_saude: Optional[str] = None
    