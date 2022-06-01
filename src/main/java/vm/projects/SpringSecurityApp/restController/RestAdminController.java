package vm.projects.SpringSecurityApp.restController;

import org.springframework.web.bind.annotation.*;
import vm.projects.SpringSecurityApp.model.Role;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.service.RoleService;
import vm.projects.SpringSecurityApp.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class RestAdminController {

    private final UserService userService;
    private final RoleService roleService;

    public RestAdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping()
    public void saveUser(@RequestBody User user) {
        userService.saveUser(user);
    }

    @GetMapping("/users")
    public List<User> findAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/roles")
    public List<Role> findAllRoles() {
        return roleService.findAllRoles();
    }

    @GetMapping("/authUser")
    public User getAuthUser() {
        return userService.getAuthUser();
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PutMapping("/{id}")
    public void apiUpdateUser(@PathVariable("id") long id, @RequestBody @Valid User user) {
        userService.updateUser(user, id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}