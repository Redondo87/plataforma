package Plataforma.Usuarios.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import Plataforma.Usuarios.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    // Podés agregar métodos como buscar por email si querés después
}
