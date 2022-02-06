import { Test, TestingModule } from '@nestjs/testing';
import { HotelsController } from 'src/hotels/controller/hotels.controller';
import { HotelsService } from 'src/hotels/service/hotels/hotels.service';

describe('HotelsController', () => {
  let controller: HotelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelsController],
      providers: [HotelsService],
    }).compile();

    controller = module.get<HotelsController>(HotelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
