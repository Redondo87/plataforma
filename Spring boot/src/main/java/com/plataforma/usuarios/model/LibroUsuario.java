package com.plataforma.usuarios.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "libros_usuarios")
public class LibroUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private String libroId;  
    private String estado;   
    private Integer puntuacion;

    @Column(name = "fecha_creacion", updatable = false, insertable = false)
    private Timestamp fechaCreacion;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public String getLibroId() { return libroId; }
    public void setLibroId(String libroId) { this.libroId = libroId; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public Timestamp getFechaCreacion() { return fechaCreacion; }
}