package com.plataforma.usuarios.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "series_usuarios")
public class SerieUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private Long itemId;         // ID de TMDB
    private String titulo;       // Nombre de la serie/película
    private String tipo;         // "serie" o "pelicula"
    private String estado;
    private Integer puntuacion;

    private Integer temporada;   // opcional, solo si es serie
    private Integer capitulo;    // opcional, solo si es serie

    @Column(name = "fecha_creacion", updatable = false, insertable = false)
    private Timestamp fechaCreacion;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public Integer getTemporada() { return temporada; }
    public void setTemporada(Integer temporada) { this.temporada = temporada; }

    public Integer getCapitulo() { return capitulo; }
    public void setCapitulo(Integer capitulo) { this.capitulo = capitulo; }

    public Timestamp getFechaCreacion() { return fechaCreacion; }
}
