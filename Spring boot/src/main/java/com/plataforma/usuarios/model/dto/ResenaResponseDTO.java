package com.plataforma.usuarios.model.dto;

import java.time.LocalDateTime;

public class ResenaResponseDTO {
    private Long id;
    private Long usuarioId;
    private String itemId;
    private String tipo;
    private String contenido;
    private Integer puntuacion;
    private LocalDateTime fechaCreacion;
    private String imagenUrl;

    public ResenaResponseDTO(Long id, Long usuarioId, String itemId, String tipo,
                             String contenido, Integer puntuacion,
                             LocalDateTime fechaCreacion, String imagenUrl) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.itemId = itemId;
        this.tipo = tipo;
        this.contenido = contenido;
        this.puntuacion = puntuacion;
        this.fechaCreacion = fechaCreacion;
        this.imagenUrl = imagenUrl;
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getItemId() { return itemId; }
    public String getTipo() { return tipo; }
    public String getContenido() { return contenido; }
    public Integer getPuntuacion() { return puntuacion; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public String getImagenUrl() { return imagenUrl; }
}
