# NestJS API
- nestjs의 api와 테스트들을 살펴보기.
___


## Install
- npm install -g @nestjs/cli
- npm i class-validator class-transformer
- npm i @nestjs/mapped-types
___


## Study
- NestJS
  - node.js의 프레임워크이며 Express위에서 움직이며 Fastify로 바꾸어도 됨.
  - express의 middleware와 비슷함.
  - 시작점은 main.ts파일을 갖으며 무조건 이 이름으로 있어야함 (루트 모듈)

- *.module.ts
  - @Module() 와 같은 decorator와 함께쓰임 (클래스에 함수기능을 추가할 수 있음)
  - 특정 기능에 대한 컨트롤러와 서비스를 연결하여 모듈로 갖는 파일.

- *.controller.ts
  - 기본적은 url을 가져오고 함수를 실행함.
  - express의 라우터와 같은 존재임.
  - @Get과 같은 express의 get라우터와 동일한 역할을 함.
  - 쉽게말해, url을 가져오고 함수를 싫행하는 역할을 함.
  - @Controller('Entry Point'): Entry Point에 대한 이름을 적어줌.
    ```ts
    @Controller('movies') // localhost:3000/movies에 대한 컨트롤러임.
    export class MoviesController { }
    ```

- *.service.ts
  - controller에서는 기본적으로 라우터에 대한 값을 반환해 줌.
  - 이때, controller에서는 비지니스 로직을 구분지어야 함.
  - 단순히 controller는 url을 가져오는 역할을 하며, 해당 url에대한 function을 실행함.
  - 서비스는 일반적으로 실제 function을 가져오는 부분임.
  - controller에서 사용하는 라우터에서 필요한 함수를 정의함.
  - DB에도 저장할 수 있음.

- @Get('param')
  - 특정 쿼리에 대한 값을 알고싶다면, nestjs에서는 요청을해야함.
  - 무언가 필요하면 직접 요청을 해야함.
    ```ts
    @Controller('food')
    export class FoodController {
      @Get(':name')
      getFoodByName(@Param('name') foodName: string) {
        return `find ${foodName}.`;
      }
      // 주의! Get(args)과 Param(args)의 인자값 args는 꼭 같아야함.
    }
    ```
  - @Param('name')과 같이 decorator를 통해서 파라미터를 요청하는것임.

- @Post()
  - 마찬가지로 모든 요청에 대해서 요청하지 않는다면, 아무것도 제공되지 않음(필요한 파라미터를 요청해야함)
    ```ts
    @Controller('food')
    export class FoodController {
      @Post()
      getBody(@Body() args): string{
        return `${JSON.stringify(args)}`;
      }
    }
    // 주의! Body요청시 @Body()는 비어있어야 함.
    ```

- @Put, @Patch
  - Put: 전체를 업데이트 / Patch: 리소스의 일부분만 업데이트.

- @Query()
  ```ts
  @Get('search')
  getMovie(@Query('year') searchingYear: string) :string {
    return `searching: ${year}`;
  })
  // 주의! 위 getMovie()이전과 동일한 엔드포인트를 갖게되지 않도록 해야함.
  // 만약, @Get(:id)를 먼저 선언한 경우, @Get('search')는 실행이 안되므로 @Get(:id)보다 먼저 선언하도록 할 것.
  ```

- 유효성 검증 Pipe
  - DTO를 통해 코드를 간결하게해주었음.
  - 하지만 이러한 DTO를 사용함에 검증이 요구됨.
  - NestJS에서는 main.ts에서 `app.useGlobalPipes(new ValidationPipe())`를 통해 해당 DTO에 대한 유효성 검사를 할 수 있음.
    (class-validator와 class-transformer를 설치)
    ```ts
      // 먼저, DTO에서 classValidator의 decorator를 작성을 해두어야 함.
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true, // DTO에 존재하지 않는 properties들이 요청에 대해서 저장되는 것을 방지함.
        forbidNonWhitelisted: true, // DTO에 알맞지 않는, 잘못된 property가 들어오는경우 요청을 차단할 수 있음.
        transform: true, // url 쿼리요청에 대한 params들은 string형식임. 이것을 DTO의 다른형식에 맞추어 자동으로 타입 변환이되도록 도와줌.
      }));
      await app.listen(3000);
    ```

- PartialType
  - npm i @nestjs/mapped-types
  - 데이터의 수정되는 필드에 대해서는 부분적으로 null체크를 하는것에 편리함을 주고자 사용함.
  - 아래의 예시는 `생성할때의 필수 property`를 `업데이트하는 property`에 undefined값을 허용하도록 함.
    ```ts
      // create-movie.dto.ts
      export class CreateMovieDTO {
        @IsString()
        title: string;

        @IsYear()
        year: number;

        @IsString()
        genres: string[];
      }
    ```
    ```ts
      // update-movie.dto.ts
      export class UpdateMovieDTO extends PartialType(CreateMoviceDTO) {}
    ```

- 앱을 만들때에는 모듈로 분리를해서 app.module에서 해당 모듈들을 불러올 것.
- dependencies injection
  - 1. provider에 service를 inject(주입)
  - 2. service에서는 @Injectable()를 사용.
  - 3. controller에서는 constructor를 통해서 provider를 통해 제공되는 service의 객체를 갖음.
- nestjs는 express의 위에서 돌아감.
  - 그래서 컨트롤러에서 Request, Response의 객체가 필요하면 사용.
  - 그런데 @Req, @Res와 같은 express객체를 직접적으로 호출하는것은 좋은방법이 아님.
  ```
  1. NestJS는 Express 프레임워크에서 사용.
  2. 또한 Fastify와 같은 다른 라이브러리와도 호환이 됨.
  3. 그래서 Req와 Res객체를 많이 사용하지 않는것이 중요함.
  ```
    ```ts
      // 아래와 같은경우 Express객체를 사용하는 Req,Res는 추천하는 방법이 아님.
      // Fastify와 같은 Express와는 다른 방법을 사용할 수 도 있으므로.
      @Get()
      getData(@Req() req, @Res(), res) {
        res.json();
        return this.dataService.getAll();
      }
    ```
___


## Commands
```bash
$ n est new  # nestjs의 프로젝트를 초기화.
$ nest g co [파일명]  
# g: generate, co: controller 으로 특정 모듈에 필요한 컨트롤러를 갖는 'src/[파일명]/[파일명].controller'생성해줌. 
# 또한 app.module.ts에서 controllers에서 자동으로 추가됨.
$ nest g s [파일명]
# g: generate, s: service 으로 특정 모듈의 서비스를 작성해주며, app.modules.ts에 자동으로 등록됨.

```