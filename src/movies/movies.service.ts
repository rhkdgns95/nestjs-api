import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovideDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number): Movie | undefined {
    const movie = this.movies.find(movie => movie.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie width ID ${id} not found.`);
    }
    return movie;
  }
  deleteOne(id: number): boolean {
    this.getOne(id);
    this.movies = this.movies.filter(item => item.id !== id);
    return true;
  }

  create(movieData: CreateMovieDTO): boolean {
    this.movies = [
      ...this.movies,
      {
        id: this.movies.length + 1,
        ...movieData,
      },
    ];
    return true;
  }

  update(id: number, movieData: UpdateMovideDto) {
    this.getOne(id);
    this.movies = this.movies.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...movieData,
        };
      }
      return item;
    });
    return true;
  }
}
