package vm.projects.SpringSecurityApp.controller;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import vm.projects.SpringSecurityApp.model.User;
import vm.projects.SpringSecurityApp.service.UserService;


@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{name}")
    public String showUser(@PathVariable String name, Model model){
        User user = userService.findByName(name);
        StringBuilder roles = new StringBuilder(" with roles: ");
        for (GrantedAuthority ga : user.getAuthorities()){
            roles.append(ga.getAuthority());
        }
        model.addAttribute("userName", name);
        model.addAttribute("roles", roles);
        model.addAttribute("user", user);

        return "user";
    }
}