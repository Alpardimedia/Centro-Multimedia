import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

// Importacion global
import { AppComponet } from './app.component';
import { HomeComponent } from './components/home.component';

// Importar usuarios
import { EditarUsuarioComponent } from './components/usuarios/editar-usuario.component';

// Importar series
import { ListaSerieComponent } from './components/series/serie/lista-serie.component';
import { NuevaSerieComponent } from './components/series/serie/nueva-serie.component';
import { EditarSerieComponent } from './components/series/serie/editar-serie.component';
import { VerSerieComponent } from './components/series/serie/ver-serie.component';
// Importar temporadas
import { NuevaTemporadaComponent } from './components/series/temporada/nueva-temporada.component';
import { EditarTemporadaComponent } from './components/series/temporada/editar-temporada.component';
import { VerTemporadaComponent } from './components/series/temporada/ver-temporada.component';
// Importar capitulos
import { NuevoCapituloComponent } from './components/series/capitulos/nuevo-capitulo.component';
import { ActualizarCapituloComponent } from './components/series/capitulos/actualizar-capitulo.component';
import { ReproductorComponent } from './components/series/capitulos/reproductor.component';
// Importar actores
import { NuevoActorComponent } from './components/series/actor/nuevo-actor.component';
import { EditarActorComponent } from './components/series/actor/editar-actor.component';
import { VerActorComponent } from './components/series/actor/ver-actor.component';

// ------------------------------------------------------------- //
// Importar artistas
import { ListaArtistaComponent } from "./components/musica/artistas/lista-artista.component";
import { NuevoArtistaComponent } from './components/musica/artistas/nuevo-artista.component';
import { EditarArtistaComponent } from './components/musica/artistas/editar-artista.component';
import { VerArtistaComponent } from './components/musica/artistas/ver-artista.component';

// Importar albums
import { NuevoAlbumComponent } from './components/musica/albums/nuevo-album.component';
import { EditarAlbumComponent } from './components/musica/albums/editar-album.component';
import { VerAlbumComponent } from './components/musica/albums/ver-album.component';
import { ListaAlbumComponent } from './components/musica/albums/lista-album.component';

// Importar discos
import { NuevoDiscoComponent } from './components/musica/discos/nuevo-disco.component';
import { EditarDiscoComponent } from './components/musica/discos/editar-disco.component';
import { VerDiscoComponent } from './components/musica/discos/ver-disco.component';

// Importar canciones
import { NuevaCancionComponent } from './components/musica/canciones/nueva-cancion.component';
import { EditarCancionComponent } from './components/musica/canciones/editar-cancion.component';
import { ReproductorCancionComponent } from './components/musica/canciones/reproductor-cancion.component';

// Importar peliculas
import { NuevaPeliculaComponent } from './components/peliculas/pelicula/nueva-pelicula.component';
import { ListaPeliculasComponent } from './components/peliculas/pelicula/lista-pelicula.component';
import { EditarPeliculaComponent } from './components/peliculas/pelicula/editar-pelicula.component';
import { VerPeliculaComponent } from './components/peliculas/pelicula/ver-pelicula.component';

@NgModule({
  declarations: [
    /* Componentes globales */
    AppComponet,
    HomeComponent,

    /* Componentes de Usuarios */
    EditarUsuarioComponent,

    /* Componentes de Serie */
    ListaSerieComponent,
    NuevaSerieComponent,
    EditarSerieComponent,
    VerSerieComponent,

    /* Componentes de Temporadas */
    NuevaTemporadaComponent,
    EditarTemporadaComponent,
    VerTemporadaComponent,

    /* Componentes de Capitulos */
    NuevoCapituloComponent,
    ActualizarCapituloComponent,
    ReproductorComponent,

    /* Componentes de Actores */
    NuevoActorComponent,
    EditarActorComponent,
    VerActorComponent,

    /* Componentes de Artistas musicales */
    NuevoArtistaComponent,
    EditarArtistaComponent,
    ListaArtistaComponent,
    VerArtistaComponent,

    /* Componentes de Albums para Artistas musicales */
    NuevoAlbumComponent,
    EditarAlbumComponent,
    VerAlbumComponent,
    ListaAlbumComponent,

    /* Componentes de Discos para los Albums de los Artistas musicales */
    NuevoDiscoComponent,
    EditarDiscoComponent,
    VerDiscoComponent,

    /* Componentes de para las Canciones de los Discos de los Albums de los Artistas musicales */
    NuevaCancionComponent,
    EditarCancionComponent,
    ReproductorCancionComponent,

    /* Componentes de peliculas */

    /* Peliculas */
    NuevaPeliculaComponent,
    EditarPeliculaComponent,
    ListaPeliculasComponent,
    VerPeliculaComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponet]
})
export class AppModule { }
