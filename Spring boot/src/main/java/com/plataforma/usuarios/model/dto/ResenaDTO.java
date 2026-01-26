package com.plataforma.usuarios.model.dto;

public class ResenaDTO {
    private Long usuarioId;
    private String itemId;
    private String tipo;
    private String contenido;
    private Integer puntuacion;

    // ✅ NUEVO
    private String imagenUrl;

    public Long getUsuarioId() { return usuarioId; }
    public String getItemId() { return itemId; }
    public String getTipo() { return tipo; }
    public String getContenido() { return contenido; }
    public Integer getPuntuacion() { return puntuacion; }
    public String getImagenUrl() { return imagenUrl; }

    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
