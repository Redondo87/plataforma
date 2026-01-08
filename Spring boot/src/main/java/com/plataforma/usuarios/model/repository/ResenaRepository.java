package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    // ✅ Para listar reseñas de un item ordenadas por fecha
    List<Resena> findByTipoAndItemIdOrderByFechaCreacionDesc(String tipo, String itemId);

    // (si lo sigues usando en alguna parte, lo puedes dejar también)
    List<Resena> findByUsuarioId(Long usuarioId);
}
