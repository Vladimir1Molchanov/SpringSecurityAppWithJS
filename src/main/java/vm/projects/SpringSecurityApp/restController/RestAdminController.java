package vm.projects.SpringSecurityApp.restController;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.service.UserService;

import javax.validation.Valid;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class RestAdminController {

    private final UserService userService;

    public RestAdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public void saveUser(@RequestBody User user) {
        userService.saveUser(user);
    }

    @GetMapping()
    public List<User> findAll() {
        return userService.findAll()
                .stream()
                .sorted(Comparator.comparingLong(User::getId))
                .collect(Collectors.toList());
    }

    @GetMapping("/authUser")
    public User getAuthUser() {
        return userService.findByName(SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName()
        );
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