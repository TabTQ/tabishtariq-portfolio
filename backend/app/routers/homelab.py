from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.crud.base import CRUDBase
from app.crud.instances import container_crud, device_crud, network_entity_crud, service_crud
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import HomelabDevice
from app.schemas.homelab import (
    ContainerCreate,
    ContainerRead,
    ContainerUpdate,
    DeviceCreate,
    DeviceRead,
    DeviceUpdate,
    DeviceWithChildren,
    HomelabResponse,
    NetworkEntityCreate,
    NetworkEntityRead,
    NetworkEntityUpdate,
    ServiceCreate,
    ServiceRead,
    ServiceUpdate,
)

router = APIRouter(prefix="/api/homelab", tags=["homelab"])
admin_router = APIRouter(
    prefix="/api/admin/homelab", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=HomelabResponse)
def get_homelab(db: Session = Depends(get_db)):
    stmt = select(HomelabDevice).options(
        selectinload(HomelabDevice.containers),
        selectinload(HomelabDevice.services),
        selectinload(HomelabDevice.network_entities),
    )
    devices = list(db.scalars(stmt))
    by_category = {d.category: d for d in devices}
    return HomelabResponse(
        proxmox=by_category.get("proxmox"),
        raspberry_pi=by_category.get("raspberry_pi"),
        network=by_category.get("network"),
    )


def _register_crud(name: str, crud: CRUDBase, read, create, update):
    """Register a standard list/create/update/delete set under /api/admin/homelab/<name>."""

    @admin_router.get(f"/{name}", response_model=list[read], name=f"list_{name}")
    def list_items(db: Session = Depends(get_db)):
        return crud.get_multi(db)

    @admin_router.post(f"/{name}", response_model=read, name=f"create_{name}")
    def create_item(body: create, db: Session = Depends(get_db)):  # type: ignore[valid-type]
        return crud.create(db, body)

    @admin_router.put(f"/{name}/{{id}}", response_model=read, name=f"update_{name}")
    def update_item(id: int, body: update, db: Session = Depends(get_db)):  # type: ignore[valid-type]
        obj = crud.get(db, id)
        if not obj:
            raise HTTPException(404, "Not found")
        return crud.update(db, obj, body)

    @admin_router.delete(f"/{name}/{{id}}", name=f"delete_{name}")
    def delete_item(id: int, db: Session = Depends(get_db)):
        obj = crud.get(db, id)
        if not obj:
            raise HTTPException(404, "Not found")
        crud.remove(db, obj)
        return {"ok": True}


_register_crud("devices", device_crud, DeviceRead, DeviceCreate, DeviceUpdate)
_register_crud("containers", container_crud, ContainerRead, ContainerCreate, ContainerUpdate)
_register_crud("services", service_crud, ServiceRead, ServiceCreate, ServiceUpdate)
_register_crud(
    "network-entities",
    network_entity_crud,
    NetworkEntityRead,
    NetworkEntityCreate,
    NetworkEntityUpdate,
)
