package com.plataforma.usuarios.model.dto;

import lombok.Data;

@Data
public class SerieUsuarioDTO {
    private Long usuarioId; // este lo tomaremos del token / sesión
    private Long itemId;
    private String titulo;
    private String tipo; // "serie" o "pelicula"
    private String estado;
    private Integer puntuacion;
    private Integer temporada;
    private Integer capitulo;
}
