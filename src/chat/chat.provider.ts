import {
  I_SUPPORT_REQUEST_CLIENT_SERVICE,
  SupportRequestClientService,
} from './service/support-request-client.service';
import {
  I_SUPPORT_REQUEST_EMPLOYEE_SERVICE,
  SupportRequestEmployeeService,
} from './service/support-request-employee.service';
import {
  I_SUPPORT_REQUEST_SERVICE,
  SupportRequestService,
} from './service/support-request.service';

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
];
