package com.plataforma.usuarios.model.dto;

import lombok.Data;

@Data
public class LibroUsuarioDTO {
    private Long usuarioId;
    private String libroId;
    private String estado;
    private Integer puntuacion;
}
