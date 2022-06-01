package vm.projects.SpringSecurityApp.service;

import vm.projects.SpringSecurityApp.model.Role;

import java.util.List;

public interface RoleService {

    List<Role> findAllRoles();

    Role getById(Long id);

}
