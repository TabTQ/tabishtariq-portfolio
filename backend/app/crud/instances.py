"""One CRUD instance per domain model. A new domain adds one line here."""

from app.crud.base import CRUDBase
from app.models import (
    AcademicItem,
    Diagram,
    Experience,
    HomelabContainer,
    HomelabDevice,
    HomelabNetworkEntity,
    HomelabService,
    Project,
    ProjectDeliverable,
    Skill,
    SkillGroup,
)
from app.schemas.academic import AcademicCreate, AcademicUpdate
from app.schemas.diagram import DiagramUpsert
from app.schemas.experience import ExperienceCreate, ExperienceUpdate
from app.schemas.homelab import (
    ContainerCreate,
    ContainerUpdate,
    DeviceCreate,
    DeviceUpdate,
    NetworkEntityCreate,
    NetworkEntityUpdate,
    ServiceCreate,
    ServiceUpdate,
)
from app.schemas.project import DeliverableCreate, DeliverableUpdate, ProjectCreate, ProjectUpdate
from app.schemas.skill import SkillCreate, SkillGroupCreate, SkillGroupUpdate, SkillUpdate

experience_crud = CRUDBase[Experience, ExperienceCreate, ExperienceUpdate](Experience)
project_crud = CRUDBase[Project, ProjectCreate, ProjectUpdate](Project)
deliverable_crud = CRUDBase[ProjectDeliverable, DeliverableCreate, DeliverableUpdate](
    ProjectDeliverable
)
device_crud = CRUDBase[HomelabDevice, DeviceCreate, DeviceUpdate](HomelabDevice)
container_crud = CRUDBase[HomelabContainer, ContainerCreate, ContainerUpdate](HomelabContainer)
service_crud = CRUDBase[HomelabService, ServiceCreate, ServiceUpdate](HomelabService)
network_entity_crud = CRUDBase[HomelabNetworkEntity, NetworkEntityCreate, NetworkEntityUpdate](
    HomelabNetworkEntity
)
skill_group_crud = CRUDBase[SkillGroup, SkillGroupCreate, SkillGroupUpdate](SkillGroup)
skill_crud = CRUDBase[Skill, SkillCreate, SkillUpdate](Skill)
academic_crud = CRUDBase[AcademicItem, AcademicCreate, AcademicUpdate](AcademicItem)
diagram_crud = CRUDBase[Diagram, DiagramUpsert, DiagramUpsert](Diagram)
