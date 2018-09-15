import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./components/home.component";

// Importar usuarios
import { EditarUsuarioComponent } from "./components/usuarios/editar-usuario.component";

// Importar serie
import { ListaSerieComponent } from "./components/series/serie/lista-serie.component";
import { NuevaSerieComponent } from "./components/series/serie/nueva-serie.component";
import { EditarSerieComponent } from "./components/series/serie/editar-serie.component";
import { VerSerieComponent } from "./components/series/serie/ver-serie.component";

// Importar temporadas
import { NuevaTemporadaComponent } from "./components/series/temporada/nueva-temporada.component";
import { EditarTemporadaComponent } from "./components/series/temporada/editar-temporada.component";
import { VerTemporadaComponent } from "./components/series/temporada/ver-temporada.component";

// Importar capitulos
import { NuevoCapituloComponent } from "./components/series/capitulos/nuevo-capitulo.component";
import { ActualizarCapituloComponent } from './components/series/capitulos/actualizar-capitulo.component';
import { ReproductorComponent } from "./components/series/capitulos/reproductor.component";

// Importar actores
import { NuevoActorComponent } from './components/series/actor/nuevo-actor.component';
import { EditarActorComponent } from "./components/series/actor/editar-actor.component";
import { VerActorComponent } from "./components/series/actor/ver-actor.component";

// Importar artistas musicales
import { ListaArtistaComponent } from "./components/musica/artistas/lista-artista.component";
import { NuevoArtistaComponent } from "./components/musica/artistas/nuevo-artista.component";
import { EditarArtistaComponent } from "./components/musica/artistas/editar-artista.component";
import { VerArtistaComponent } from "./components/musica/artistas/ver-artista.component";

// Importar albums para artistas musicales
import { NuevoAlbumComponent } from "./components/musica/albums/nuevo-album.component";
import { EditarAlbumComponent } from "./components/musica/albums/editar-album.component";
import { VerAlbumComponent } from "./components/musica/albums/ver-album.component";

// Importar discos para los albums de los artistas musicales
import { NuevoDiscoComponent } from "./components/musica/discos/nuevo-disco.component";
import { EditarDiscoComponent } from "./components/musica/discos/editar-disco.component";
import { VerDiscoComponent } from "./components/musica/discos/ver-disco.component";

// Importar canciones de los discos de los albums de los artistas musicales
import { NuevaCancionComponent } from "./components/musica/canciones/nueva-cancion.component";
import { EditarCancionComponent } from "./components/musica/canciones/editar-cancion.component";
import { NuevaPeliculaComponent } from "./components/peliculas/pelicula/nueva-pelicula.component";
import { ListaPeliculasComponent } from "./components/peliculas/pelicula/lista-pelicula.component";
import { EditarPeliculaComponent } from "./components/peliculas/pelicula/editar-pelicula.component";
import { VerPeliculaComponent } from "./components/peliculas/pelicula/ver-pelicula.component";

// Importar peliculas

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'mis-datos', component: EditarUsuarioComponent},

    // Rutas series
    {path: 'series', component: ListaSerieComponent},
    {path: 'nueva-serie', component: NuevaSerieComponent},
    {path: 'editar-serie/:id', component: EditarSerieComponent},
    {path: 'serie/:id', component: VerSerieComponent},
    {path: 'nuevo-actor-serie/:serie', component: NuevoActorComponent},

    // Rutas temporadas
    {path: 'nueva-temporada/:serie', component: NuevaTemporadaComponent},
    {path: 'editar-temporada/:id', component: EditarTemporadaComponent},
    {path: 'temporada/:id', component: VerTemporadaComponent},

    // Rutas capitulos
    {path: 'nuevo-capitulo/:temporada', component: NuevoCapituloComponent},
    {path: 'editar-capitulo/:id', component: ActualizarCapituloComponent},
    {path: 'reproductor/:id', component: ReproductorComponent},

    // Rutas actores
    {path: 'nuevo-actor', component: NuevoActorComponent},
    {path: 'editar-actor/:id', component: EditarActorComponent},
    {path: 'actor/:id', component: VerActorComponent},
    {path: 'nueva-serie-actor/:id', component: NuevoActorComponent},

    // Ruta artistas musicales
    {path: 'nuevo-artista', component: NuevoArtistaComponent},
    {path: 'editar-artista/:id', component: EditarArtistaComponent},
    {path: 'artistas', component: ListaArtistaComponent},
    {path: 'artista/:id', component: VerArtistaComponent},

    // Ruta albums para artistas musicales
    {path: 'nuevo-album/:artista', component: NuevoAlbumComponent},
    {path: 'editar-album/:id', component: EditarAlbumComponent},
    {path: 'album/:id', component: VerAlbumComponent},

    // Ruta discos para los albums de los artistas musicales
    {path: 'nuevo-disco/:album', component: NuevoDiscoComponent},
    {path: 'editar-disco/:id', component: EditarDiscoComponent},
    {path: 'disco/:id', component: VerDiscoComponent},

    // Ruta canciones para los albums de los artistas musicales
    {path: 'nueva-cancion/:disco', component: NuevaCancionComponent},
    {path: 'editar-cancion/:id', component: EditarCancionComponent},

    // Rutas peliculas

    // Peliculas
    {path: 'nueva-pelicula', component: NuevaPeliculaComponent},
    {path: 'editar-pelicula/:id', component: EditarPeliculaComponent},
    {path: 'peliculas', component: ListaPeliculasComponent},
    {path: 'ver-pelicula/:id', component: VerPeliculaComponent},
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);