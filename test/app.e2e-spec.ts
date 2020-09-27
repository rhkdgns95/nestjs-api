import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/app (GET)', () => {
    return request(app.getHttpServer())
      .get('/app')
      .expect(200)
      .expect('Welcome to...');
  });

  describe('/movies', () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([]);
    });

    it('POST 200', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Ant',
          year: 2020,
          genres: ['Scare'],
        })
        .expect(201);
    });

    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Ant',
          year: 2020,
          genres: ['Scare'],
          others: 'things...'
        })
        .expect(400);
    });

    it('DELETE', () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404);
      // .send({
      //   id: 1,
      // })
      // .expect(201);
    });
  });

  describe('/movies/:id', () => {
    it('GET 200', () => {
      return request(app.getHttpServer())
        .get('/movies/1')
        .expect(200);
    });
    it('GET 404', () => {
      return request(app.getHttpServer())
        .get('/movies/9999')
        .expect(404);
    });

    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({
          title: 'Ant2',
          genres: ['Sad'],
        })
        .expect(200);
    });

    it('PATCH 404', () => {
      return request(app.getHttpServer())
        .patch('/movies/9999')
        .send({
          title: 'Ant3',
          genres: ['Sad'],
        })
        .expect(404);
    });

    it('PATCH 400', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({
          title: 'Ant3',
          genres: ['Sad'],
          hacked: 'hacked...',
        })
        .expect(400);
    });

    it('DELETE 200', () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    });

    it('DELETE 404', () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(404);
    });
  });
});
