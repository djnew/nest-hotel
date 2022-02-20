import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginGuard } from '../auth/guard/login.guard';
import { I_USER_SERVICE, IUserService } from '../users/base/users.service.base';
import { UserRole } from '../users/base/users.types.base';
import { Roles } from '../users/decorator/roles.decorator';
import {
  I_SUPPORT_REQUESTS_REPOSITORY,
  ISupportRequestsRepository,
} from './base/support-requests.repository.base';
import { SendMessageDTO } from './dto/send-message.dto';
import {
  GetChatListParamsDTO,
  SupportRequestsDto,
} from './dto/support-requests.dto';
import { SupportRequestClientService } from './service/support-request-client.service';
import { SupportRequestEmployeeService } from './service/support-request-employee.service';
import { SupportRequestService } from './service/support-request.service';

@Controller('api')
export class ChatController {
  constructor(
    private readonly supportRequestClient: SupportRequestClientService,
    private readonly supportRequestEmployee: SupportRequestEmployeeService,
    private readonly supportRequest: SupportRequestService,
    @Inject(I_USER_SERVICE) private readonly userService: IUserService,
    @Inject(I_SUPPORT_REQUESTS_REPOSITORY)
    private readonly supportRequestsRepository: ISupportRequestsRepository,
  ) {}

  @Post('client/support-requests/')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  addSupportRequestMessage(@Req() req, @Body() message: SupportRequestsDto) {
    return this.supportRequestClient.createSupportRequest({
      ...message,
      user: req.user.id,
    });
  }

  @Get('client/support-requests/')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getSupportRequestsClient(@Req() req, @Query() params: GetChatListParamsDTO) {
    const { limit, offset, isActive } = params;
    return this.supportRequest.findSupportRequests({
      user: req.user.id,
      limit,
      offset,
      isActive,
    });
  }

  @Get('manager/support-requests/')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  getSupportRequestsManager(@Query() params: GetChatListParamsDTO) {
    if (!params.user) {
      throw new BadRequestException();
    }
    const { limit, offset, isActive } = params;
    return this.supportRequest.findSupportRequests({
      limit,
      offset,
      isActive,
    });
  }

  @Get('common/support-requests/:id/messages')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  async getSupportRequestMessages(@Req() req, @Param('id') id: string) {
    const user = req.user;
    const supportRequestId = this.supportRequestsRepository.makeId(id);
    if (user.role === UserRole.Client) {
      const access = await this.supportRequestClient.checkAccess(
        supportRequestId,
        user.id,
      );
      if (!access) {
        return new ForbiddenException();
      }
    }

    return this.supportRequest.getMessages(supportRequestId);
  }

  @Post('common/support-requests/:id/messages')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  async sendSupportRequestMessages(
    @Req() req,
    @Param('id') id: string,
    @Body() message: SendMessageDTO,
  ) {
    const user = req.user;
    const supportRequestId = this.supportRequestsRepository.makeId(id);
    if (user.role === UserRole.Client) {
      const access = await this.supportRequestClient.checkAccess(
        supportRequestId,
        user.id,
      );
      if (!access) {
        return new ForbiddenException();
      }
    }

    return await this.supportRequest.sendMessage({
      author: user.id,
      supportRequest: supportRequestId,
      ...message,
    });
  }

  @Post('common/support-requests/:id/messages/read')
  @Roles(UserRole.Admin)
  @UseGuards(LoginGuard)
  async setSupportRequestMessageIsRead(@Req() req, @Param('id') id: string) {
    if (req.user.type === UserRole.Manager) {
      return this.supportRequestEmployee.markMessagesAsRead(
        this.supportRequestsRepository.makeId(id),
      );
    } else {
      return this.supportRequestClient.markMessagesAsRead(
        this.supportRequestsRepository.makeId(id),
      );
    }
  }
}
