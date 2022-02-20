import { I_MESSAGES_REPOSITORY } from './base/messages.repository.base';
import { I_SUPPORT_REQUEST_CLIENT_SERVICE } from './base/support-request-client.service.base';
import { I_SUPPORT_REQUEST_EMPLOYEE_SERVICE } from './base/support-request-employee.service.base';
import { I_SUPPORT_REQUEST_SERVICE } from './base/support-request.service.base';
import { I_SUPPORT_REQUESTS_REPOSITORY } from './base/support-requests.repository.base';
import { MessagesRepository } from './repository/messages.repository';
import { SupportRequestsRepository } from './repository/support-requests.repository';
import { SupportRequestClientService } from './service/support-request-client.service';
import { SupportRequestEmployeeService } from './service/support-request-employee.service';
import { SupportRequestService } from './service/support-request.service';

export const ChatProvider = [
  {
    provide: I_SUPPORT_REQUEST_SERVICE,
    useClass: SupportRequestService,
  },
  {
    provide: I_SUPPORT_REQUEST_CLIENT_SERVICE,
    useClass: SupportRequestClientService,
  },
  {
    provide: I_SUPPORT_REQUEST_EMPLOYEE_SERVICE,
    useClass: SupportRequestEmployeeService,
  },
  {
    provide: I_SUPPORT_REQUESTS_REPOSITORY,
    useClass: SupportRequestsRepository,
  },
  {
    provide: I_MESSAGES_REPOSITORY,
    useClass: MessagesRepository,
  },
];
