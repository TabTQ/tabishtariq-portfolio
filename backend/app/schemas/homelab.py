from app.schemas.base import CamelModel


class ContainerBase(CamelModel):
    container_key: str
    device_id: int
    name: str
    ip_address: str | None = None
    purpose: str | None = None
    resources: str | None = None
    status: str = "Active"
    services: list[str] = []
    sort_order: int = 0


class ContainerCreate(ContainerBase):
    pass


class ContainerUpdate(ContainerBase):
    pass


class ContainerRead(ContainerBase):
    id: int


class ServiceBase(CamelModel):
    device_id: int
    service_name: str
    container_name: str | None = None
    host_port: str | None = None
    function: str | None = None
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceRead(ServiceBase):
    id: int


class NetworkEntityBase(CamelModel):
    device_id: int
    entity_type: str  # 'isp' | 'vlan' | 'switch'
    name: str
    spec: dict = {}
    sort_order: int = 0


class NetworkEntityCreate(NetworkEntityBase):
    pass


class NetworkEntityUpdate(NetworkEntityBase):
    pass


class NetworkEntityRead(NetworkEntityBase):
    id: int


class DeviceBase(CamelModel):
    device_key: str
    category: str  # 'proxmox' | 'raspberry_pi' | 'network'
    name: str
    summary: str | None = None
    ip_address: str | None = None
    status: str | None = None
    hardware: list[dict] = []
    extra: dict = {}
    sort_order: int = 0


class DeviceCreate(DeviceBase):
    pass


class DeviceUpdate(DeviceBase):
    pass


class DeviceRead(DeviceBase):
    id: int


class DeviceWithChildren(DeviceRead):
    containers: list[ContainerRead] = []
    services: list[ServiceRead] = []
    network_entities: list[NetworkEntityRead] = []


class HomelabResponse(CamelModel):
    proxmox: DeviceWithChildren | None = None
    raspberry_pi: DeviceWithChildren | None = None
    network: DeviceWithChildren | None = None
