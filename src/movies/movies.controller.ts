import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieDTO } from './dto/create-movie.dto';
import { UpdateMovideDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviesService.getAll();
  }

  @Get('search')
  get(@Query('year') searchingYear: number): string {
    return `Seaching...: ${searchingYear} `;
  }

  @Get(':id')
  getById(@Param('id') movieId: number): Movie {
    return this.moviesService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDTO): boolean {
    return this.moviesService.create(movieData);
  }

  @Delete(':id')
  remove(@Param('id') movieId: number): boolean {
    return this.moviesService.deleteOne(movieId);
  }

  @Patch(':id')
  update(
    @Param('id') movieId: number,
    @Body() movieData: UpdateMovideDto,
  ): boolean {
    return this.moviesService.update(movieId, movieData);
  }
}
