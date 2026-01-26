package com.plataforma.usuarios.model.repository;

import com.plataforma.usuarios.model.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResenaRepository extends JpaRepository<Resena, Long> {

    List<Resena> findByTipoIgnoreCaseAndItemIdOrderByFechaCreacionDesc(String tipo, String itemId);

    List<Resena> findAllByOrderByFechaCreacionDesc();

    List<Resena> findByTipoIgnoreCaseOrderByFechaCreacionDesc(String tipo);

    List<Resena> findByUsuarioId(Long usuarioId);
}
