from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class HomelabDevice(Base):
    __tablename__ = "homelab_devices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    device_key: Mapped[str] = mapped_column(Text, unique=True, index=True)
    category: Mapped[str] = mapped_column(Text)  # 'proxmox' | 'raspberry_pi' | 'network'
    name: Mapped[str] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str | None] = mapped_column(Text, nullable=True)
    hardware: Mapped[list] = mapped_column(JSONB, default=list)
    extra: Mapped[dict] = mapped_column(JSONB, default=dict)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    containers: Mapped[list["HomelabContainer"]] = relationship(
        back_populates="device",
        cascade="all, delete-orphan",
        order_by="HomelabContainer.sort_order",
    )
    services: Mapped[list["HomelabService"]] = relationship(
        back_populates="device",
        cascade="all, delete-orphan",
        order_by="HomelabService.sort_order",
    )
    network_entities: Mapped[list["HomelabNetworkEntity"]] = relationship(
        back_populates="device",
        cascade="all, delete-orphan",
        order_by="HomelabNetworkEntity.sort_order",
    )


class HomelabContainer(Base):
    __tablename__ = "homelab_containers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    container_key: Mapped[str] = mapped_column(Text, unique=True, index=True)
    device_id: Mapped[int] = mapped_column(
        ForeignKey("homelab_devices.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(Text)
    ip_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    purpose: Mapped[str | None] = mapped_column(Text, nullable=True)
    resources: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, default="Active")
    services: Mapped[list] = mapped_column(JSONB, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    device: Mapped[HomelabDevice] = relationship(back_populates="containers")


class HomelabService(Base):
    __tablename__ = "homelab_services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    device_id: Mapped[int] = mapped_column(
        ForeignKey("homelab_devices.id", ondelete="CASCADE")
    )
    service_name: Mapped[str] = mapped_column(Text)
    container_name: Mapped[str | None] = mapped_column(Text, nullable=True)
    host_port: Mapped[str | None] = mapped_column(Text, nullable=True)
    function: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    device: Mapped[HomelabDevice] = relationship(back_populates="services")


class HomelabNetworkEntity(Base):
    __tablename__ = "homelab_network_entities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    device_id: Mapped[int] = mapped_column(
        ForeignKey("homelab_devices.id", ondelete="CASCADE")
    )
    entity_type: Mapped[str] = mapped_column(Text)  # 'isp' | 'vlan' | 'switch'
    name: Mapped[str] = mapped_column(Text)
    spec: Mapped[dict] = mapped_column(JSONB, default=dict)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    device: Mapped[HomelabDevice] = relationship(back_populates="network_entities")
