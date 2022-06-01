package vm.projects.SpringSecurityApp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.service.UserService;

@Controller
public class AuthController {

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    private final UserService userService;

    @GetMapping("/login")
    public String getLoginPage() {
        return "login";
    }

    @GetMapping("/reg")
    public String newUserForm(User user) {
        return "user-create";
    }

    @PostMapping("/reg")
    public String newUser(User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }
}
