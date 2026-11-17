# Tenant and plugin boundaries

Organization, project and environment context scopes credentials and applicable policies. Management APIs enforce user permissions; inference endpoints enforce their accepted credential scope.

Plugins run in separate worker processes with declared permissions and runtime lifecycle controls. Process separation is not by itself a container, virtual machine, syscall filter or complete host-security sandbox. Install trusted plugins and restrict their filesystem/network access using deployment controls where needed.

Protect database and host-administrator access separately. Configure and test the intended tenant/project boundaries; avoid sharing privileged machine credentials with applications or plugins.

See [authentication](/security/authentication), [authorization](/security/authorization) and [plugin protocol](/build/hdks/protocol).
