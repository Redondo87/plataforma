package com.plataforma.usuarios.controller;

import com.plataforma.usuarios.model.LibroUsuario;
import com.plataforma.usuarios.model.Usuario;
import com.plataforma.usuarios.model.repository.LibroUsuarioRepository;
import com.plataforma.usuarios.model.repository.UsuarioRepository;
import com.plataforma.usuarios.model.dto.LibroUsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros-usuarios")
public class LibroUsuarioController {

    @Autowired
    private LibroUsuarioRepository libroUsuarioRepository; // Repositorio para la tabla libros_usuarios

    @Autowired
    private UsuarioRepository usuarioRepository; // Repositorio para la tabla usuarios

    // Endpoint para añadir un libro a la lista de un usuario
    @PostMapping
    public LibroUsuario agregarLibro(@RequestBody LibroUsuarioDTO dto) {
         System.out.println("DTO recibido: " + dto);
        // Busca al usuario por ID
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crea un objeto LibroUsuario y lo rellena con los datos del DTO
        LibroUsuario libroUsuario = new LibroUsuario();
        libroUsuario.setUsuario(usuario); // Relación con el usuario
        libroUsuario.setLibroId(dto.getLibroId()); // ID del libro (Google Books )
        libroUsuario.setEstado(dto.getEstado()); // Estado: lectura, terminado, espera, plan para leer
        libroUsuario.setPuntuacion(dto.getPuntuacion()); // Puntuación del 1 al 10

        // Guarda en la base de datos y devuelve el objeto guardado
        return libroUsuarioRepository.save(libroUsuario);
    }

    // Endpoint para obtener todos los libros marcados por un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<LibroUsuario> obtenerLibrosUsuario(@PathVariable Long usuarioId) {
        return libroUsuarioRepository.findByUsuarioId(usuarioId);
    }
}
