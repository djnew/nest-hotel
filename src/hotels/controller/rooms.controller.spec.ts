import { Test, TestingModule } from '@nestjs/testing';
import { RoomsController } from 'src/hotels/controller/rooms.controller';
import { RoomsService } from 'src/hotels/service/rooms/rooms.service';

describe('RoomsController', () => {
  let controller: RoomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsController],
      providers: [RoomsService],
    }).compile();

    controller = module.get<RoomsController>(RoomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
