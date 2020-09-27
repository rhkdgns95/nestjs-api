import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    console.log('beforeEach()');
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const array = service.getAll();
      expect(array).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    it('should be an Defined', () => {
      service.create({
        title: 'King of the fight',
        year: 2014,
        genres: ['sad'],
      });
      expect(service.getOne(1)).toBeDefined();
      expect(service.getOne(1).id).toBe(1);
    });

    it('should throw a NotFoundException', () => {
      try {
        service.getOne(999999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Movie width ID 999999 not found.`);
      }
    });
  });

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'King of the fight',
        year: 2014,
        genres: ['sad'],
      });
      const allMovies = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(service.getAll()).toHaveLength(0);
      expect(afterDelete).toBeLessThan(allMovies);
    });
    it('should throw a NotFoundException', () => {
      try {
        service.deleteOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeMovies = service.getAll();
      service.create({
        year: 2017,
        title: 'Kingdom',
        genres: ['action'],
      });
      const afterMovies = service.getAll();
      const movie = service.getOne(1);
      expect(beforeMovies.length).toBeLessThan(afterMovies.length);
      expect(movie.id).toBe(1);
      expect(movie.title).toBe('Kingdom');
    });
  });

  describe('update', () => {
    it('should update a moive', () => {
      service.create({
        year: 2017,
        title: 'Kingdom',
        genres: ['action'],
      });
      const beforeMovie = service.getOne(1);
      service.update(1, {
        genres: ['Sad', 'Serious'],
      });
      const afterMovie = service.getOne(1);

      expect(beforeMovie.genres).toHaveLength(1);
      expect(afterMovie.genres).toHaveLength(2);
      expect(afterMovie.genres[0]).toBe('Sad');
      expect(afterMovie.genres[1]).toBe('Serious');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.update(1553, {
          title: 'The Ant',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
