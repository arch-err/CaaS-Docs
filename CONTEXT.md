# CaaS Catalog

The catalog describes packages offered through the Container-as-a-Service
platform and the external projects from which those packages are derived.

## Language

**CaaS entry**: A catalog record for exactly one Container or Chart. _Avoid_:
Item, catalog item

**Container**: A maintained OCI image distributed by the platform. It is the
image package, not a running container instance. _Avoid_: Image, runtime

**Chart**: A maintained Helm chart distributed by the platform. A Chart
references every Container it deploys from this catalog. _Avoid_: Template,
application

**Upstream**: The external project from which a Container or Chart is packaged,
including its identity and authoritative links. It is distinct from the platform
owner of the CaaS entry. _Avoid_: Vendor, owner
