package com.plataforma.usuarios.model.dto;

public class ResenaDTO {

    private Long usuarioId;
    private String itemId;
    private String tipo;

    // ✅ antes era "texto"
    private String contenido;

    private Integer puntuacion;

    public Long getUsuarioId() { return usuarioId; }
    public String getItemId() { return itemId; }
    public String getTipo() { return tipo; }

    public String getContenido() { return contenido; }

    public Integer getPuntuacion() { return puntuacion; }

    // (recomendado añadir setters si vas a deserializar JSON)
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }
}
